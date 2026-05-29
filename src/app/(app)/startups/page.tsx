import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { Plus, Rocket, Users, Target, Activity, ArrowRight } from 'lucide-react';
import { formatScore, scoreColor, scoreCategory } from '@/lib/utils';

export default async function StartupsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const startups = await prisma.startup.findMany({
    include: {
      founder: { select: { displayName: true, email: true, avatarUrl: true } },
      _count: { select: { members: true, listings: true, tasks: true, sprints: true } },
      listings: { where: { active: true }, select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <PageHeader
        eyebrow="Barcha startuplar"
        icon={<Rocket />}
        title="Startups"
        subtitle={`${startups.length} ta startup · Open = ishchi qabul qilmoqda`}
        action={
          user.primaryRole === 'FOUNDER' && (
            <Button asChild variant="glow" size="lg" className="rounded-full">
              <Link href="/startups/new"><Plus className="w-4 h-4" /> Yangi</Link>
            </Button>
          )
        }
      />

      {startups.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5 soft-shadow">
              <Rocket className="w-9 h-9 text-primary" />
            </div>
            <h3 className="font-display text-3xl tracking-tight mb-2">Hozircha startup yo'q</h3>
            <p className="text-sm text-muted-foreground mb-6">Birinchi founder bo'ling</p>
            {user.primaryRole === 'FOUNDER' && (
              <Button asChild variant="brand" className="rounded-full">
                <Link href="/startups/new">Birinchi startup</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {startups.map((s) => {
            const isOpen = s.listings.length > 0;
            const isOwner = s.founderId === user.id;
            return (
              <Link key={s.id} href={isOwner ? `/startups/${s.id}` : `/startups/${s.id}`}>
                <Card className="h-full group relative overflow-hidden hover:-translate-y-1 transition-all soft-shadow hover:elevated-shadow cursor-pointer">
                  <div className="h-24 relative bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.35),transparent_60%)]" />
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-3 left-5 flex items-center gap-2">
                      <Badge variant="default" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px]">
                        {s.stage}
                      </Badge>
                      <Badge
                        className={`text-[10px] font-semibold border ${isOpen ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/40' : 'bg-white/10 text-white/70 border-white/20'}`}
                      >
                        {isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-5 text-right text-white">
                      <div className="font-display text-4xl leading-none">{formatScore(s.aiScore)}</div>
                      <div className="text-[9px] opacity-80">{s.aiScore != null ? scoreCategory(s.aiScore) : '—'}</div>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 -mt-9 mb-4">
                      <div className="w-14 h-14 rounded-xl border-4 border-card bg-card flex items-center justify-center font-display text-2xl soft-shadow">
                        {s.name[0]?.toUpperCase()}
                      </div>
                    </div>

                    <h3 className="font-display text-xl tracking-tight group-hover:text-primary transition">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">{s.pitch}</p>

                    <div className="text-[10px] text-muted-foreground mt-1.5">
                      by {s.founder.displayName || s.founder.email.split('@')[0]}
                      {isOwner && <span className="ml-1 text-primary font-semibold">(men)</span>}
                    </div>

                    <div className="flex items-center gap-2 mt-3 mb-3">
                      <Badge variant="outline" className="text-[10px]">{s.sector}</Badge>
                      {s.investorReady === 'INVESTOR_READY' && <Badge variant="success" className="text-[10px]">VC ready</Badge>}
                      {s.investorReady === 'ALMOST_READY' && <Badge variant="warning" className="text-[10px]">Almost</Badge>}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40">
                      <Stat icon={Users} value={s._count.members + 1} label="a'zo" />
                      <Stat icon={Target} value={s._count.sprints} label="sprint" />
                      <Stat icon={Activity} value={s._count.listings} label="vakansiya" />
                    </div>
                  </CardContent>

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px]">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="font-display text-xl mt-0.5">{value}</div>
    </div>
  );
}
