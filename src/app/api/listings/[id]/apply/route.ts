import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notify } from '@/lib/notify';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { startup: { include: { founder: true } } },
    });
    if (!listing) return NextResponse.json({ error: 'listing not found' }, { status: 404 });
    if (!listing.active) return NextResponse.json({ error: 'listing is closed' }, { status: 400 });
    if (listing.startup.founderId === user.id) {
      return NextResponse.json({ error: 'Cannot apply to your own listing' }, { status: 400 });
    }

    // Upsert application (avoid dupes)
    const existing = await prisma.application.findUnique({
      where: { listingId_userId: { listingId: id, userId: user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Siz allaqachon ariza yuborgansiz' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        listingId: id,
        userId: user.id,
        message: body.message?.slice(0, 1000),
      },
    });

    await notify({
      userId: listing.startup.founderId,
      type: 'MATCH',
      title: `Yangi ariza: ${listing.title}`,
      body: `${user.displayName || user.email} sizning ${listing.startup.name} startupingizdagi "${listing.title}" pozitsiyasiga ariza yubordi`,
      link: `/applications`,
      sendEmailAlso: true,
    });

    return NextResponse.json(application);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
