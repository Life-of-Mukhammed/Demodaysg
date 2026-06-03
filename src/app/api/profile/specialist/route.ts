import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await prisma.specialistProfile.findUnique({ where: { userId: user.id } });
    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = {
      bio: body.bio,
      developerType: body.developerType,
      location: body.location,
      englishLevel: body.englishLevel,
      experienceYears: +body.experienceYears || 0,
      primaryRoles: body.primaryRoles,
      skills: body.skills,
      sectors: body.sectors,
      level: body.level,
      linkedin: body.linkedin,
      github: body.github,
      portfolio: body.portfolio,
      twitter: body.twitter,
      resumeText: body.resumeText,
      workExperience: body.workExperience,
      available: body.available,
    };
    const profile = await prisma.specialistProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
    });
    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
