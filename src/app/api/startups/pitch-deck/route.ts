import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminStorage } from '@/lib/firebase/admin';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const startupId = formData.get('startupId') as string;

    if (!file || !startupId) return NextResponse.json({ error: 'Missing file or startupId' }, { status: 400 });

    const startup = await prisma.startup.findFirst({ where: { id: startupId, founderId: user.id } });
    if (!startup) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `pitch-decks/${startupId}/${Date.now()}-${file.name}`;
    const bucket = adminStorage().bucket();
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, { contentType: file.type });
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const updated = await prisma.startup.update({
      where: { id: startupId },
      data: { pitchDeckUrl: publicUrl, pitchDeckName: file.name, pitchDeckUploadedAt: new Date() },
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
