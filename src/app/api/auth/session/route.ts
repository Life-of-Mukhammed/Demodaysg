import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase/admin';
import { prisma } from '@/lib/prisma';
import { updateStreak } from '@/lib/gamification';

const COOKIE = 'fs_token';
const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'no token' }, { status: 400 });

  try {
    const decoded = await verifyIdToken(token);
    console.log('[session] verified token for', decoded.email, decoded.uid);
    const email = decoded.email!;
    const existing = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });

    let userRecord = existing;
    if (!existing) {
      userRecord = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email,
          displayName: decoded.name || email.split('@')[0],
          avatarUrl: decoded.picture,
          verifiedFounder: decoded.firebase?.sign_in_provider === 'linkedin.com',
        },
      });
    } else {
      await prisma.user.update({
        where: { id: existing.id },
        data: { lastLoginAt: new Date(), avatarUrl: decoded.picture || existing.avatarUrl },
      });
    }

    // Ensure profile exists for current role (heal missing profiles)
    if (userRecord) {
      if (userRecord.primaryRole === 'FOUNDER') {
        await prisma.founderProfile.upsert({ where: { userId: userRecord.id }, create: { userId: userRecord.id }, update: {} });
      } else if (userRecord.primaryRole === 'SPECIALIST') {
        await prisma.specialistProfile.upsert({ where: { userId: userRecord.id }, create: { userId: userRecord.id }, update: {} });
      } else if (userRecord.primaryRole === 'MENTOR') {
        await prisma.mentorProfile.upsert({ where: { userId: userRecord.id }, create: { userId: userRecord.id }, update: {} });
      }
      // Update daily streak (silent on error)
      updateStreak(userRecord.id).catch((e) => console.error('[streak]', e));
    }

    const c = await cookies();
    c.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[session] verify failed:', e?.message, e?.code);
    return NextResponse.json({ error: e?.message || 'invalid token' }, { status: 401 });
  }
}

export async function DELETE() {
  const c = await cookies();
  c.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
