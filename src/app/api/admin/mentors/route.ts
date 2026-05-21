import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();
    const mentors = await prisma.mentorProfile.findMany({
      include: {
        user: { select: { email: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(mentors);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

// Promote existing user OR invite new mentor by email
export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Pre-create user with placeholder firebaseUid (they'll need to sign up with this email)
      user = await prisma.user.create({
        data: {
          email,
          firebaseUid: `pending-mentor-${Date.now()}`,
          displayName: body.displayName || email.split('@')[0],
          primaryRole: 'MENTOR',
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { primaryRole: 'MENTOR' },
      });
    }

    await prisma.mentorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        bio: body.bio,
        expertise: body.expertise || [],
        sectors: body.sectors || [],
        yearsExperience: +body.yearsExperience || 0,
        linkedin: body.linkedin,
        invitedBy: admin.id,
      },
      update: {
        ...(body.bio && { bio: body.bio }),
        ...(body.expertise && { expertise: body.expertise }),
        ...(body.sectors && { sectors: body.sectors }),
      },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
