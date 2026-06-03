import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { memberId, equity } = await req.json();

    const member = await prisma.startupMember.findFirst({
      where: { id: memberId, startup: { founderId: user.id } },
    });
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.startupMember.update({
      where: { id: memberId },
      data: { equity: +equity },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
