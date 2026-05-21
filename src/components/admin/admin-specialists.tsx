'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Crown, Github, Linkedin, Globe } from 'lucide-react';
import { scoreColor } from '@/lib/utils';

const ROLES = ['ALL', 'CTO', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'PRODUCT_MANAGER', 'AI_ENGINEER', 'FINANCE', 'OPERATIONS', 'BIZDEV'];
const SECTORS = ['ALL', 'FINTECH', 'EDTECH', 'HEALTHTECH', 'AI', 'WEB3', 'SAAS', 'ECOMMERCE', 'MARKETPLACE', 'GAMING', 'DEEPTECH'];
const SORTS = [
  { id: 'score', label: 'AI Score (top)' },
  { id: 'xp', label: 'XP (top)' },
  { id: 'recent', label: 'Yangi qo\'shilganlar' },
];

export function AdminSpecialists() {
  const [items, setItems] = useState<any[]>([]);
  const [role, setRole] = useState('ALL');
  const [sector, setSector] = useState('ALL');
  const [sort, setSort] = useState('score');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (role !== 'ALL') params.set('role', role);
    if (sector !== 'ALL') params.set('sector', sector);
    params.set('sort', sort);
    const res = await fetch(`/api/admin/specialists?${params}`);
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [role, sector, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Soha" /></SelectTrigger>
          <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r === 'ALL' ? 'Barcha sohalar' : r.replace('_', ' ')}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Sektor" /></SelectTrigger>
          <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s === 'ALL' ? 'Barcha sektorlar' : s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>{SORTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
        <div className="ml-auto text-sm text-muted-foreground self-center">
          {items.length} mutaxassis
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 rounded-xl animate-shimmer-bg" />)}
        </div>
      ) : items.length === 0 ? (
        <Card className="soft-shadow"><CardContent className="p-12 text-center text-sm text-muted-foreground">Mutaxassis topilmadi</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((s, i) => (
            <Card key={s.id} className="soft-shadow hover:elevated-shadow transition group relative overflow-hidden">
              {i < 3 && sort === 'score' && (
                <div className="absolute top-3 right-3">
                  <Crown className={`w-5 h-5 ${i === 0 ? 'text-amber-500 fill-amber-400' : i === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    {s.user.avatarUrl && <AvatarImage src={s.user.avatarUrl} />}
                    <AvatarFallback>{(s.user.displayName || s.user.email)[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{s.user.displayName || s.user.email.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.user.email}</div>
                    {s.location && <div className="text-[10px] text-muted-foreground mt-0.5">📍 {s.location}</div>}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    {s.aiScore != null ? (
                      <div className="flex items-baseline gap-2">
                        <div className={`font-display text-3xl ${scoreColor(s.aiScore)}`}>{s.aiScore}</div>
                        <div className="text-[10px] text-muted-foreground">AI</div>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Not evaluated</Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px]">{s.level}</Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {s.primaryRoles?.slice(0, 3).map((r: string) => (
                    <Badge key={r} variant="gradient" className="text-[10px]">{r.replace('_', ' ')}</Badge>
                  ))}
                </div>

                {s.skills && s.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.skills.slice(0, 5).map((sk: string) => (
                      <Badge key={sk} variant="secondary" className="text-[10px]">{sk}</Badge>
                    ))}
                    {s.skills.length > 5 && <Badge variant="outline" className="text-[10px]">+{s.skills.length - 5}</Badge>}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                  <div>L{s.user.level} · {s.user.xp} XP · {s.experienceYears}y exp</div>
                  <div className="flex gap-1.5">
                    {s.linkedin && <a href={s.linkedin} target="_blank" className="hover:text-primary"><Linkedin className="w-3.5 h-3.5" /></a>}
                    {s.github && <a href={s.github} target="_blank" className="hover:text-primary"><Github className="w-3.5 h-3.5" /></a>}
                    {s.portfolio && <a href={s.portfolio} target="_blank" className="hover:text-primary"><Globe className="w-3.5 h-3.5" /></a>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
