import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Kanban as KanbanIcon, Users, Target } from 'lucide-react';

export default async function WorkspaceIndex() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const startups = await prisma.startup.findMany({
    where: { OR: [{ founderId: user.id }, { members: { some: { userId: user.id } } }] },
    include: {
      _count: { select: { members: true, tasks: true, sprints: true } },
      sprints: { where: { completed: false }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (startups.length === 0) redirect('/startups');

  // If only 1 startup, auto-redirect
  if (startups.length === 1) redirect(`/startups/${startups[0].id}/workspace`);

  // Multiple startups → show selector
  return (
    <div className="container max-w-4xl py-10 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <KanbanIcon className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace tanlash</span>
        </div>
        <h1 className="font-display text-4xl tracking-tight">Qaysi startup workspace?</h1>
        <p className="text-muted-foreground mt-1">Sizning {startups.length} ta startup'ingiz bor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {startups.map((s) => (
          <Link key={s.id} href={`/startups/${s.id}/workspace`}>
            <Card className="soft-shadow hover:elevated-shadow hover:-translate-y-1 transition cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-xl">
                    {s.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-xl tracking-tight truncate">{s.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{s.sector}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s._count.members + 1}</span>
                  <span className="flex items-center gap-1"><KanbanIcon className="w-3 h-3" /> {s._count.tasks} task</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {s.sprints.length} active</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
