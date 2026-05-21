import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { candidatesForStartup } from '@/lib/matching';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const startupId = url.searchParams.get('startup');

    // FOUNDER mode: find specialists for a specific startup
    if (startupId) {
      const candidates = await candidatesForStartup(startupId);
      return NextResponse.json({ mode: 'startup-finds-specialist', items: candidates, startupId });
    }

    // FOUNDER without startupId → pick their first startup that has been AI-evaluated
    if (user.primaryRole === 'FOUNDER') {
      const first = await prisma.startup.findFirst({
        where: { founderId: user.id, aiScore: { not: null } },
        orderBy: { createdAt: 'desc' },
      });
      if (!first) {
        // No startup yet
        const anyStartup = await prisma.startup.findFirst({ where: { founderId: user.id } });
        return NextResponse.json({
          mode: 'founder-no-startup',
          items: [],
          needsStartup: !anyStartup,
          needsEval: !!anyStartup && !anyStartup.aiScore,
        });
      }
      const candidates = await candidatesForStartup(first.id);
      return NextResponse.json({
        mode: 'startup-finds-specialist',
        items: candidates,
        startupId: first.id,
        startupName: first.name,
      });
    }

    // SPECIALIST mode: find listings
    const profile = await prisma.specialistProfile.findUnique({ where: { userId: user.id } });
    const refScore = profile?.aiScore ?? 50;
    const [lo, hi] = refScore >= 80 ? [60, 100] : refScore >= 60 ? [45, 85] : refScore >= 40 ? [25, 70] : [0, 55];

    const appliedListings = await prisma.application.findMany({
      where: { userId: user.id },
      select: { listingId: true },
    });
    const excludeIds = appliedListings.map((a) => a.listingId);

    const listings = await prisma.listing.findMany({
      where: {
        active: true,
        id: { notIn: excludeIds },
        ...(profile?.primaryRoles?.length ? { role: { in: profile.primaryRoles as any } } : {}),
        startup: { aiScore: { gte: lo, lte: hi } },
      },
      include: {
        startup: { select: { id: true, name: true, sector: true, stage: true, aiScore: true, logoUrl: true, pitch: true, founderId: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json({ mode: 'specialist-finds-listing', items: listings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
