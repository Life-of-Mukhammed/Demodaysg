'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { ComponentType } from 'react';

export type NavItem = {
  href: string;
  iconName: string;
  label: string;
  admin?: boolean;
};

import {
  LayoutDashboard, Rocket, Kanban, Settings, Shield,
  Users, FileText,
} from 'lucide-react';

const ICON_MAP: Record<string, ComponentType<any>> = {
  LayoutDashboard, Rocket, Kanban, Settings, Shield, Users, FileText,
};

export function MobileSidebar({ items, role }: { items: NavItem[]; role?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col bg-secondary/95 backdrop-blur-xl">
        <div className="px-5 py-5 border-b border-border/40">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center soft-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg tracking-tight">Venture Builders</span>
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
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
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

        {role && (
          <div className="p-3 border-t border-border/40">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{role}</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
