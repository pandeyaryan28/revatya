import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreClient } from './firebase';

export interface ContactInquiryInput {
  fullName: string;
  email: string;
  organisation?: string;
  role?: string;
  category: string;
  message: string;
  location?: string;
  consent: boolean;
  sourcePage?: string;
}

export interface JoinInterestInput {
  fullName: string;
  email: string;
  location?: string;
  discipline: string;
  experienceSummary: string;
  portfolioUrl?: string;
  interestStatement: string;
  availability: string;
  consent: boolean;
}

export interface SubmissionResult {
  ok: boolean;
  referenceId: string;
  storageMode: 'firestore' | 'local-ledger';
  submittedAtIso: string;
}

const LOCAL_CONTACT_KEY = 'revatya_contact_inquiries_v1';
const LOCAL_JOIN_KEY = 'revatya_join_interest_v1';

function saveToLocalLedger(storageKey: string, payload: Record<string, unknown>): string {
  const refId = `RVT ${Date.now().toString(36).toUpperCase()} ${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;
  try {
    const existingRaw = window.localStorage.getItem(storageKey);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push({ referenceId: refId, ...payload });
    window.localStorage.setItem(storageKey, JSON.stringify(existing));
  } catch {
    // Ignore storage quota errors in restricted browsing contexts
  }
  return refId;
}

export async function submitContactInquiry(
  input: ContactInquiryInput
): Promise<SubmissionResult> {
  const submittedAtIso = new Date().toISOString();

  const cleanPayload: Record<string, unknown> = {
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    category: input.category,
    message: input.message.trim(),
    consent: Boolean(input.consent),
  };

  if (input.organisation?.trim()) cleanPayload.organisation = input.organisation.trim();
  if (input.role?.trim()) cleanPayload.role = input.role.trim();
  if (input.location?.trim()) cleanPayload.location = input.location.trim();
  if (input.sourcePage?.trim()) cleanPayload.sourcePage = input.sourcePage.trim();

  const db = getFirestoreClient();
  if (db && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const docRef = await addDoc(collection(db, 'contact_inquiries'), {
        ...cleanPayload,
        createdAt: serverTimestamp(),
      });
      return {
        ok: true,
        referenceId: docRef.id,
        storageMode: 'firestore',
        submittedAtIso,
      };
    } catch {
      // Fall through to resilient local ledger if network/rules block unconfigured client
    }
  }

  const referenceId = saveToLocalLedger(LOCAL_CONTACT_KEY, {
    ...cleanPayload,
    createdAt: submittedAtIso,
  });

  return {
    ok: true,
    referenceId,
    storageMode: 'local-ledger',
    submittedAtIso,
  };
}

export async function submitJoinInterest(
  input: JoinInterestInput
): Promise<SubmissionResult> {
  const submittedAtIso = new Date().toISOString();

  const cleanPayload: Record<string, unknown> = {
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    discipline: input.discipline,
    experienceSummary: input.experienceSummary.trim(),
    interestStatement: input.interestStatement.trim(),
    availability: input.availability,
    consent: Boolean(input.consent),
  };

  if (input.location?.trim()) cleanPayload.location = input.location.trim();
  if (input.portfolioUrl?.trim()) cleanPayload.portfolioUrl = input.portfolioUrl.trim();

  const db = getFirestoreClient();
  if (db && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const docRef = await addDoc(collection(db, 'join_interest'), {
        ...cleanPayload,
        createdAt: serverTimestamp(),
      });
      return {
        ok: true,
        referenceId: docRef.id,
        storageMode: 'firestore',
        submittedAtIso,
      };
    } catch {
      // Fall through to resilient local ledger
    }
  }

  const referenceId = saveToLocalLedger(LOCAL_JOIN_KEY, {
    ...cleanPayload,
    createdAt: submittedAtIso,
  });

  return {
    ok: true,
    referenceId,
    storageMode: 'local-ledger',
    submittedAtIso,
  };
}
