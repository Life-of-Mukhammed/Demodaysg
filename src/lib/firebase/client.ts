import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _storage: FirebaseStorage | null = null;

function isConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      !firebaseConfig.apiKey.startsWith('placeholder') &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

function init(): FirebaseApp | null {
  if (_app) return _app;
  if (!isConfigured()) return null;
  try {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return _app;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    return null;
  }
}

export const firebaseApp = (): FirebaseApp | null => init();

export const auth = (): Auth | null => {
  if (_auth) return _auth;
  const app = init();
  if (!app) return null;
  _auth = getAuth(app);
  return _auth;
};

export const storage = (): FirebaseStorage | null => {
  if (_storage) return _storage;
  const app = init();
  if (!app) return null;
  _storage = getStorage(app);
  return _storage;
};

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const isFirebaseConfigured = isConfigured;
