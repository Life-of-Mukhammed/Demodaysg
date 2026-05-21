import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Check, X, AlertCircle } from 'lucide-react';

export default async function InvestorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      members: true,
      sprints: { take: 5, orderBy: { createdAt: 'desc' } },
      metricsLogs: { take: 5, orderBy: { date: 'desc' } },
      reviews: { take: 3, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!startup) notFound();

  const checklist = [
    { item: 'Strong founding team', status: startup.members.length >= 2 ? 'MET' : 'PARTIAL' },
    { item: 'MVP ready', status: startup.hasMVP ? 'MET' : 'MISSING' },
    { item: 'Revenue model defined', status: startup.revenueModel ? 'MET' : 'MISSING' },
    { item: 'Active sprints', status: startup.sprints.length > 0 ? 'MET' : 'MISSING' },
    { item: 'Mentor reviews', status: startup.reviews.length > 0 ? 'MET' : 'PARTIAL' },
    { item: 'Metrics tracked', status: startup.metricsLogs.length > 0 ? 'MET' : 'MISSING' },
  ];

  const met = checklist.filter((c) => c.status === 'MET').length;
  const pct = Math.round((met / checklist.length) * 100);

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h1 className="font-display text-3xl font-bold">Investor Readiness</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-6">
          <div className="text-xs uppercase text-muted-foreground">{startup.name}</div>
          <div className="font-display text-4xl font-bold mt-2">
            {startup.investorReady?.replace('_', ' ') || 'Analyzing...'}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={pct} className="flex-1" />
            <span className="text-sm font-medium">{met}/{checklist.length}</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Checklist</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {checklist.map((c) => (
            <div key={c.item} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                {c.status === 'MET' ? <Check className="w-4 h-4 text-emerald-500" /> :
                 c.status === 'PARTIAL' ? <AlertCircle className="w-4 h-4 text-amber-500" /> :
                 <X className="w-4 h-4 text-rose-500" />}
                <span className="text-sm">{c.item}</span>
              </div>
              <Badge variant={c.status === 'MET' ? 'success' : c.status === 'PARTIAL' ? 'warning' : 'destructive'}>
                {c.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
