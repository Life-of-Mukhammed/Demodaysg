'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Upload, Loader2, Sparkles, X, Plus, ChevronRight, Check } from 'lucide-react';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ROLES = ['CTO', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'PRODUCT_MANAGER', 'AI_ENGINEER', 'FINANCE', 'OPERATIONS', 'BIZDEV'];
const LEVELS = ['JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'];

export function ProgrammerApplyButton({ hasProfile }: { hasProfile: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-violet-500/8 via-fuchsia-500/8 to-pink-500/8 border border-violet-500/20 hover:border-violet-500/40 hover:from-violet-500/12 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-violet-600" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-sm">
              {hasProfile ? 'Nomzodingizni yangilang' : "Dasturchi sifatida o'z nomzodingizni qo'shing"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">Profilingizni to&apos;ldiring va startuplarga qo&apos;shiling</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
          Boshlash <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      <ApplyModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ApplyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    experienceYears: 0,
    level: 'MIDDLE',
    primaryRoles: [] as string[],
    skills: [] as string[],
    linkedin: '',
    github: '',
    portfolio: '',
    available: true,
    avatarUrl: '',
  });

  const toggleRole = (r: string) => setForm((s) => ({
    ...s,
    primaryRoles: s.primaryRoles.includes(r) ? s.primaryRoles.filter((x) => x !== r) : [...s.primaryRoles, r],
  }));

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setForm((s) => ({ ...s, skills: [...new Set([...s.skills, skillInput.trim()])] }));
    setSkillInput('');
  };

  const handleAvatar = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setAvatarUploading(true);
    try {
      const storageInstance = storage();
      if (storageInstance) {
        const avatarRef = ref(storageInstance, `avatars/${Date.now()}-${file.name}`);
        await uploadBytes(avatarRef, file);
        const url = await getDownloadURL(avatarRef);
        setForm((s) => ({ ...s, avatarUrl: url }));
      }
    } catch {
      toast.error('Rasm yuklashda xato');
    } finally {
      setAvatarUploading(false);
    }
  };

  async function submit() {
    if (!form.displayName.trim()) { toast.error("Ism kiritish shart"); return; }
    if (form.primaryRoles.length === 0) { toast.error("Kamida 1 ta rol tanlang"); return; }

    setSaving(true);
    try {
      // Update display name
      if (form.displayName) {
        await fetch('/api/profile/name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName: form.displayName, avatarUrl: form.avatarUrl }),
        });
      }

      // Save specialist profile
      const res = await fetch('/api/profile/specialist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: form.bio,
          location: form.location,
          experienceYears: form.experienceYears,
          level: form.level,
          primaryRoles: form.primaryRoles,
          skills: form.skills,
          sectors: [],
          linkedin: form.linkedin,
          github: form.github,
          portfolio: form.portfolio,
          available: form.available,
          englishLevel: 'B1',
          resumeText: '',
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Xato');
      toast.success("Nomzodingiz qo'shildi! Dasturchilar ro'yxatida ko'rinadi.");
      onClose();
      window.location.reload();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  const steps = [
    {
      title: 'Rasm va ism',
      content: (
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full border-4 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-violet-500/50 transition overflow-hidden relative bg-accent/20"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : avatarUploading ? (
                <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={avatarUploading} type="button">
              {avatarUploading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
              {avatarUploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatar(f); }} />
          </div>

          <div className="space-y-2">
            <Label>Ism Familiya *</Label>
            <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Ali Valiyev" />
          </div>
          <div className="space-y-2">
            <Label>Haqida (bio)</Label>
            <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Men fullstack developer, 3 yillik tajribam bor..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Joylashuv</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Toshkent, UZ" />
            </div>
            <div className="space-y-2">
              <Label>Tajriba (yil)</Label>
              <Input type="number" min={0} value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: +e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Daraja</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      ),
      canNext: () => form.displayName.trim().length > 0,
    },
    {
      title: 'Rol va ko\'nikmalar',
      content: (
        <div className="space-y-5">
          <div>
            <Label className="mb-3 block">Rollar * (bir nechta tanlash mumkin)</Label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRole(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    form.primaryRoles.includes(r)
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {form.primaryRoles.includes(r) && <Check className="w-3 h-3 inline mr-1" />}
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Ko&apos;nikmalar</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="React, Node.js, Python..."
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">
                  {s}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }))}><X className="w-3 h-3" /></button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
      canNext: () => form.primaryRoles.length > 0,
    },
    {
      title: 'Linklar',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="space-y-2">
            <Label>GitHub</Label>
            <Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div className="space-y-2">
            <Label>Portfolio / vebsayt</Label>
            <Input value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} placeholder="https://mysite.com" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 mt-2">
            <div>
              <Label>Hozir bo&apos;sh / startupga qo&apos;shilishga tayyor</Label>
              <p className="text-xs text-muted-foreground">Founder&apos;lar sizni topa oladi</p>
            </div>
            <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
          </div>
        </div>
      ),
      canNext: () => true,
    },
  ];

  const current = steps[step];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setStep(0); } }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Dasturchi nomzodi — {step + 1}/{steps.length}
          </DialogTitle>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-violet-500' : 'bg-border'}`} />
          ))}
        </div>

        <h3 className="font-display text-lg font-semibold mb-4">{current.title}</h3>

        {current.content}

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Orqaga
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!current.canNext()}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90"
            >
              Keyingi <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={saving}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Nomzodni yuborish</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
