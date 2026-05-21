import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addXP } from '@/lib/gamification';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const task = await prisma.task.findUnique({
      where: { id },
      include: { startup: { select: { founderId: true } }, sprint: true },
    });
    if (!task) return NextResponse.json({ error: 'task not found' }, { status: 404 });

    const isFounder = task.startup.founderId === user.id;
    const isAssignee = task.assigneeId === user.id;
    const isStatusOnly = Object.keys(body).every((k) => k === 'status');

    // Status-only update: assignee or founder or admin
    // Anything else: founder or admin only
    if (isStatusOnly) {
      if (!isAssignee && !isFounder && !user.isAdmin) {
        return NextResponse.json({ error: 'Faqat tayinlangan xodim yoki Founder status o\'zgartira oladi' }, { status: 403 });
      }
    } else {
      if (!isFounder && !user.isAdmin) {
        return NextResponse.json({ error: 'Faqat Founder vazifani tahrirlay oladi' }, { status: 403 });
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.priority && { priority: body.priority }),
        ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    // Award +25 XP when task moves to DONE (only on first DONE transition)
    if (body.status === 'DONE' && task.status !== 'DONE' && task.assigneeId) {
      await addXP(task.assigneeId, 25);
    }

    // Recalculate sprint completion rate
    if (task.sprintId && body.status) {
      const sprintTasks = await prisma.task.findMany({
        where: { sprintId: task.sprintId },
        select: { status: true },
      });
      const total = sprintTasks.length;
      const done = sprintTasks.filter((t) => t.status === 'DONE').length;
      const rate = total ? (done / total) * 100 : 0;
      await prisma.sprint.update({
        where: { id: task.sprintId },
        data: { completionRate: rate, ...(rate === 100 ? { completed: true } : {}) },
      });
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { startup: { select: { founderId: true } } },
    });
    if (!task) return NextResponse.json({ error: 'task not found' }, { status: 404 });
    if (task.startup.founderId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'Faqat Founder vazifani o\'chira oladi' }, { status: 403 });
    }

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
