'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  UserPlus, Upload, Loader2, Sparkles, X, Plus, ChevronRight, Check,
  Code2, Layout, Server, Smartphone, Cpu, Palette, Package,
} from 'lucide-react';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ROLES = ['CTO', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'PRODUCT_MANAGER', 'AI_ENGINEER', 'FINANCE', 'OPERATIONS', 'BIZDEV'];
const LEVELS = ['JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'];

const DEV_TYPES = [
  { label: 'Frontend', desc: 'React, Vue, Angular...', icon: Layout, primaryRole: 'DEVELOPER' },
  { label: 'Backend', desc: 'Node.js, Python, Go...', icon: Server, primaryRole: 'DEVELOPER' },
  { label: 'Fullstack', desc: 'Frontend + Backend', icon: Code2, primaryRole: 'DEVELOPER' },
  { label: 'Mobile', desc: 'iOS, Android, Flutter...', icon: Smartphone, primaryRole: 'DEVELOPER' },
  { label: 'AI/ML', desc: 'Machine Learning, LLM...', icon: Cpu, primaryRole: 'AI_ENGINEER' },
  { label: 'Designer', desc: 'UI/UX, Figma...', icon: Palette, primaryRole: 'DESIGNER' },
  { label: 'Product Manager', desc: 'Product, Roadmap...', icon: Package, primaryRole: 'PRODUCT_MANAGER' },
];

type WorkExp = { company: string; position: string; duration: string; projects: string[] };

function emptyExp(): WorkExp {
  return { company: '', position: '', duration: '', projects: [''] };
}

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
    developerType: '',
    displayName: '',
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
    workExperience: [emptyExp()] as WorkExp[],
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

  const selectDevType = (dt: typeof DEV_TYPES[0]) => {
    setForm((s) => ({
      ...s,
      developerType: dt.label,
      primaryRoles: s.primaryRoles.includes(dt.primaryRole) ? s.primaryRoles : [dt.primaryRole, ...s.primaryRoles],
    }));
  };

  /* Work experience helpers */
  const addExp = () => setForm((s) => ({ ...s, workExperience: [...s.workExperience, emptyExp()] }));
  const removeExp = (i: number) => setForm((s) => ({ ...s, workExperience: s.workExperience.filter((_, idx) => idx !== i) }));
  const updateExp = (i: number, field: keyof WorkExp, value: any) =>
    setForm((s) => {
      const we = [...s.workExperience];
      (we[i] as any)[field] = value;
      return { ...s, workExperience: we };
    });
  const addProject = (i: number) =>
    setForm((s) => {
      const we = [...s.workExperience];
      we[i] = { ...we[i], projects: [...we[i].projects, ''] };
      return { ...s, workExperience: we };
    });
  const removeProject = (ei: number, pi: number) =>
    setForm((s) => {
      const we = [...s.workExperience];
      we[ei] = { ...we[ei], projects: we[ei].projects.filter((_, idx) => idx !== pi) };
      return { ...s, workExperience: we };
    });
  const updateProject = (ei: number, pi: number, value: string) =>
    setForm((s) => {
      const we = [...s.workExperience];
      we[ei].projects[pi] = value;
      return { ...s, workExperience: we };
    });

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
      if (form.displayName) {
        await fetch('/api/profile/name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName: form.displayName, avatarUrl: form.avatarUrl }),
        });
      }

      const res = await fetch('/api/profile/specialist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerType: form.developerType,
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
          workExperience: form.workExperience,
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
    /* Step 0 – Developer type */
    {
      title: "Qaysi turdagi mutaxassiss?",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {DEV_TYPES.map((dt) => {
            const Icon = dt.icon;
            const selected = form.developerType === dt.label;
            return (
              <button
                key={dt.label}
                type="button"
                onClick={() => selectDevType(dt)}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  selected
                    ? 'border-violet-500 bg-violet-500/8'
                    : 'border-border hover:border-violet-300 hover:bg-accent/40'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selected ? 'bg-violet-500 text-white' : 'bg-accent'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{dt.label}</div>
                  <div className="text-[11px] text-muted-foreground">{dt.desc}</div>
                </div>
                {selected && <Check className="w-4 h-4 text-violet-500 ml-auto" />}
              </button>
            );
          })}
        </div>
      ),
      canNext: () => form.developerType.length > 0,
    },

    /* Step 1 – Name, photo, work experience */
    {
      title: 'Rasm, ism va tajriba',
      content: (
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full border-4 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-violet-500/50 transition overflow-hidden relative bg-accent/20"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover rounded-full" />
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

          {/* Work Experience */}
          <div>
            <Label className="mb-3 block">Ish tajribasi</Label>
            <div className="space-y-4">
              {form.workExperience.map((exp, ei) => (
                <div key={ei} className="relative border border-border/50 rounded-xl p-4 shadow-sm space-y-3">
                  {ei > 0 && (
                    <button
                      type="button"
                      onClick={() => removeExp(ei)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition"
                    >
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs">Kompaniya nomi</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExp(ei, 'company', e.target.value)}
                      placeholder="Masalan: Startup Garage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Lavozim</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExp(ei, 'position', e.target.value)}
                      placeholder="Masalan: Fullstack Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Muddat</Label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => updateExp(ei, 'duration', e.target.value)}
                      placeholder="Masalan: Yan 2024 – Hozir"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Qilgan ishlar / Loyihalar</Label>
                    {exp.projects.map((proj, pi) => (
                      <div key={pi} className="flex gap-2 items-center">
                        <Input
                          value={proj}
                          onChange={(e) => updateProject(ei, pi, e.target.value)}
                          placeholder="Masalan: Admin panel yaratdim"
                        />
                        <button
                          type="button"
                          onClick={() => addProject(ei)}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-600 transition shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        {pi > 0 && (
                          <button
                            type="button"
                            onClick={() => removeProject(ei, pi)}
                            className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center text-destructive transition shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addExp}
              className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-border/60 hover:border-violet-400/60 text-sm text-muted-foreground hover:text-violet-600 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ish joyi qo&apos;shish
            </button>
          </div>
        </div>
      ),
      canNext: () => form.displayName.trim().length > 0,
    },

    /* Step 2 – Roles & Skills */
    {
      title: "Rol va ko'nikmalar",
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

    /* Step 3 – Links */
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
