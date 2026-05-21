import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ai } from '@/lib/ai';
import { awardBadge, addXP } from '@/lib/gamification';

export async function GET() {
  try {
    const user = await requireUser();
    const startups = await prisma.startup.findMany({
      where: { founderId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(startups);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (user.primaryRole !== 'FOUNDER' && !user.isAdmin) {
      return NextResponse.json({ error: 'Only founders can create startups' }, { status: 403 });
    }
    const body = await req.json();

    const startup = await prisma.startup.create({
      data: {
        founderId: user.id,
        name: body.name,
        pitch: body.pitch,
        problem: body.problem,
        solution: body.solution,
        targetAudience: body.targetAudience,
        revenueModel: body.revenueModel,
        competitors: body.competitors,
        hasMVP: body.hasMVP,
        teamSize: body.teamSize,
        stage: body.stage,
        sector: body.sector,
        location: body.location,
        equityOffered: body.equityOffered,
        fundraising: body.fundraising,
        cofounderNeeded: body.cofounderNeeded,
      },
    });

    // Fire AI eval async — don't await response
    evaluateStartupAsync(startup.id).catch(console.error);

    // Award first startup badge
    await awardBadge(user.id, 'first_startup');
    await addXP(user.id, 100);

    return NextResponse.json({ id: startup.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

async function evaluateStartupAsync(startupId: string) {
  const s = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!s) return;
  try {
    const result = await ai.evaluateStartup({
      name: s.name,
      pitch: s.pitch,
      problem: s.problem,
      solution: s.solution,
      targetAudience: s.targetAudience,
      revenueModel: s.revenueModel,
      competitors: s.competitors || undefined,
      hasMVP: s.hasMVP,
      teamSize: s.teamSize,
      stage: s.stage,
      sector: s.sector,
    });
    await prisma.startup.update({
      where: { id: startupId },
      data: {
        aiScore: result.score,
        scoreCategory: result.category,
        scoreMetrics: result.metrics,
        aiFeedback: result.feedback,
      },
    });
    if (result.score >= 90) await awardBadge(s.founderId, 'ai_score_90');
    if (result.category === 'VC_BACKABLE') await awardBadge(s.founderId, 'vc_backable');
  } catch (e) {
    console.error('AI eval failed', e);
  }
}
