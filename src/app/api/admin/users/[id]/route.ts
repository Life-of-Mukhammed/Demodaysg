import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data: any = {};
    if (body.primaryRole) data.primaryRole = body.primaryRole;
    if (typeof body.isAdmin === 'boolean') data.isAdmin = body.isAdmin;
    if (typeof body.verifiedFounder === 'boolean') data.verifiedFounder = body.verifiedFounder;
    if (body.displayName) data.displayName = body.displayName;

    const user = await prisma.user.update({ where: { id }, data });

    // If promoting to mentor, ensure mentor profile exists
    if (body.primaryRole === 'MENTOR') {
      await prisma.mentorProfile.upsert({
        where: { userId: id },
        create: { userId: id, invitedBy: 'admin' },
        update: {},
      });
    }

    return NextResponse.json(user);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
