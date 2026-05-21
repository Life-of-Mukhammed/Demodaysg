import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notify } from '@/lib/notify';
import { addXP, awardBadge } from '@/lib/gamification';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const app = await prisma.application.findUnique({
      where: { id },
      include: { listing: { include: { startup: true } } },
    });
    if (!app) return NextResponse.json({ error: 'not found' }, { status: 404 });
    if (app.listing.startup.founderId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status: body.status },
    });

    // If accepted, add as startup member + award XP (+200 = level 2)
    if (body.status === 'accepted') {
      const wasAlreadyMember = await prisma.startupMember.findUnique({
        where: { startupId_userId: { startupId: app.listing.startupId, userId: app.userId } },
      });
      await prisma.startupMember.upsert({
        where: { startupId_userId: { startupId: app.listing.startupId, userId: app.userId } },
        create: {
          startupId: app.listing.startupId,
          userId: app.userId,
          role: app.listing.role,
          level: app.listing.level,
          equity: app.listing.equity,
        },
        update: {},
      });
      // Award XP only on first join
      if (!wasAlreadyMember) {
        await addXP(app.userId, 200);
        await awardBadge(app.userId, 'team_builder');
      }
    }

    // Notify applicant
    await notify({
      userId: app.userId,
      type: 'MATCH',
      title: body.status === 'accepted' ? `Qabul qilindingiz! ${app.listing.startup.name}` : `Ariza holati: ${body.status}`,
      body: body.status === 'accepted'
        ? `Tabriklaymiz! ${app.listing.startup.name} jamoasiga qo'shildingiz`
        : `Sizning ${app.listing.title} pozitsiyasi uchun arizangiz ${body.status}`,
      link: body.status === 'accepted' ? `/startups/${app.listing.startupId}/workspace` : '/applications',
      sendEmailAlso: true,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
