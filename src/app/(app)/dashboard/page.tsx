import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { FounderDashboard } from '@/components/dashboard/founder-dashboard';
import { SpecialistDashboard } from '@/components/dashboard/specialist-dashboard';
import { MentorDashboardEmbed } from '@/components/dashboard/mentor-dashboard';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  if (user.primaryRole === 'SPECIALIST') return <SpecialistDashboard user={user} />;
  if (user.primaryRole === 'MENTOR') return <MentorDashboardEmbed user={user} />;
  return <FounderDashboard user={user} />;
}
