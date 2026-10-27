import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreClient } from './firebase';
import { sendGuildOrbitLead } from './guildOrbit';

export interface ContactInquiryInput {
  fullName: string;
  email: string;
  organisation?: string;
  role?: string;
  category: string;
  message: string;
  location?: string;
  consent?: boolean;
  sourcePage?: string;
  originatingPage?: string;
  pathwayId?: string;
}

export interface JoinInterestInput {
  fullName: string;
  email: string;
  location?: string;
  discipline: string;
  experienceSummary?: string;
  portfolioUrl?: string;
  interestStatement: string;
  availability?: string;
  consent?: boolean;
}

export interface SubmissionResult {
  ok: boolean;
  referenceId: string;
  storageMode: 'firestore' | 'local-ledger';
  submittedAtIso: string;
  guildOrbitSuccess?: boolean;
  guildOrbitMessageId?: string;
  guildOrbitTaskId?: string;
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
    consent: input.consent ?? true,
  };

  if (input.organisation?.trim()) cleanPayload.organisation = input.organisation.trim();
  if (input.role?.trim()) cleanPayload.role = input.role.trim();
  if (input.location?.trim()) cleanPayload.location = input.location.trim();
  if (input.sourcePage?.trim()) cleanPayload.sourcePage = input.sourcePage.trim();
  if (input.originatingPage?.trim()) cleanPayload.originatingPage = input.originatingPage.trim();
  if (input.pathwayId?.trim()) cleanPayload.pathwayId = input.pathwayId.trim();

  let referenceId = '';
  let storageMode: 'firestore' | 'local-ledger' = 'local-ledger';

  const db = getFirestoreClient();
  if (db && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const docRef = await addDoc(collection(db, 'contact_inquiries'), {
        ...cleanPayload,
        createdAt: serverTimestamp(),
      });
      referenceId = docRef.id;
      storageMode = 'firestore';
    } catch {
      // Fall through to resilient local ledger if network/rules block unconfigured client
    }
  }

  if (!referenceId) {
    referenceId = saveToLocalLedger(LOCAL_CONTACT_KEY, {
      ...cleanPayload,
      createdAt: submittedAtIso,
    });
    storageMode = 'local-ledger';
  }

  // Forward inquiry to Guild Orbit channel and inbox
  const isPartners =
    input.originatingPage?.toLowerCase().includes('partner') ||
    input.category.toLowerCase().includes('partnership') ||
    input.category.toLowerCase().includes('collaboration');

  const subject = isPartners
    ? `Partnership Inquiry: ${input.category}`
    : `Inquiry: ${input.category}`;

  const metadata: Record<string, unknown> = {
    source: 'Revatya Website',
    originatingPage: input.originatingPage || (isPartners ? 'Partners Page' : 'Contact Page'),
    category: input.category,
    referenceId,
  };

  if (input.organisation?.trim()) metadata.organisation = input.organisation.trim();
  if (input.role?.trim()) metadata.role = input.role.trim();
  if (input.location?.trim()) metadata.location = input.location.trim();
  if (input.pathwayId?.trim()) metadata.pathway = input.pathwayId.trim();
  if (input.sourcePage?.trim()) metadata.linkOrReference = input.sourcePage.trim();

  const guildRes = await sendGuildOrbitLead({
    name: input.fullName.trim(),
    email: input.email.trim(),
    subject,
    message: input.message.trim(),
    createTask: true,
    metadata,
  });

  return {
    ok: true,
    referenceId,
    storageMode,
    submittedAtIso,
    guildOrbitSuccess: guildRes.success,
    guildOrbitMessageId: guildRes.messageId,
    guildOrbitTaskId: guildRes.taskId,
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
    interestStatement: input.interestStatement.trim(),
    consent: input.consent ?? true,
  };

  if (input.experienceSummary?.trim()) cleanPayload.experienceSummary = input.experienceSummary.trim();
  if (input.availability?.trim()) cleanPayload.availability = input.availability.trim();
  if (input.location?.trim()) cleanPayload.location = input.location.trim();
  if (input.portfolioUrl?.trim()) cleanPayload.portfolioUrl = input.portfolioUrl.trim();

  let referenceId = '';
  let storageMode: 'firestore' | 'local-ledger' = 'local-ledger';

  const db = getFirestoreClient();
  if (db && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const docRef = await addDoc(collection(db, 'join_interest'), {
        ...cleanPayload,
        createdAt: serverTimestamp(),
      });
      referenceId = docRef.id;
      storageMode = 'firestore';
    } catch {
      // Fall through to resilient local ledger
    }
  }

  if (!referenceId) {
    referenceId = saveToLocalLedger(LOCAL_JOIN_KEY, {
      ...cleanPayload,
      createdAt: submittedAtIso,
    });
    storageMode = 'local-ledger';
  }

  // Forward contributor interest to Guild Orbit channel and inbox
  const fullMessage = [
    input.interestStatement.trim(),
    input.experienceSummary?.trim() ? `\n\n**Experience:**\n${input.experienceSummary.trim()}` : '',
  ]
    .filter(Boolean)
    .join('');

  const metadata: Record<string, unknown> = {
    source: 'Revatya Website',
    originatingPage: 'Join / Contributor Page',
    discipline: input.discipline,
    referenceId,
  };

  if (input.availability?.trim()) metadata.availability = input.availability.trim();
  if (input.location?.trim()) metadata.location = input.location.trim();
  if (input.portfolioUrl?.trim()) metadata.portfolioUrl = input.portfolioUrl.trim();

  const guildRes = await sendGuildOrbitLead({
    name: input.fullName.trim(),
    email: input.email.trim(),
    subject: `Contributor Interest: ${input.discipline}`,
    message: fullMessage,
    createTask: true,
    metadata,
  });

  return {
    ok: true,
    referenceId,
    storageMode,
    submittedAtIso,
    guildOrbitSuccess: guildRes.success,
    guildOrbitMessageId: guildRes.messageId,
    guildOrbitTaskId: guildRes.taskId,
  };
}
