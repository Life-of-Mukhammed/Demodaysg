import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ai } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const result = await ai.evaluateSpecialist({
      resumeText: body.resumeText?.slice(0, 8000),
      primaryRoles: body.primaryRoles || [],
      skills: body.skills || [],
      sectors: body.sectors || [],
      experienceYears: +body.experienceYears || 0,
      level: body.level || 'MIDDLE',
      github: body.github,
      linkedin: body.linkedin,
      portfolio: body.portfolio,
    });

    await prisma.specialistProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        aiScore: result.score,
        aiSummary: result.summary,
        level: result.level_assessment as any,
      },
      update: {
        aiScore: result.score,
        aiSummary: result.summary,
      },
    });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
