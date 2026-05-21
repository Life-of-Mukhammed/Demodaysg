import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notify } from '@/lib/notify';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    // Only founder of this startup or admin can create tasks
    const startup = await prisma.startup.findUnique({ where: { id: body.startupId } });
    if (!startup) return NextResponse.json({ error: 'startup not found' }, { status: 404 });
    if (startup.founderId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'Faqat Founder vazifa yarata oladi' }, { status: 403 });
    }

    const description = Array.isArray(body.description)
      ? body.description.map((b: string) => `• ${b}`).join('\n')
      : (body.description ? String(body.description) : null);

    const task = await prisma.task.create({
      data: {
        startupId: body.startupId,
        sprintId: body.sprintId || null,
        title: body.title,
        description,
        status: 'TODO',
        priority: body.priority || 'MEDIUM',
        assigneeId: body.assigneeId,
        creatorId: user.id,
        aiGenerated: !!body.aiGenerated,
      },
      include: { assignee: true },
    });
    if (task.assigneeId && task.assigneeId !== user.id) {
      await notify({
        userId: task.assigneeId,
        type: 'TASK_ASSIGNED',
        title: `Yangi vazifa: ${task.title}`,
        body: task.description?.slice(0, 200),
        link: `/startups/${body.startupId}/workspace`,
        sendEmailAlso: true,
      });
    }
    return NextResponse.json(task);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
