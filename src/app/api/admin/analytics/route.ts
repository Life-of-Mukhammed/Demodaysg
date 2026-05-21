import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers, totalStartups, totalMatches, totalSprints,
      foundersCount, specialistsCount, mentorsCount,
      investorReady,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.startup.count(),
      prisma.match.count(),
      prisma.sprint.count(),
      prisma.user.count({ where: { primaryRole: 'FOUNDER' } }),
      prisma.user.count({ where: { primaryRole: 'SPECIALIST' } }),
      prisma.user.count({ where: { primaryRole: 'MENTOR' } }),
      prisma.startup.count({ where: { investorReady: 'INVESTOR_READY' } }),
    ]);

    // Sector distribution
    const sectorRaw = await prisma.$queryRaw<{ sector: string; count: bigint }[]>`
      SELECT "sector", COUNT(*) as count FROM "Startup" GROUP BY "sector" ORDER BY count DESC
    `;
    const bySector = sectorRaw.map((r) => ({ name: r.sector, value: Number(r.count) }));

    // Stage distribution
    const stageRaw = await prisma.$queryRaw<{ stage: string; count: bigint }[]>`
      SELECT "stage", COUNT(*) as count FROM "Startup" GROUP BY "stage"
    `;
    const byStage = stageRaw.map((r) => ({ name: r.stage.replace('_', ' '), value: Number(r.count) }));

    // Score distribution
    const scoreRaw = await prisma.$queryRaw<{ bucket: string; count: bigint }[]>`
      SELECT
        CASE
          WHEN "aiScore" >= 85 THEN 'VC Backable'
          WHEN "aiScore" >= 70 THEN 'High Potential'
          WHEN "aiScore" >= 55 THEN 'Promising'
          WHEN "aiScore" >= 40 THEN 'Average'
          WHEN "aiScore" IS NOT NULL THEN 'Weak'
          ELSE 'Unrated'
        END as bucket,
        COUNT(*) as count
      FROM "Startup" GROUP BY bucket
    `;
    const byScore = scoreRaw.map((r) => ({ name: r.bucket, value: Number(r.count) }));

    // Specialist role distribution
    const specialistRoleRaw = await prisma.$queryRaw<{ role: string; count: bigint }[]>`
      SELECT unnest("primaryRoles")::text as role, COUNT(*) as count
      FROM "SpecialistProfile"
      GROUP BY role
      ORDER BY count DESC
    `;
    const bySpecialistRole = specialistRoleRaw.map((r) => ({ name: r.role.replace('_', ' '), value: Number(r.count) }));

    // Signups last 30 days
    const signupsRaw = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day
    `;
    const signups = signupsRaw.map((r) => ({
      date: new Date(r.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Number(r.count),
    }));

    // Top startups by score
    const topStartups = await prisma.startup.findMany({
      where: { aiScore: { not: null } },
      orderBy: { aiScore: 'desc' },
      take: 10,
      include: { founder: { select: { email: true, displayName: true } } },
    });

    // Top specialists by score
    const topSpecialists = await prisma.specialistProfile.findMany({
      where: { aiScore: { not: null } },
      orderBy: { aiScore: 'desc' },
      take: 10,
      include: { user: { select: { email: true, displayName: true, avatarUrl: true } } },
    });

    return NextResponse.json({
      totals: {
        users: totalUsers,
        startups: totalStartups,
        matches: totalMatches,
        sprints: totalSprints,
        founders: foundersCount,
        specialists: specialistsCount,
        mentors: mentorsCount,
        investorReady,
      },
      bySector,
      byStage,
      byScore,
      bySpecialistRole,
      signups,
      topStartups,
      topSpecialists,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}
