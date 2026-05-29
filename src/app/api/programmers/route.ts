import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profiles = await prisma.specialistProfile.findMany({
    where: { available: true },
    include: {
      user: { select: { id: true, displayName: true, email: true, avatarUrl: true } },
    },
    orderBy: { aiScore: 'desc' },
  });

  return NextResponse.json(profiles);
}
