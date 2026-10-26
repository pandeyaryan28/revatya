import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'revatya.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'revatya',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'revatya.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Initialises Firebase & Cloud Firestore when environment configuration is provided.
 * Never embeds raw API keys or secrets in client-side source code.
 */
export function getFirestoreClient(): Firestore | null {
  if (db) return db;
  try {
    if (!firebaseConfig.projectId) return null;
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
    return db;
  } catch {
    return null;
  }
}
