import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { Bell, Heart, Sparkles, ClipboardCheck, MessageSquare, Award } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

const ICONS: Record<string, any> = {
  MATCH: Heart, TASK_ASSIGNED: ClipboardCheck, TASK_DEADLINE: Bell,
  SPRINT_STARTED: Sparkles, MENTOR_FEEDBACK: MessageSquare, AI_RECOMMENDATION: Sparkles,
  BADGE_EARNED: Award, GENERIC: Bell,
};
const COLORS: Record<string, string> = {
  MATCH: 'from-rose-500 to-orange-500',
  TASK_ASSIGNED: 'from-blue-500 to-cyan-500',
  TASK_DEADLINE: 'from-amber-500 to-orange-500',
  SPRINT_STARTED: 'from-orange-500 to-amber-500',
  MENTOR_FEEDBACK: 'from-emerald-500 to-teal-500',
  AI_RECOMMENDATION: 'from-amber-500 to-orange-500',
  BADGE_EARNED: 'from-amber-400 to-orange-500',
  GENERIC: 'from-slate-500 to-slate-600',
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <PageHeader
        eyebrow="Notifications"
        icon={<Bell />}
        title="Bildirishnomalar"
        subtitle={`${notifications.length} ta jami${unread ? ` · ${unread} ta yangi` : ''}`}
      />

      <Card className="soft-shadow overflow-hidden">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5">
                <Bell className="w-9 h-9 text-primary" />
              </div>
              <h3 className="font-display text-2xl tracking-tight">Hozircha bildirishnoma yo'q</h3>
              <p className="text-sm text-muted-foreground mt-2">Match, task, sprint va boshqa harakatlar shu yerda paydo bo'ladi</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                const color = COLORS[n.type];
                const inner = (
                  <div className="flex items-start gap-4 p-4 hover:bg-accent/40 transition">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 soft-shadow`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium text-sm leading-snug">{n.title}</div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                      </div>
                      {n.body && <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.body}</div>}
                    </div>
                  </div>
                );
                return n.link ? <Link key={n.id} href={n.link}>{inner}</Link> : <div key={n.id}>{inner}</div>;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
