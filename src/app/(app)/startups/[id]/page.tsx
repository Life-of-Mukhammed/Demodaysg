import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatScore, scoreColor, scoreCategory } from '@/lib/utils';
import {
  Sparkles, Users, Target, TrendingUp, Kanban, Heart, ArrowRight,
  Crown, GraduationCap, MapPin, Calendar, BarChart3,
} from 'lucide-react';
import { ListingsManager } from '@/components/listings/listings-manager';

export default async function StartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      founder: { select: { displayName: true, email: true, avatarUrl: true, level: true } },
      mentor: { select: { displayName: true, email: true, avatarUrl: true } },
      members: { include: { user: true } },
      sprints: { orderBy: { createdAt: 'desc' }, take: 3 },
      _count: { select: { tasks: true } },
    },
  });

  if (!startup) notFound();

  const metrics = (startup.scoreMetrics as Record<string, number>) || {};
  const isFounder = startup.founderId === user.id;

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40">
        <div className="h-48 bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.35),transparent_60%)]" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px]">
                {startup.stage}
              </Badge>
              <Badge variant="default" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px]">
                {startup.sector}
              </Badge>
              {startup.location && (
                <span className="text-white/90 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {startup.location}</span>
              )}
            </div>
            <div className="text-right text-white">
              <div className="text-[10px] uppercase tracking-wider opacity-80">AI Score</div>
              <div className="font-display text-6xl leading-none">{formatScore(startup.aiScore)}</div>
              <div className="text-[10px] opacity-80">{startup.aiScore != null ? scoreCategory(startup.aiScore) : 'eval...'}</div>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 -mt-8 relative">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-card bg-card flex items-center justify-center font-display text-3xl soft-shadow">
              {startup.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-4xl tracking-tight">{startup.name}</h1>
              <p className="text-base text-muted-foreground mt-2 max-w-2xl">{startup.pitch}</p>
            </div>
          </div>

          {/* Team strip */}
          <div className="mt-5 pt-5 border-t border-border/40 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/40">
              <Avatar className="w-7 h-7">
                {startup.founder.avatarUrl && <AvatarImage src={startup.founder.avatarUrl} />}
                <AvatarFallback className="text-[10px]">{(startup.founder.displayName || startup.founder.email)[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <span className="font-medium">{startup.founder.displayName || startup.founder.email.split('@')[0]}</span>
                <span className="text-muted-foreground ml-1.5">Founder · L{startup.founder.level}</span>
              </div>
            </div>
            {startup.mentor && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <span className="font-medium">{startup.mentor.displayName || startup.mentor.email.split('@')[0]}</span>
                  <span className="text-muted-foreground ml-1.5">Mentor</span>
                </div>
              </div>
            )}
            {startup.members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/40">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[10px]">{(m.user.displayName || m.user.email)[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-xs">
                  <span className="font-medium">{m.user.displayName || m.user.email.split('@')[0]}</span>
                  <span className="text-muted-foreground ml-1.5">{m.role.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ActionCard href={`/startups/${id}/workspace`} icon={Kanban} label="Workspace" sub="Kanban + tasks" gradient="from-orange-500 to-amber-500" />
        <ActionCard href={`/match?startup=${id}`} icon={Heart} label="Find Specialist" sub="AI swipe match" gradient="from-rose-500 to-orange-500" />
        <ActionCard href={`/startups/${id}/sprint`} icon={Target} label="Sprintlar" sub="Reja va progress" gradient="from-amber-500 to-yellow-500" />
        <ActionCard href={`/startups/${id}/investor`} icon={TrendingUp} label="Investor Ready" sub="AI baholash" gradient="from-emerald-500 to-teal-500" />
      </div>

      {/* AI Evaluation */}
      <Card className="soft-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Baholash
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!startup.aiScore ? (
            <div className="flex items-center gap-3 text-muted-foreground py-6">
              <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              AI startupingizni baholamoqda...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> Metrikalar
                </div>
                {Object.entries(metrics).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className={`font-medium ${scoreColor(v)}`}>{v}/100</span>
                    </div>
                    <Progress value={v} className="h-1.5" />
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">AI Feedback</div>
                <div className="p-4 rounded-xl bg-accent/30 border border-border/40">
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{startup.aiFeedback}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sprints */}
      <Card className="soft-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Sprintlar</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/startups/${id}/sprint`}>Hammasi <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {startup.sprints.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Hali sprint yo'q. Mentor sprint yaratganda paydo bo'ladi.</p>
            </div>
          ) : (
            startup.sprints.map((sp) => (
              <Link key={sp.id} href={`/startups/${id}/workspace`} className="block group">
                <div className="p-4 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-accent/30 transition">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-sm group-hover:text-primary transition">{sp.name}</div>
                    <Badge variant={sp.completed ? 'success' : 'gradient'} className="text-[10px]">{sp.completed ? 'Done' : 'Aktiv'}</Badge>
                  </div>
                  <Progress value={sp.completionRate} className="h-1.5" />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(sp.startDate).toLocaleDateString()} → {new Date(sp.endDate).toLocaleDateString()}</span>
                    <span>{Math.round(sp.completionRate)}%</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Listings — only for founder */}
      {isFounder && <ListingsManager startupId={id} />}
    </div>
  );
}

function ActionCard({ href, icon: Icon, label, sub, gradient }: any) {
  return (
    <Link href={href}>
      <Card className="group relative overflow-hidden cursor-pointer soft-shadow hover:elevated-shadow hover:-translate-y-1 transition-all">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.1] transition`} />
        <CardContent className="p-4 relative">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center soft-shadow mb-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="font-medium text-sm">{label}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
