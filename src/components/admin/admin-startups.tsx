'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Trash2, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { scoreColor, formatScore } from '@/lib/utils';

const SECTORS = ['ALL', 'FINTECH', 'EDTECH', 'HEALTHTECH', 'AI', 'WEB3', 'SAAS', 'ECOMMERCE', 'MARKETPLACE', 'GAMING', 'DEEPTECH', 'OTHER'];
const STAGES = ['ALL', 'IDEA', 'MVP', 'EARLY_TRACTION', 'REVENUE', 'SCALING'];

export function AdminStartups() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('ALL');
  const [stage, setStage] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (sector !== 'ALL') params.set('sector', sector);
    if (stage !== 'ALL') params.set('stage', stage);
    const res = await fetch(`/api/admin/startups?${params}`);
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [sector, stage]);

  async function deleteOne(id: string) {
    if (!confirm('Startupni o\'chirishni tasdiqlaysizmi? Barcha tasklar, sprintlar va match\'lar ham o\'chadi.')) return;
    const res = await fetch(`/api/admin/startups/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('O\'chirildi'); load(); } else toast.error('Failed');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} placeholder="Startup nomi..." className="pl-9" />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Sektor" /></SelectTrigger>
          <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Bosqich" /></SelectTrigger>
          <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="brand" onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Yangi startup</Button>
      </div>

      <Card className="soft-shadow overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Yuklanmoqda...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Startup topilmadi</div>
          ) : (
            <div className="divide-y divide-border/40">
              {items.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/30 transition">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-lg">{s.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/startups/${s.id}`} className="font-medium truncate hover:text-primary transition">{s.name}</Link>
                      <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{s.sector}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{s.pitch}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">👤 {s.founder.email}</div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                    <span>👥 {s._count.members + 1}</span>
                    <span>📋 {s._count.tasks}</span>
                    <span>🎯 {s._count.sprints}</span>
                  </div>

                  <div className="text-right">
                    <div className={`font-display text-2xl ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
                    <div className="text-[9px] text-muted-foreground">{s.investorReady?.replace('_', ' ')}</div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild><Link href={`/startups/${s.id}`}><ExternalLink className="w-4 h-4" /> Ko'rish</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteOne(s.id)} className="text-rose-500">
                        <Trash2 className="w-4 h-4" /> O'chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateStartupDialog open={createOpen} onClose={() => { setCreateOpen(false); load(); }} />
    </div>
  );
}

function CreateStartupDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    founderId: '', name: '', pitch: '', problem: '', solution: '', targetAudience: '',
    revenueModel: '', stage: 'IDEA', sector: 'OTHER', hasMVP: false, teamSize: 1,
  });

  useEffect(() => {
    if (open) {
      fetch('/api/admin/users?role=FOUNDER').then((r) => r.json()).then(setFounders);
    }
  }, [open]);

  async function submit() {
    if (!form.founderId || !form.name) { toast.error('Founder va nom kerak'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/startups', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Startup yaratildi! AI baholashga jo\'natildi');
      onClose();
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Yangi startup (Founder nomidan)</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Founder</Label>
            <Select value={form.founderId} onValueChange={(v) => setForm({ ...form, founderId: v })}>
              <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
              <SelectContent>
                {founders.map((f) => <SelectItem key={f.id} value={f.id}>{f.displayName || f.email} ({f.email})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Startup nomi</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Qisqacha pitch</Label><Textarea rows={2} value={form.pitch} onChange={(e) => setForm({ ...form, pitch: e.target.value })} /></div>
          <div className="space-y-2"><Label>Muammo</Label><Textarea rows={2} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} /></div>
          <div className="space-y-2"><Label>Yechim</Label><Textarea rows={2} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Sektor</Label>
              <Select value={form.sector} onValueChange={(v) => setForm({ ...form, sector: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECTORS.filter(s => s !== 'ALL').map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bosqich</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAGES.filter(s => s !== 'ALL').map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
            <Label>MVP bormi?</Label>
            <Switch checked={form.hasMVP} onCheckedChange={(v) => setForm({ ...form, hasMVP: v })} />
          </div>
          <Button onClick={submit} disabled={loading || !form.founderId || !form.name} className="w-full">
            {loading ? 'Yaratilmoqda...' : <><Sparkles className="w-4 h-4" /> Yaratish + AI baholash</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
