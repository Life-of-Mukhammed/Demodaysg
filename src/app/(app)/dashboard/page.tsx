import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FounderDashboard } from '@/components/dashboard/founder-dashboard';
import { SpecialistDashboard } from '@/components/dashboard/specialist-dashboard';
import { MentorDashboardEmbed } from '@/components/dashboard/mentor-dashboard';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  if (user.primaryRole === 'SPECIALIST') return <SpecialistDashboard user={user} />;
  if (user.primaryRole === 'MENTOR') return <MentorDashboardEmbed user={user} />;

  // Founder data
  const startups = await prisma.startup.findMany({
    where: { founderId: user.id },
    include: {
      members: { include: { user: { select: { displayName: true, email: true, avatarUrl: true } } } },
      sprints: { where: { completed: false }, take: 1 },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });
  const badges = await prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, take: 6 });

  // Build teamMembers map
  const teamMembers: Record<string, any[]> = {};
  for (const s of startups) {
    teamMembers[s.id] = s.members;
  }

  // Serialize for client component
  const serializedStartups = startups.map((s) => ({
    ...s,
    pitchDeckUploadedAt: s.pitchDeckUploadedAt ? s.pitchDeckUploadedAt.toISOString() : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    members: s.members.map((m) => ({ ...m, joinedAt: m.joinedAt.toISOString() })),
    sprints: s.sprints.map((sp) => ({
      ...sp,
      startDate: sp.startDate.toISOString(),
      endDate: sp.endDate.toISOString(),
      createdAt: sp.createdAt.toISOString(),
    })),
  }));

  return (
    <FounderDashboard
      user={user}
      startups={serializedStartups as any}
      streak={streak}
      badges={badges}
      teamMembers={teamMembers}
    />
  );
}
