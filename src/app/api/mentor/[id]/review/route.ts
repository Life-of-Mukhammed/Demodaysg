import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();
    const review = await prisma.mentorReview.create({
      data: {
        startupId: id,
        mentorId: user.id,
        weekOf: new Date(),
        score: +body.score,
        progress: body.progress,
        blockers: body.blockers,
        teamHealth: body.teamHealth ? +body.teamHealth : null,
        kpiStatus: body.kpiStatus,
        nextSteps: body.nextSteps,
        freeText: body.freeText,
      },
    });
    // notify founder
    const startup = await prisma.startup.findUnique({ where: { id } });
    if (startup) {
      await prisma.notification.create({
        data: {
          userId: startup.founderId,
          type: 'MENTOR_FEEDBACK',
          title: `Mentor review uchun ${startup.name}`,
          link: `/startups/${id}`,
        },
      });
    }
    return NextResponse.json(review);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
