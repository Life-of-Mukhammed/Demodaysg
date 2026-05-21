import { cookies } from 'next/headers';
import { verifyIdToken } from './firebase/admin';
import { prisma } from './prisma';

const TOKEN_COOKIE = 'fs_token';

export async function getCurrentUser() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    console.log('[auth] no cookie');
    return null;
  }
  try {
    const decoded = await verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: {
        founderProfile: true,
        specialistProfile: true,
        mentorProfile: true,
      },
    });
    if (!user) console.log('[auth] no user for uid', decoded.uid);
    return user;
  } catch (e: any) {
    console.log('[auth] verify failed:', e?.message);
    return null;
  }
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error('Unauthorized');
  return u;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (!u.isAdmin) throw new Error('Forbidden');
  return u;
}
