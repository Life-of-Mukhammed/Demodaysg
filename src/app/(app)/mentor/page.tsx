import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Star, TrendingUp } from 'lucide-react';
import { formatScore, scoreColor } from '@/lib/utils';

export default async function MentorPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');
  if (user.primaryRole !== 'MENTOR' && !user.isAdmin) redirect('/dashboard');

  const reviews = await prisma.mentorReview.findMany({
    where: { mentorId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { startup: true },
  });

  const startupIds = [...new Set(reviews.map((r) => r.startupId))];
  const assigned = await prisma.startup.findMany({
    where: { id: { in: startupIds } },
    include: { _count: { select: { tasks: true, members: true } } },
  });

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <GraduationCap className="w-4 h-4 text-emerald-500" /> Mentor Dashboard
        </div>
        <h1 className="font-display text-3xl font-bold">Hello, mentor</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Assigned Startups" value={assigned.length} color="from-emerald-500 to-teal-500" />
        <StatCard label="Reviews Given" value={reviews.length} color="from-blue-500 to-cyan-500" />
        <StatCard
          label="Avg Score Given"
          value={reviews.length ? Math.round(reviews.reduce((s, r) => s + r.score, 0) / reviews.length) : '—'}
          color="from-violet-500 to-fuchsia-500"
        />
      </div>

      <Card>
        <CardHeader><CardTitle>Assigned Startups</CardTitle></CardHeader>
        <CardContent>
          {assigned.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Hali sizga startup biriktirilmagan. Admin sizni biriktiradi.</p>
          ) : (
            <div className="space-y-3">
              {assigned.map((s) => (
                <Link key={s.id} href={`/mentor/${s.id}/review`} className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/40 transition">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center font-bold">{s.name[0]}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                        <span>{s._count.members + 1} team members</span>
                      </div>
                    </div>
                    <div className={`font-bold text-2xl ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Hali baholash bermagansiz</p>
          ) : (
            <div className="space-y-2">
              {reviews.map((r) => (
                <div key={r.id} className="p-3 border border-border/50 rounded-lg flex items-center gap-3">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.startup.name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.weekOf).toLocaleDateString()} · {r.score}/10</div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />
      <CardContent className="p-5 relative">
        <div className="text-xs uppercase text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-bold mt-2">{value}</div>
      </CardContent>
    </Card>
  );
}
