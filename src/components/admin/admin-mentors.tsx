'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { GraduationCap, UserPlus, Plus, X, Loader2, Linkedin } from 'lucide-react';

const SECTORS = ['FINTECH', 'EDTECH', 'HEALTHTECH', 'AI', 'WEB3', 'SAAS', 'ECOMMERCE', 'MARKETPLACE', 'GAMING', 'DEEPTECH'];

export function AdminMentors() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/mentors');
    setMentors(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden soft-shadow">
        <div className="bg-gradient-to-br from-emerald-500/8 via-teal-500/8 to-cyan-500/8 px-6 py-5 border-b border-border/40">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Mentors</span>
              </div>
              <div className="font-display text-3xl tracking-tight">{mentors.length} mentor</div>
              <p className="text-sm text-muted-foreground mt-1">Mentor'lar startup'larni baholaydi va sprint task'larini yozadi</p>
            </div>
            <Button variant="brand" onClick={() => setOpen(true)}><UserPlus className="w-4 h-4" /> Mentor taklif qilish</Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-xl animate-shimmer-bg" />)}
        </div>
      ) : mentors.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-16 text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl tracking-tight">Hali mentor yo'q</h3>
            <p className="text-sm text-muted-foreground mt-2">Birinchi mentorni taklif qiling</p>
            <Button onClick={() => setOpen(true)} className="mt-6 rounded-full">Mentor taklif qilish</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mentors.map((m) => (
            <Card key={m.id} className="soft-shadow group hover:elevated-shadow transition">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    {m.user.avatarUrl && <AvatarImage src={m.user.avatarUrl} />}
                    <AvatarFallback>{(m.user.displayName || m.user.email)[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{m.user.displayName || m.user.email.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.user.email}</div>
                  </div>
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" className="text-muted-foreground hover:text-primary">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {m.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.bio}</p>}

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="success" className="text-[10px]"><GraduationCap className="w-3 h-3" /> {m.yearsExperience}y</Badge>
                </div>

                {m.expertise?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {m.expertise.slice(0, 4).map((e: string) => (
                      <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                    ))}
                  </div>
                )}

                {m.sectors?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {m.sectors.slice(0, 3).map((s: string) => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <InviteMentorDialog open={open} onClose={() => { setOpen(false); load(); }} />
    </div>
  );
}

function InviteMentorDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    email: '', displayName: '', bio: '', yearsExperience: 0, linkedin: '',
    expertise: [] as string[], sectors: [] as string[],
  });
  const [expInput, setExpInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSector = (s: string) =>
    setForm((f) => ({ ...f, sectors: f.sectors.includes(s) ? f.sectors.filter(x => x !== s) : [...f.sectors, s] }));

  const addExpertise = () => {
    if (!expInput.trim()) return;
    setForm((f) => ({ ...f, expertise: [...new Set([...f.expertise, expInput.trim()])] }));
    setExpInput('');
  };

  const removeExpertise = (e: string) =>
    setForm((f) => ({ ...f, expertise: f.expertise.filter(x => x !== e) }));

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/mentors', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Mentor taklif qilindi!');
      setForm({ email: '', displayName: '', bio: '', yearsExperience: 0, linkedin: '', expertise: [], sectors: [] });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Mentor taklif qilish</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Mavjud foydalanuvchini mentorga ko'tarish yoki yangi mentor profilini oldindan tayyorlash.
          </p>

          <div className="space-y-2">
            <Label>Email <span className="text-rose-500">*</span></Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Ism</Label>
            <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Qisqacha bio</Label>
            <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Eski Y Combinator alumni, 15 yil startup tajriba..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tajriba yili</Label>
              <Input type="number" min={0} value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: +e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ekspertiza sohalari</Label>
            <div className="flex gap-2">
              <Input value={expInput} onChange={(e) => setExpInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())} placeholder="Product, Growth, Fundraising..." />
              <Button onClick={addExpertise} variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {form.expertise.map((e) => (
                <Badge key={e} variant="secondary" className="gap-1">{e}<button onClick={() => removeExpertise(e)}><X className="w-3 h-3" /></button></Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sektorlar</Label>
            <div className="flex flex-wrap gap-1.5">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSector(s)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition ${
                    form.sectors.includes(s)
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={submit} disabled={loading || !form.email} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mentor taklif qilish'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
