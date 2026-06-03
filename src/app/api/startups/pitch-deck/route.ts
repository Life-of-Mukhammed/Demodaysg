import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { startupId, pitchDeckUrl, pitchDeckName } = await req.json();

    const startup = await prisma.startup.findFirst({ where: { id: startupId, founderId: user.id } });
    if (!startup) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.startup.update({
      where: { id: startupId },
      data: { pitchDeckUrl, pitchDeckName, pitchDeckUploadedAt: new Date() },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const { startupId } = await req.json();

    const startup = await prisma.startup.findFirst({ where: { id: startupId, founderId: user.id } });
    if (!startup) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.startup.update({
      where: { id: startupId },
      data: { pitchDeckUrl: null, pitchDeckName: null, pitchDeckUploadedAt: null },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
