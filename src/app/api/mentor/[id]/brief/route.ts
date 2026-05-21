import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ai } from '@/lib/ai';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const startup = await prisma.startup.findUnique({
      where: { id },
      include: {
        sprints: { take: 3, orderBy: { createdAt: 'desc' } },
        metricsLogs: { take: 5, orderBy: { date: 'desc' } },
      },
    });
    if (!startup) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const brief = await ai.mentorBrief({
      startup: { name: startup.name, stage: startup.stage, sector: startup.sector, pitch: startup.pitch, aiScore: startup.aiScore },
      recentSprints: startup.sprints,
      metrics: startup.metricsLogs,
    });
    return NextResponse.json(brief);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
