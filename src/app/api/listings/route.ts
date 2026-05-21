import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    await requireUser();
    const url = new URL(req.url);
    const startupId = url.searchParams.get('startupId');
    const listings = await prisma.listing.findMany({
      where: { ...(startupId ? { startupId } : { active: true }) },
      include: {
        startup: { select: { id: true, name: true, sector: true, stage: true, aiScore: true, logoUrl: true, pitch: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(listings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    // Verify caller is founder of this startup
    const startup = await prisma.startup.findUnique({ where: { id: body.startupId } });
    if (!startup) return NextResponse.json({ error: 'startup not found' }, { status: 404 });
    if (startup.founderId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const listing = await prisma.listing.create({
      data: {
        startupId: body.startupId,
        type: body.type || 'CONTRACT',
        role: body.role,
        title: body.title,
        description: body.description,
        skills: body.skills || [],
        level: body.level || 'MIDDLE',
        equity: body.equity ? parseFloat(body.equity) : null,
        remote: body.remote ?? true,
        active: true,
      },
    });
    return NextResponse.json(listing);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
