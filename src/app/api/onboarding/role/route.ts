import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { role } = await req.json();
    if (!['FOUNDER', 'SPECIALIST', 'MENTOR'].includes(role)) {
      return NextResponse.json({ error: 'invalid role' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { primaryRole: role },
    });

    if (role === 'FOUNDER' && !user.founderProfile) {
      await prisma.founderProfile.create({ data: { userId: user.id } });
    }
    if (role === 'SPECIALIST' && !user.specialistProfile) {
      await prisma.specialistProfile.create({ data: { userId: user.id } });
    }
    if (role === 'MENTOR' && !user.mentorProfile) {
      await prisma.mentorProfile.create({ data: { userId: user.id } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
