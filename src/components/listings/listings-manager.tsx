'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, Trash2, Briefcase, MapPin, Loader2 } from 'lucide-react';

const TYPES = ['FULL_TIME', 'CONTRACT', 'COFOUNDER', 'ADVISOR'];
const ROLES = ['CTO', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'PRODUCT_MANAGER', 'AI_ENGINEER', 'FINANCE', 'OPERATIONS', 'BIZDEV'];
const LEVELS = ['JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'];

export function ListingsManager({ startupId }: { startupId: string }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/listings?startupId=${startupId}`);
    setListings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [startupId]);

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    load();
  }

  async function deleteOne(id: string) {
    if (!confirm('Vakansiyani o\'chirish?')) return;
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    toast.success('O\'chirildi');
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl tracking-tight">Vakansiyalar</h3>
          <p className="text-sm text-muted-foreground">Ochiq pozitsiyalar mutaxassislarga ko'rinadi</p>
        </div>
        <Button variant="brand" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" /> Yangi vakansiya
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 rounded-xl animate-shimmer-bg" />)}</div>
      ) : listings.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-display text-xl tracking-tight">Hali vakansiya yo'q</h4>
            <p className="text-sm text-muted-foreground mt-2">Vakansiya qo'shing — mutaxassislar topadi va ariza beradi</p>
            <Button onClick={() => setOpen(true)} className="mt-6 rounded-full">Birinchi vakansiya</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <Card key={l.id} className="soft-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-display text-xl tracking-tight">{l.title}</h4>
                      <Badge variant={l.active ? 'success' : 'secondary'} className="text-[10px]">
                        {l.active ? 'AKTIV' : 'YOPIQ'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="gradient" className="text-[10px]">{l.role.replace('_', ' ')}</Badge>
                      <Badge variant="outline" className="text-[10px]">{l.type.replace('_', ' ')}</Badge>
                      <Badge variant="outline" className="text-[10px]">{l.level}</Badge>
                      {l.equity && <Badge variant="warning" className="text-[10px]">{l.equity}% equity</Badge>}
                      {l.remote && <Badge variant="outline" className="text-[10px]"><MapPin className="w-3 h-3" /> Remote</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{l.description}</p>
                    {l.skills && l.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {l.skills.map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-muted-foreground">
                      📥 {l._count.applications} ariza
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Switch checked={l.active} onCheckedChange={(v) => toggleActive(l.id, v)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-500" onClick={() => deleteOne(l.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateListingDialog open={open} onClose={() => { setOpen(false); load(); }} startupId={startupId} />
    </div>
  );
}

function CreateListingDialog({ open, onClose, startupId }: { open: boolean; onClose: () => void; startupId: string }) {
  const [form, setForm] = useState({
    type: 'CONTRACT', role: 'DEVELOPER', title: '', description: '',
    skills: [] as string[], level: 'MIDDLE', equity: '', remote: true,
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setForm((s) => ({ ...s, skills: [...new Set([...s.skills, skillInput.trim()])] }));
    setSkillInput('');
  };
  const removeSkill = (s: string) => setForm((f) => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  async function submit() {
    if (!form.title || !form.description) { toast.error('Title va description kerak'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, startupId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Vakansiya joylandi!');
      setForm({ type: 'CONTRACT', role: 'DEVELOPER', title: '', description: '', skills: [], level: 'MIDDLE', equity: '', remote: true });
      onClose();
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Yangi vakansiya</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Lavozim nomi *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior React Developer" />
          </div>
          <div className="space-y-2">
            <Label>Daraja</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Turi</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Equity (%) <span className="text-muted-foreground text-xs">— ixtiyoriy</span></Label>
              <Input value={form.equity} onChange={(e) => setForm({ ...form, equity: e.target.value })} placeholder="2.5" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tafsilot *</Label>
            <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Vazifalar, talablar, foydalar..." />
          </div>
          <div className="space-y-2">
            <Label>Kerakli ko'nikmalar</Label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="React, TypeScript, ..." />
              <Button onClick={addSkill} variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {form.skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">{s}<button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button></Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
            <Label>Remote ishlash mumkin</Label>
            <Switch checked={form.remote} onCheckedChange={(v) => setForm({ ...form, remote: v })} />
          </div>
          <Button onClick={submit} disabled={loading || !form.title || !form.description} className="w-full" variant="brand">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vakansiya joylash'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
