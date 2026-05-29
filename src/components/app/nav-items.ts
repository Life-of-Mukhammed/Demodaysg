export type SidebarNavItem = { href: string; iconName: string; label: string; admin?: boolean };

export function getNavItems(isAdmin?: boolean): SidebarNavItem[] {
  const items: SidebarNavItem[] = [
    { href: '/dashboard', iconName: 'LayoutDashboard', label: 'Dashboard' },
    { href: '/programmers', iconName: 'Users', label: 'Programmers' },
    { href: '/applications', iconName: 'FileText', label: 'Applications' },
    { href: '/workspace', iconName: 'Kanban', label: 'Workspace' },
    { href: '/startups', iconName: 'Rocket', label: 'Startups' },
    { href: '/settings', iconName: 'Settings', label: 'Settings' },
  ];
  return [
    ...items,
    ...(isAdmin ? [{ href: '/admin', iconName: 'Shield', label: 'Admin', admin: true } as SidebarNavItem] : []),
  ];
}
