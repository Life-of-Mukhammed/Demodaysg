import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { CreateSprintButton } from '@/components/workspace/create-sprint';

export default async function SprintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      sprints: {
        orderBy: { createdAt: 'desc' },
        include: { tasks: true },
      },
    },
  });
  if (!startup) notFound();

  const isMentor = user.primaryRole === 'MENTOR';
  const canCreate = (isMentor && startup.mentorId === user.id) || user.isAdmin;

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href={`/startups/${id}`} className="text-xs text-muted-foreground hover:text-primary">← {startup.name}</Link>
          <div className="flex items-center gap-2 mt-1">
            <Target className="w-5 h-5 text-primary" />
            <h1 className="font-display text-3xl tracking-tight">Sprints</h1>
            <Badge variant="outline" className="text-[10px]">{startup.sprints.length} ta</Badge>
          </div>
        </div>
        {canCreate && <CreateSprintButton startupId={id} startupName={startup.name} />}
      </div>

      {startup.sprints.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-16 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl tracking-tight">Hali sprint yo'q</h3>
            <p className="text-muted-foreground mt-2">
              {canCreate ? 'Birinchi sprintni yaratish vaqti keldi' : 'Mentor sprint yaratganda paydo bo\'ladi'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {startup.sprints.map((sp) => {
            const done = sp.tasks.filter((t) => t.status === 'DONE').length;
            const pct = sp.tasks.length ? Math.round((done / sp.tasks.length) * 100) : 0;
            return (
              <Card key={sp.id} className="soft-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{sp.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{sp.goal}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(sp.startDate).toLocaleDateString()} → {new Date(sp.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={sp.completed ? 'success' : 'gradient'} className="text-[10px]">
                    {sp.completed ? 'Done' : 'Active'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{done}/{sp.tasks.length} tasks</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
