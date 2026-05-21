'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const COLORS: Record<string, string> = {
  VC_BACKABLE: '#10b981',
  HIGH_POTENTIAL: '#06b6d4',
  PROMISING: '#8b5cf6',
  AVERAGE: '#f59e0b',
  WEAK: '#f43f5e',
  UNRATED: '#64748b',
};

export function AdminCharts({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={COLORS[d.name] || '#8b5cf6'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
