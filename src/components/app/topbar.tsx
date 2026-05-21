'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { signOut as fbSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { NotificationBell } from '@/components/app/notification-bell';
import { MobileSidebar, type NavItem as MobileNavItem } from '@/components/app/mobile-sidebar';
import { Badge } from '@/components/ui/badge';

export function Topbar({
  user,
  unread,
  navItems,
}: {
  user: { displayName?: string | null; email: string; avatarUrl?: string | null; level: number; xp: number; primaryRole?: string };
  unread: number;
  navItems: MobileNavItem[];
}) {
  const router = useRouter();

  async function onLogout() {
    try {
      const a = auth();
      if (a) await fbSignOut(a);
      await fetch('/api/auth/session', { method: 'DELETE' });
    } finally {
      window.location.href = '/';
    }
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-2 md:gap-3">
        <MobileSidebar items={navItems} role={user.primaryRole} />
        <Badge variant="gradient" className="gap-1 text-xs">Lv {user.level}</Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">{user.xp} XP</span>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <div className="hidden sm:flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <NotificationBell initialUnread={unread} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 outline-none">
              <Avatar>
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                <AvatarFallback>{(user.displayName || user.email)[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <UserIcon className="w-4 h-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden" onClick={() => {}}>
              <LanguageSwitcher />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
