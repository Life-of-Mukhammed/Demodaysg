import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notify } from '@/lib/notify';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const startup = await prisma.startup.findUnique({
      where: { id: body.startupId },
      include: { members: true },
    });
    if (!startup) return NextResponse.json({ error: 'startup not found' }, { status: 404 });

    // ONLY assigned mentor or admin can create sprints (founder cannot)
    const isAssignedMentor = startup.mentorId === user.id && user.primaryRole === 'MENTOR';
    if (!isAssignedMentor && !user.isAdmin) {
      return NextResponse.json({
        error: startup.mentorId
          ? "Faqat shu startupga biriktirilgan mentor sprint yarata oladi"
          : "Bu startupga hali mentor biriktirilmagan. Admin orqali mentor biriktiring",
      }, { status: 403 });
    }

    const sprint = await prisma.sprint.create({
      data: {
        startupId: body.startupId,
        name: body.name,
        goal: body.goal,
        startDate: new Date(body.startDate || Date.now()),
        endDate: new Date(body.endDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdById: user.id,
      },
    });

    // Notify founder + team members
    const notifyIds = [startup.founderId, ...startup.members.map((m) => m.userId)].filter((id) => id !== user.id);
    await Promise.all(
      notifyIds.map((id) =>
        notify({
          userId: id,
          type: 'SPRINT_STARTED',
          title: `Yangi sprint: ${sprint.name}`,
          body: sprint.goal,
          link: `/startups/${body.startupId}/workspace`,
          sendEmailAlso: true,
        })
      )
    );

    return NextResponse.json(sprint);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
