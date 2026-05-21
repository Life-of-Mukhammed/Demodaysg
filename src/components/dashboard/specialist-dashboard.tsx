import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  TrendingUp,
  Briefcase,
  Trophy,
  Flame,
  Sparkles,
  ArrowRight,
  FileText,
  Github,
  Linkedin,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { formatScore, scoreColor, xpToNextLevel } from '@/lib/utils';

export async function SpecialistDashboard({ user }: { user: any }) {
  const profile = await prisma.specialistProfile.findUnique({
    where: { userId: user.id },
  });

  const memberships = await prisma.startupMember.findMany({
    where: { userId: user.id },
    include: { startup: true },
    take: 5,
  });

  const totalSwipes = await prisma.swipe.count({ where: { swiperId: user.id } });
  const matches = await prisma.match.count({
    where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
  });
  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });

  // Profile completion checklist
  const checks = [
    { key: 'bio', label: 'Bio', done: !!profile?.bio },
    { key: 'skills', label: 'Skills', done: (profile?.skills?.length ?? 0) >= 3 },
    { key: 'roles', label: 'Roles', done: (profile?.primaryRoles?.length ?? 0) > 0 },
    { key: 'resume', label: 'Resume', done: !!profile?.resumeText },
    { key: 'links', label: 'Links', done: !!(profile?.github || profile?.linkedin || profile?.portfolio) },
    { key: 'aiScore', label: 'AI Score', done: profile?.aiScore != null },
  ];
  const completed = checks.filter((c) => c.done).length;
  const completionPct = Math.round((completed / checks.length) * 100);

  return (
    <div className="container max-w-7xl py-6 md:py-8 space-y-6 md:space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome,</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight mt-1">
            {user.displayName || user.email.split('@')[0]} 👋
          </h1>
        </div>
        <div className="flex gap-2">
          {profile?.aiScore == null ? (
            <Button asChild variant="glow" size="lg" className="rounded-full">
              <Link href="/profile/specialist">
                <Sparkles className="w-4 h-4" /> Complete profile
              </Link>
            </Button>
          ) : (
            <Button asChild variant="glow" size="lg" className="rounded-full">
              <Link href="/match">
                <Heart className="w-4 h-4" /> Find startup
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Sparkles} label="AI Score" value={profile?.aiScore != null ? String(profile.aiScore) : '—'} sub={profile?.aiScore != null ? scoreCategoryShort(profile.aiScore) : 'Not evaluated'} gradient="from-orange-500 to-amber-500" />
        <KpiCard icon={Heart} label="Matches" value={String(matches)} sub={`${totalSwipes} swipes`} gradient="from-rose-500 to-orange-500" />
        <KpiCard icon={Briefcase} label="Joined Teams" value={String(memberships.length)} gradient="from-amber-500 to-yellow-500" />
        <KpiCard icon={Trophy} label="Level" value={String(user.level)} sub={`${user.xp} XP · ${xpToNextLevel(user.xp)} to next`} gradient="from-emerald-500 to-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile completion */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden soft-shadow">
            <div className="bg-gradient-to-br from-orange-500/8 via-amber-500/8 to-rose-500/8 px-6 py-5 border-b border-border/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Profile Completion</div>
                  <div className="font-display text-3xl mt-1 tracking-tight">{completionPct}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{completed} / {checks.length} done</div>
                </div>
              </div>
              <Progress value={completionPct} className="mt-4" />
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {checks.map((c) => (
                  <div key={c.key} className="flex items-center gap-3 px-6 py-3">
                    {c.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/40" />
                    )}
                    <span className={`flex-1 text-sm ${c.done ? 'text-muted-foreground' : 'font-medium'}`}>{c.label}</span>
                    {!c.done && (
                      <Link href="/profile/specialist" className="text-xs text-primary font-medium hover:underline">
                        Complete →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Joined teams */}
          <Card className="soft-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Teams</CardTitle>
              {memberships.length > 0 && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/workspace">Open workspace <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {memberships.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="font-display text-2xl tracking-tight">No teams yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">Swipe right on startups to find your team</p>
                  <Button asChild className="mt-6 rounded-full">
                    <Link href="/match"><Heart className="w-4 h-4" /> Find startup</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberships.map((m) => (
                    <Link key={m.id} href={`/startups/${m.startupId}/workspace`} className="block group">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-accent/30 transition-all">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-xl">
                          {m.startup.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate group-hover:text-primary transition">{m.startup.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Badge variant="outline" className="text-[10px]">{m.role}</Badge>
                            <span>{m.startup.stage}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: profile summary + actions */}
        <div className="space-y-6">
          {/* AI summary */}
          {profile?.aiScore != null && profile.aiSummary && (
            <Card className="overflow-hidden soft-shadow">
              <div className="bg-gradient-to-br from-orange-500/8 via-amber-500/8 to-rose-500/8 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Assessment</span>
                </div>
                <div className={`font-display text-5xl tracking-tight ${scoreColor(profile.aiScore)}`}>
                  {profile.aiScore}
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{profile.aiSummary}</p>
              </div>
            </Card>
          )}

          {/* Skills */}
          {(profile?.skills?.length ?? 0) > 0 && (
            <Card className="soft-shadow">
              <CardHeader><CardTitle className="text-base">Your Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {profile!.skills.slice(0, 12).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick actions */}
          <Card className="soft-shadow">
            <CardContent className="p-4 space-y-2">
              <Link href="/profile/specialist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition group">
                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                <span className="text-sm font-medium flex-1">Edit profile</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <Link href="/match" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition group">
                <Heart className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                <span className="text-sm font-medium flex-1">Discover startups</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition group">
                <Trophy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                <span className="text-sm font-medium flex-1">Leaderboard</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function scoreCategoryShort(s: number) {
  if (s >= 85) return 'VC Backable';
  if (s >= 70) return 'High Potential';
  if (s >= 55) return 'Promising';
  if (s >= 40) return 'Average';
  return 'Needs work';
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:-translate-y-1 transition soft-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</div>
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center soft-shadow`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="font-display text-4xl tracking-tight mt-3">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}
