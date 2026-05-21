import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AdminPanel } from '@/components/admin/admin-panel';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) redirect('/dashboard');
  return <AdminPanel />;
}
