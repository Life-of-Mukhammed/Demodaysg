'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Rocket, Heart, Kanban, GraduationCap, Bell, Trophy, Newspaper, Settings, Shield, Sparkles,
  User as UserIcon, type LucideIcon,
} from 'lucide-react';
import { getNavItems } from './nav-items';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, Rocket, Heart, Kanban, GraduationCap, Bell, Trophy, Newspaper, Settings, Shield, UserIcon,
};

export function Sidebar({ isAdmin, primaryRole }: { isAdmin?: boolean; primaryRole?: string }) {
  const pathname = usePathname();
  const items = getNavItems(isAdmin, primaryRole);

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/40 bg-secondary/40">
      <div className="px-5 py-5 border-b border-border/40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center soft-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-lg tracking-tight">Venture Buildings</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground font-medium',
                item.admin && 'border-t border-border/40 mt-3 pt-3 rounded-none'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/40">
        <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{primaryRole}</div>
      </div>
    </aside>
  );
}
