export type SidebarNavItem = { href: string; iconName: string; label: string; admin?: boolean };

export function getNavItems(isAdmin?: boolean, primaryRole?: string): SidebarNavItem[] {
  const founder: SidebarNavItem[] = [
    { href: '/dashboard', iconName: 'LayoutDashboard', label: 'Dashboard' },
    { href: '/startups', iconName: 'Rocket', label: 'My Startups' },
    { href: '/match', iconName: 'Heart', label: 'Find Specialist' },
    { href: '/applications', iconName: 'Bell', label: 'Applications' },
    { href: '/workspace', iconName: 'Kanban', label: 'Workspace' },
  ];
  const specialist: SidebarNavItem[] = [
    { href: '/dashboard', iconName: 'LayoutDashboard', label: 'Dashboard' },
    { href: '/profile/specialist', iconName: 'UserIcon', label: 'My Profile' },
    { href: '/match', iconName: 'Heart', label: 'Find Vacancy' },
    { href: '/applications', iconName: 'Bell', label: 'My Applications' },
    { href: '/workspace', iconName: 'Kanban', label: 'Workspace' },
  ];
  const mentor: SidebarNavItem[] = [
    { href: '/dashboard', iconName: 'LayoutDashboard', label: 'Dashboard' },
    { href: '/mentor', iconName: 'GraduationCap', label: 'My Startups' },
  ];
  const roleItems = primaryRole === 'SPECIALIST' ? specialist : primaryRole === 'MENTOR' ? mentor : founder;
  const common: SidebarNavItem[] = [
    { href: '/leaderboard', iconName: 'Trophy', label: 'Leaderboard' },
    { href: '/news', iconName: 'Newspaper', label: 'News' },
    { href: '/notifications', iconName: 'Bell', label: 'Notifications' },
    { href: '/settings', iconName: 'Settings', label: 'Settings' },
  ];
  return [
    ...roleItems,
    ...common,
    ...(isAdmin ? [{ href: '/admin', iconName: 'Shield', label: 'Admin', admin: true } as SidebarNavItem] : []),
  ];
}
