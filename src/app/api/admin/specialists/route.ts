import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    const sector = url.searchParams.get('sector');
    const sortBy = url.searchParams.get('sort') || 'score';

    const specialists = await prisma.specialistProfile.findMany({
      where: {
        ...(role && role !== 'ALL' ? { primaryRoles: { has: role as any } } : {}),
        ...(sector && sector !== 'ALL' ? { sectors: { has: sector as any } } : {}),
      },
      include: {
        user: { select: { email: true, displayName: true, avatarUrl: true, level: true, xp: true } },
      },
      orderBy: sortBy === 'xp'
        ? { user: { xp: 'desc' } }
        : sortBy === 'recent'
        ? { createdAt: 'desc' }
        : { aiScore: 'desc' },
      take: 200,
    });
    return NextResponse.json(specialists);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}
