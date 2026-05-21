import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/app/sidebar';
import { getNavItems } from '@/components/app/nav-items';
import { Topbar } from '@/components/app/topbar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const unread = await prisma.notification.count({
    where: { userId: user.id, read: false },
  });

  const navItems = getNavItems(user.isAdmin, user.primaryRole);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isAdmin={user.isAdmin} primaryRole={user.primaryRole} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Topbar
          user={{
            displayName: user.displayName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            primaryRole: user.primaryRole,
          }}
          unread={unread}
          navItems={navItems}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
