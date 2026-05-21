import { prisma } from './prisma';

/**
 * Tier-based matching:
 * - High startup (80-100) → senior+ specialists (60+)
 * - Mid startup (60-80) → middle+ specialists (45+)
 * - Low startup (<60) → junior/middle specialists (<60)
 *
 * Found by closest score band within ±15 points first, expanding outward.
 */
export function scoreBand(score: number): [number, number] {
  if (score >= 80) return [60, 100];
  if (score >= 60) return [45, 85];
  if (score >= 40) return [25, 70];
  return [0, 55];
}

export async function candidatesForStartup(startupId: string, limit = 20) {
  const startup = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!startup) return [];
  const refScore = startup.aiScore ?? 50;
  const [lo, hi] = scoreBand(refScore);

  // Roles needed
  const needed = startup.cofounderNeeded;

  // Exclude already-swiped, already-applied, founder themselves, current members
  const alreadySwiped = await prisma.swipe.findMany({
    where: { swiperId: startup.founderId, startupId },
    select: { targetId: true },
  });
  const exclude = new Set([startup.founderId, ...alreadySwiped.map((s) => s.targetId).filter(Boolean) as string[]]);

  const memberIds = (
    await prisma.startupMember.findMany({ where: { startupId }, select: { userId: true } })
  ).map((m) => m.userId);
  memberIds.forEach((id) => exclude.add(id));

  const candidates = await prisma.specialistProfile.findMany({
    where: {
      available: true,
      aiScore: { gte: lo, lte: hi },
      ...(needed.length > 0 ? { primaryRoles: { hasSome: needed as any } } : {}),
      userId: { notIn: Array.from(exclude) },
    },
    include: { user: true },
    orderBy: { aiScore: 'desc' },
    take: limit,
  });
  return candidates;
}

export async function startupsForSpecialist(userId: string, limit = 20) {
  const profile = await prisma.specialistProfile.findUnique({ where: { userId } });
  const refScore = profile?.aiScore ?? 50;
  const [lo, hi] = scoreBand(refScore);

  const alreadySwiped = await prisma.swipe.findMany({
    where: { swiperId: userId },
    select: { startupId: true },
  });
  const excludeStartups = alreadySwiped.map((s) => s.startupId).filter(Boolean) as string[];

  const startups = await prisma.startup.findMany({
    where: {
      aiScore: { gte: lo, lte: hi },
      id: { notIn: excludeStartups },
      founderId: { not: userId },
      ...(profile?.primaryRoles?.length
        ? { cofounderNeeded: { hasSome: profile.primaryRoles as any } }
        : {}),
    },
    include: { founder: true },
    orderBy: { aiScore: 'desc' },
    take: limit,
  });
  return startups;
}

export async function recordSwipe(opts: {
  swiperId: string;
  targetUserId?: string;
  startupId?: string;
  direction: 'LIKE' | 'PASS';
}) {
  const swipe = await prisma.swipe.create({
    data: {
      swiperId: opts.swiperId,
      targetId: opts.targetUserId,
      startupId: opts.startupId,
      direction: opts.direction,
    },
  });

  if (opts.direction !== 'LIKE') return { match: false };

  // Check mutual:
  // case A: founder swipes specialist for their startup → check specialist liked this startup
  // case B: specialist swipes startup → check founder liked them
  if (opts.startupId && opts.targetUserId) {
    const mutual = await prisma.swipe.findFirst({
      where: {
        swiperId: opts.targetUserId,
        startupId: opts.startupId,
        direction: 'LIKE',
      },
    });
    if (mutual) {
      const startup = await prisma.startup.findUnique({ where: { id: opts.startupId } });
      const match = await prisma.match.upsert({
        where: {
          userAId_userBId_startupId: {
            userAId: startup!.founderId,
            userBId: opts.targetUserId,
            startupId: opts.startupId,
          },
        },
        update: {},
        create: {
          userAId: startup!.founderId,
          userBId: opts.targetUserId,
          startupId: opts.startupId,
          score: 80,
        },
      });
      const { notify } = await import('./notify');
      await Promise.all([
        notify({ userId: startup!.founderId, type: 'MATCH', title: 'New match!', body: `You matched with ${opts.targetUserId} for ${startup!.name}`, link: `/match/${match.id}`, sendEmailAlso: true }),
        notify({ userId: opts.targetUserId, type: 'MATCH', title: 'New match!', body: `You matched on ${startup!.name}`, link: `/match/${match.id}`, sendEmailAlso: true }),
      ]);
      return { match: true, matchId: match.id };
    }
  } else if (opts.startupId && !opts.targetUserId) {
    // specialist swiped a startup
    const startup = await prisma.startup.findUnique({ where: { id: opts.startupId } });
    if (!startup) return { match: false };
    const mutual = await prisma.swipe.findFirst({
      where: {
        swiperId: startup.founderId,
        targetId: opts.swiperId,
        startupId: opts.startupId,
        direction: 'LIKE',
      },
    });
    if (mutual) {
      const match = await prisma.match.upsert({
        where: {
          userAId_userBId_startupId: {
            userAId: startup.founderId,
            userBId: opts.swiperId,
            startupId: opts.startupId,
          },
        },
        update: {},
        create: {
          userAId: startup.founderId,
          userBId: opts.swiperId,
          startupId: opts.startupId,
          score: 80,
        },
      });
      const { notify } = await import('./notify');
      await Promise.all([
        notify({ userId: startup.founderId, type: 'MATCH', title: 'New match!', body: `Specialist matched with ${startup.name}`, link: `/match/${match.id}`, sendEmailAlso: true }),
        notify({ userId: opts.swiperId, type: 'MATCH', title: 'New match!', body: `You matched on ${startup.name}`, link: `/match/${match.id}`, sendEmailAlso: true }),
      ]);
      return { match: true, matchId: match.id };
    }
  }
  return { match: false };
}
