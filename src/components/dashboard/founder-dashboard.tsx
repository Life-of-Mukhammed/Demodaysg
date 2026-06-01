import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/page-header';
import {
  Rocket, TrendingUp, Users, Trophy, Flame, Plus, ArrowRight,
  Activity, Target, Sparkles, Wand2,
} from 'lucide-react';
import { formatScore, scoreColor, scoreCategory, xpToNextLevel } from '@/lib/utils';

export async function FounderDashboard({ user }: { user: any }) {
  const startups = await prisma.startup.findMany({
    where: { founderId: user.id },
    include: { members: true, sprints: { where: { completed: false }, take: 1 }, _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });
  const badges = await prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, take: 6 });
  const totalSprints = await prisma.sprint.count({ where: { startup: { founderId: user.id } } });
  const completedSprints = await prisma.sprint.count({ where: { startup: { founderId: user.id }, completed: true } });

  return (
    <div className="container max-w-7xl py-6 md:py-8 space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Founder Dashboard"
        icon={<Rocket />}
        title={`Salom, ${user.displayName || user.email.split('@')[0]} 👋`}
        subtitle="Sizning startup operatsion markaziz. AI baholash, jamoa, sprint va investor readiness — bir joyda."
        action={
          <Button asChild variant="glow" size="lg" className="rounded-full">
            <Link href="/startups/new"><Plus className="w-4 h-4" /> Yangi startup</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard icon={Rocket} label="Startups" value={String(startups.length)} sub="Active" gradient="from-orange-500 to-amber-500" />
        <KpiCard icon={Target} label="Sprintlar" value={`${completedSprints}/${totalSprints}`} sub={`${Math.max(0, totalSprints - completedSprints)} aktiv`} gradient="from-amber-500 to-yellow-500" />
        <KpiCard icon={Flame} label="Streak" value={`${streak?.currentDays || 0}d`} sub={`Top: ${streak?.longestDays || 0}d`} gradient="from-rose-500 to-orange-500" />
        <KpiCard icon={Trophy} label={`Level ${user.level}`} value={`${user.xp} XP`} sub={`${xpToNextLevel(user.xp)} XP to next`} gradient="from-emerald-500 to-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="soft-shadow overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary" />
                <CardTitle>Sizning startuplaringiz</CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/startups">Hammasi <ArrowRight className="w-3 h-3" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {startups.length === 0 ? (
                <EmptyStartups />
              ) : (
                <div className="space-y-3">
                  {startups.slice(0, 5).map((s) => (
                    <Link key={s.id} href={`/startups/${s.id}`} className="block group">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-accent/30 transition-all">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-2xl">
                          {s.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate group-hover:text-primary transition">{s.name}</h4>
                            <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-2">{s.pitch}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.members.length + 1}</span>
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{s.sprints.length} aktiv</span>
                            <span className="flex items-center gap-1"><Target className="w-3 h-3" />{s._count.tasks} task</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-display text-3xl ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
                          <div className="text-[10px] text-muted-foreground">{s.aiScore != null ? scoreCategory(s.aiScore) : 'eval...'}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {startups[0]?.sprints[0] && (
            <Card className="soft-shadow overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500/8 via-amber-500/8 to-rose-500/8 p-5 border-b border-border/40">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  <Target className="w-3.5 h-3.5 text-primary" /> Joriy sprint
                </div>
                <h3 className="font-display text-2xl tracking-tight">{startups[0].sprints[0].name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{startups[0].sprints[0].goal}</p>
              </div>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>Progress</span>
                  <span className="text-primary">{Math.round(startups[0].sprints[0].completionRate)}%</span>
                </div>
                <Progress value={startups[0].sprints[0].completionRate} />
                <Button asChild variant="outline" size="sm" className="w-full mt-3">
                  <Link href={`/startups/${startups[0].id}/workspace`}>Workspace ochish <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden soft-shadow">
            <div className="relative bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-6">
              <div className="absolute top-3 right-3 opacity-20"><TrendingUp className="w-16 h-16" /></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Investor Readiness</span>
                </div>
                <div className="font-display text-3xl tracking-tight">{startups[0]?.investorReady?.replace('_', ' ') || 'No data'}</div>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full rounded-full">
                  <Link href={startups[0] ? `/startups/${startups[0].id}/investor` : '#'}>Tafsilot</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="soft-shadow">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Trophy className="w-4 h-4 text-amber-500" /> Yutuqlar</CardTitle></CardHeader>
            <CardContent>
              {badges.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Startup yarating va sprint tugating</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {badges.map((ub) => (
                    <div key={ub.id} className="text-center p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                      <div className="text-3xl">{ub.badge.icon}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 truncate">{ub.badge.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="soft-shadow">
            <CardContent className="p-4 space-y-1">
              <Link href="/match" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500/15 to-orange-500/15 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Dasturchi topish</div>
                  <div className="text-[10px] text-muted-foreground">AI swipe matching</div>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
              </Link>
              <Link href="/applications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Arizalar</div>
                  <div className="text-[10px] text-muted-foreground">Kelgan arizalarni ko'rish</div>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmptyStartups() {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5 soft-shadow">
        <Rocket className="w-9 h-9 text-primary" />
      </div>
      <h3 className="font-display text-3xl tracking-tight mb-2">Birinchi startup'ingiz</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">AI g'oyangizni baholaydi va sizga mos jamoa quradi</p>
      <Button asChild className="mt-6 rounded-full" variant="brand"><Link href="/startups/new">Yaratish boshlash</Link></Button>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, gradient }: any) {
  return (
    <Card className="relative overflow-hidden group hover:-translate-y-1 transition soft-shadow hover:elevated-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.08] transition`} />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center soft-shadow group-hover:scale-110 transition`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold">{label}</div>
        <div className="font-display text-3xl tracking-tight mt-1">{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}
