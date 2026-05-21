'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase/client';

type AuthCtx = {
  user: FirebaseUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

async function syncSession(u: FirebaseUser | null) {
  if (!u) {
    await fetch('/api/auth/session', { method: 'DELETE' });
    return;
  }
  const token = await u.getIdToken();
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'unknown' }));
    console.error('[session] sync failed:', res.status, err);
    throw new Error('Session sync failed: ' + (err.error || res.status));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    const a = auth();
    if (!a) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(a, async (u) => {
      setUser(u);
      await syncSession(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function notConfigured(): Promise<void> {
    return Promise.reject(
      new Error('Firebase is not configured. Add real credentials to .env.local')
    );
  }

  const value: AuthCtx = {
    user,
    loading,
    configured,
    signIn: async (email, password) => {
      const a = auth();
      if (!a) return notConfigured();
      const cred = await signInWithEmailAndPassword(a, email, password);
      await syncSession(cred.user);
    },
    signUp: async (email, password, displayName) => {
      const a = auth();
      if (!a) return notConfigured();
      const cred = await createUserWithEmailAndPassword(a, email, password);
      if (displayName) await updateProfile(cred.user, { displayName });
      await syncSession(cred.user);
    },
    signInGoogle: async () => {
      const a = auth();
      if (!a) return notConfigured();
      const cred = await signInWithPopup(a, googleProvider);
      await syncSession(cred.user);
    },
    signOut: async () => {
      const a = auth();
      if (!a) return notConfigured();
      await fbSignOut(a);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
