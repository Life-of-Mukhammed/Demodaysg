import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notify } from '@/lib/notify';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { mentorId } = await req.json();

    if (!mentorId) {
      // Remove mentor
      const updated = await prisma.startup.update({
        where: { id },
        data: { mentorId: null },
      });
      return NextResponse.json(updated);
    }

    // Verify mentor user
    const mentor = await prisma.user.findUnique({ where: { id: mentorId } });
    if (!mentor || mentor.primaryRole !== 'MENTOR') {
      return NextResponse.json({ error: 'User is not a mentor' }, { status: 400 });
    }

    const startup = await prisma.startup.update({
      where: { id },
      data: { mentorId },
      include: { founder: true },
    });

    await notify({
      userId: mentorId,
      type: 'GENERIC',
      title: `Sizga startup biriktirildi: ${startup.name}`,
      body: `Founder: ${startup.founder.email}. Sprint yaratish va weekly review uchun mentor dashboarddan boring`,
      link: `/mentor`,
      sendEmailAlso: true,
    });

    return NextResponse.json(startup);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
