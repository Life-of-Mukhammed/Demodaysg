'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users, Rocket, Heart, Target, TrendingUp, Activity, GraduationCap, Briefcase,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  AreaChart, Area, PieChart, Pie, Legend,
} from 'recharts';
import { scoreColor, formatScore } from '@/lib/utils';

const SCORE_COLORS: Record<string, string> = {
  'VC Backable': '#10b981',
  'High Potential': '#06b6d4',
  'Promising': '#f59e0b',
  'Average': '#ef4444',
  'Weak': '#71717a',
  'Unrated': '#a1a1aa',
};

const SECTOR_COLORS = ['#ea580c', '#f59e0b', '#84cc16', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#a3e635', '#64748b'];

export function AdminOverview() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics').then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <div className="grid grid-cols-4 gap-4">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-24 rounded-xl animate-shimmer-bg" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Users} label="Users" value={data.totals.users} color="from-orange-500 to-amber-500" />
        <Stat icon={Rocket} label="Startups" value={data.totals.startups} color="from-rose-500 to-orange-500" />
        <Stat icon={Heart} label="Matches" value={data.totals.matches} color="from-amber-500 to-yellow-500" />
        <Stat icon={Target} label="Sprints" value={data.totals.sprints} color="from-emerald-500 to-teal-500" />
        <Stat icon={TrendingUp} label="Investor Ready" value={data.totals.investorReady} color="from-violet-500 to-purple-500" />
        <Stat icon={Briefcase} label="Founders" value={data.totals.founders} color="from-blue-500 to-cyan-500" />
        <Stat icon={Users} label="Specialists" value={data.totals.specialists} color="from-pink-500 to-rose-500" />
        <Stat icon={GraduationCap} label="Mentors" value={data.totals.mentors} color="from-indigo-500 to-purple-500" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base">Signup Growth (30d)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.signups}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ea580c" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltip} />
                <Area type="monotone" dataKey="count" stroke="#ea580c" strokeWidth={2} fill="url(#signupGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base">Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.byScore}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.byScore.map((d: any, i: number) => <Cell key={i} fill={SCORE_COLORS[d.name] || '#ea580c'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base">Startups by Sector</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={data.bySector} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {data.bySector.map((_: any, i: number) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base">Specialists by Role</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.bySpecialistRole} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="value" fill="#ea580c" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Rocket className="w-4 h-4 text-primary" /> Top Startups</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.topStartups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No startups yet</p>
            ) : data.topStartups.map((s: any, i: number) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/40">
                <div className={`w-6 text-center text-sm font-bold ${i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>#{i + 1}</div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center text-sm font-bold">{s.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{s.founder.email}</div>
                </div>
                <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                <div className={`font-bold text-lg ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Top Specialists</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.topSpecialists.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No specialists yet</p>
            ) : data.topSpecialists.map((s: any, i: number) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/40">
                <div className={`w-6 text-center text-sm font-bold ${i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>#{i + 1}</div>
                <Avatar className="w-9 h-9">
                  {s.user.avatarUrl && <AvatarImage src={s.user.avatarUrl} />}
                  <AvatarFallback>{(s.user.displayName || s.user.email)[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.user.displayName || s.user.email}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{s.primaryRoles.slice(0,2).join(', ')}</div>
                </div>
                <div className={`font-bold text-lg ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const chartTooltip = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="relative overflow-hidden soft-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.04]`} />
      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center soft-shadow`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="font-display text-3xl tracking-tight">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
