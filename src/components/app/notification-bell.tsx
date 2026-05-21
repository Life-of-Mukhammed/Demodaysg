'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Heart, Sparkles, Trophy, ClipboardCheck, MessageSquare, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { timeAgo } from '@/lib/utils';

const ICONS: Record<string, any> = {
  MATCH: Heart,
  TASK_ASSIGNED: ClipboardCheck,
  TASK_DEADLINE: Bell,
  SPRINT_STARTED: Sparkles,
  MENTOR_FEEDBACK: MessageSquare,
  AI_RECOMMENDATION: Sparkles,
  BADGE_EARNED: Award,
  GENERIC: Bell,
};

const COLORS: Record<string, string> = {
  MATCH: 'from-rose-500 to-orange-500',
  TASK_ASSIGNED: 'from-orange-500 to-amber-500',
  TASK_DEADLINE: 'from-amber-500 to-yellow-500',
  SPRINT_STARTED: 'from-orange-500 to-amber-500',
  MENTOR_FEEDBACK: 'from-emerald-500 to-teal-500',
  AI_RECOMMENDATION: 'from-amber-500 to-orange-500',
  BADGE_EARNED: 'from-amber-400 to-orange-500',
  GENERIC: 'from-slate-500 to-slate-600',
};

export function NotificationBell({ initialUnread }: { initialUnread: number }) {
  const [unread, setUnread] = useState(initialUnread);
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setItems(data.items || []);
      setUnread(data.unread || 0);
    } catch {}
  }

  // Poll every 30s
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);
    return () => clearInterval(t);
  }, []);

  async function markRead() {
    setLoading(true);
    await fetch('/api/notifications', { method: 'PATCH' });
    setUnread(0);
    setItems((it) => it.map((n) => ({ ...n, read: true })));
    setLoading(false);
  }

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) refresh(); }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 max-h-[500px] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
          <div className="font-semibold text-sm">Bildirishnomalar</div>
          {unread > 0 && (
            <button onClick={markRead} disabled={loading} className="text-xs text-primary hover:underline">
              Hammasini o'qilgan
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Hozircha bildirishnoma yo'q</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {items.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                const color = COLORS[n.type];
                const content = (
                  <div className={`flex items-start gap-3 p-3 hover:bg-accent/40 transition ${!n.read ? 'bg-primary/[0.03]' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium leading-snug">{n.title}</div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                      </div>
                      {n.body && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</div>}
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>{content}</Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-border/40">
          <Link href="/notifications" onClick={() => setOpen(false)} className="text-xs text-primary hover:underline">
            Barchasini ko'rish →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
