import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.trim();
    const role = url.searchParams.get('role');
    const users = await prisma.user.findMany({
      where: {
        ...(q ? { OR: [{ email: { contains: q, mode: 'insensitive' } }, { displayName: { contains: q, mode: 'insensitive' } }] } : {}),
        ...(role && role !== 'ALL' ? { primaryRole: role as any } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        specialistProfile: { select: { aiScore: true, primaryRoles: true } },
        _count: { select: { ownedStartups: true, memberships: true } },
      },
      take: 200,
    });
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const user = await prisma.user.create({
      data: {
        email: body.email,
        firebaseUid: body.firebaseUid || `manual-${Date.now()}`,
        displayName: body.displayName,
        primaryRole: body.primaryRole || 'FOUNDER',
        isAdmin: !!body.isAdmin,
      },
    });
    return NextResponse.json(user);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
