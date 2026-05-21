import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();
    const listing = await prisma.listing.findUnique({ where: { id }, include: { startup: true } });
    if (!listing) return NextResponse.json({ error: 'not found' }, { status: 404 });
    if (listing.startup.founderId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    const updated = await prisma.listing.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const listing = await prisma.listing.findUnique({ where: { id }, include: { startup: true } });
    if (!listing) return NextResponse.json({ error: 'not found' }, { status: 404 });
    if (listing.startup.founderId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
