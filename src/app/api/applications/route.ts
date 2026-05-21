import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireUser();
    if (user.primaryRole === 'SPECIALIST') {
      // Specialist sees their own applications
      const apps = await prisma.application.findMany({
        where: { userId: user.id },
        include: {
          listing: {
            include: { startup: { select: { id: true, name: true, logoUrl: true, sector: true, stage: true, aiScore: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ role: 'SPECIALIST', items: apps });
    }
    // Founder sees applications to their startups
    const apps = await prisma.application.findMany({
      where: { listing: { startup: { founderId: user.id } } },
      include: {
        listing: { include: { startup: { select: { id: true, name: true } } } },
        user: {
          select: {
            email: true, displayName: true, avatarUrl: true,
            specialistProfile: {
              select: {
                aiScore: true, aiSummary: true, primaryRoles: true, skills: true, bio: true,
                github: true, linkedin: true, portfolio: true, level: true, experienceYears: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ role: 'FOUNDER', items: apps });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
