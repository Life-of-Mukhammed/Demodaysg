import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GraduationCap, Star, TrendingUp, Users, Target,
  CheckCircle2, Activity, Sparkles,
} from 'lucide-react';
import { formatScore, scoreColor, scoreCategory } from '@/lib/utils';

export async function MentorDashboardEmbed({ user }: { user: any }) {
  const assigned = await prisma.startup.findMany({
    where: { mentorId: user.id },
    include: {
      founder: { select: { email: true, displayName: true, avatarUrl: true, xp: true, level: true } },
      members: { include: { user: { select: { displayName: true, email: true, xp: true, level: true } } } },
      sprints: { orderBy: { createdAt: 'desc' } },
      tasks: { select: { status: true } },
    },
  });

  const reviews = await prisma.mentorReview.findMany({
    where: { mentorId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { startup: { select: { name: true } } },
  });

  const totalTasks = assigned.reduce((s, st) => s + st.tasks.length, 0);
  const doneTasks = assigned.reduce((s, st) => s + st.tasks.filter((t) => t.status === 'DONE').length, 0);
  const overallCompletion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <GraduationCap className="w-4 h-4 text-emerald-500" /> Mentor Dashboard
        </div>
        <h1 className="font-display text-4xl tracking-tight">
          Hello, {user.displayName || user.email.split('@')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Sizga {assigned.length} ta startup biriktirilgan</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={GraduationCap} label="Assigned Startups" value={assigned.length} color="from-emerald-500 to-teal-500" />
        <StatCard icon={Target} label="Total Sprints" value={assigned.reduce((s, st) => s + st.sprints.length, 0)} color="from-orange-500 to-amber-500" />
        <StatCard icon={CheckCircle2} label="Tasks Done" value={`${doneTasks}/${totalTasks}`} color="from-rose-500 to-orange-500" />
        <StatCard icon={Activity} label="Overall %" value={`${overallCompletion}%`} color="from-violet-500 to-purple-500" />
      </div>

      <div>
        <h2 className="font-display text-2xl tracking-tight mb-4">Sizning startup'laringiz</h2>
        {assigned.length === 0 ? (
          <Card className="soft-shadow">
            <CardContent className="py-16 text-center">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-2xl tracking-tight">Hali startup biriktirilmagan</h3>
              <p className="text-sm text-muted-foreground mt-2">Admin sizga startup biriktirganda paydo bo'ladi</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {assigned.map((s) => {
              const sprintTotal = s.sprints.length;
              const sprintDone = s.sprints.filter((sp) => sp.completed).length;
              const taskDone = s.tasks.filter((t) => t.status === 'DONE').length;
              const taskTotal = s.tasks.length;
              const taskPct = taskTotal ? Math.round((taskDone / taskTotal) * 100) : 0;
              const teamSize = s.members.length + 1;

              return (
                <Card key={s.id} className="soft-shadow hover:elevated-shadow transition">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5 flex-wrap">
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-2xl">
                          {s.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link href={`/startups/${s.id}`} className="font-display text-xl tracking-tight hover:text-primary">
                              {s.name}
                            </Link>
                            <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{s.pitch}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-4 border-x border-border/40">
                        <Sparkles className="w-4 h-4 text-primary mb-1" />
                        <div className={`font-display text-3xl ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
                        <div className="text-[10px] text-muted-foreground">{s.aiScore != null ? scoreCategory(s.aiScore) : '—'}</div>
                      </div>

                      <div className="flex flex-col items-center px-4 border-r border-border/40">
                        <Users className="w-4 h-4 text-primary mb-1" />
                        <div className="font-display text-3xl">{teamSize}</div>
                        <div className="text-[10px] text-muted-foreground">a'zo</div>
                      </div>

                      <div className="flex flex-col items-center px-4 border-r border-border/40">
                        <Target className="w-4 h-4 text-primary mb-1" />
                        <div className="font-display text-3xl">{sprintDone}/{sprintTotal}</div>
                        <div className="text-[10px] text-muted-foreground">sprint</div>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <TrendingUp className="w-4 h-4 text-primary mb-1" />
                        <Badge variant={s.investorReady === 'INVESTOR_READY' ? 'success' : s.investorReady === 'ALMOST_READY' ? 'warning' : 'secondary'} className="text-[10px] mt-1">
                          {s.investorReady?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium">Task progress</span>
                        <span className="text-muted-foreground">{taskDone}/{taskTotal} ({taskPct}%)</span>
                      </div>
                      <Progress value={taskPct} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/40">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Jamoa va levellar</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/40">
                          <Avatar className="w-6 h-6">
                            {s.founder.avatarUrl && <AvatarImage src={s.founder.avatarUrl} />}
                            <AvatarFallback className="text-[10px]">{(s.founder.displayName || s.founder.email)[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <span className="font-medium">{s.founder.displayName || s.founder.email.split('@')[0]}</span>
                            <span className="text-muted-foreground ml-1.5">Founder · L{s.founder.level}</span>
                          </div>
                        </div>
                        {s.members.map((m) => (
                          <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/40">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-[10px]">{(m.user.displayName || m.user.email)[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-xs">
                              <span className="font-medium">{m.user.displayName || m.user.email.split('@')[0]}</span>
                              <span className="text-muted-foreground ml-1.5">{m.role.replace('_', ' ')} · L{m.user.level}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button asChild variant="brand" size="sm">
                        <Link href={`/startups/${s.id}/workspace`}>
                          <Target className="w-3.5 h-3.5" /> Workspace
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/startups/${s.id}/sprint`}>
                          <Activity className="w-3.5 h-3.5" /> Sprintlar
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/mentor/${s.id}/review`}>
                          <Star className="w-3.5 h-3.5" /> Weekly Review
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base">So'nggi sharhlar</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {reviews.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-2 hover:bg-accent/40 rounded-lg">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.startup.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.weekOf).toLocaleDateString()} · ball: {r.score}/10</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="relative overflow-hidden soft-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.04]`} />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between">
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</div>
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center soft-shadow`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="font-display text-3xl tracking-tight mt-2">{value}</div>
      </CardContent>
    </Card>
  );
}
