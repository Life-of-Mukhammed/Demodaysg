import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ai } from '@/lib/ai';

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const sector = url.searchParams.get('sector');
    const stage = url.searchParams.get('stage');
    const q = url.searchParams.get('q')?.trim();

    const startups = await prisma.startup.findMany({
      where: {
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
        ...(sector && sector !== 'ALL' ? { sector: sector as any } : {}),
        ...(stage && stage !== 'ALL' ? { stage: stage as any } : {}),
      },
      include: {
        founder: { select: { email: true, displayName: true } },
        _count: { select: { members: true, sprints: true, tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(startups);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    // Admin creates startup on behalf of a founder
    const founder = await prisma.user.findUnique({ where: { id: body.founderId } });
    if (!founder) return NextResponse.json({ error: 'founder not found' }, { status: 400 });

    const startup = await prisma.startup.create({
      data: {
        founderId: body.founderId,
        name: body.name,
        pitch: body.pitch,
        problem: body.problem,
        solution: body.solution,
        targetAudience: body.targetAudience,
        revenueModel: body.revenueModel,
        competitors: body.competitors,
        hasMVP: !!body.hasMVP,
        teamSize: +body.teamSize || 1,
        stage: body.stage || 'IDEA',
        sector: body.sector || 'OTHER',
        location: body.location,
        cofounderNeeded: body.cofounderNeeded || [],
      },
    });

    // Fire AI eval async
    (async () => {
      try {
        const r = await ai.evaluateStartup({
          name: startup.name,
          pitch: startup.pitch,
          problem: startup.problem,
          solution: startup.solution,
          targetAudience: startup.targetAudience,
          revenueModel: startup.revenueModel,
          hasMVP: startup.hasMVP,
          teamSize: startup.teamSize,
          stage: startup.stage,
          sector: startup.sector,
        });
        await prisma.startup.update({
          where: { id: startup.id },
          data: { aiScore: r.score, scoreCategory: r.category, scoreMetrics: r.metrics, aiFeedback: r.feedback },
        });
      } catch (e) { console.error('eval failed', e); }
    })();

    return NextResponse.json(startup);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
