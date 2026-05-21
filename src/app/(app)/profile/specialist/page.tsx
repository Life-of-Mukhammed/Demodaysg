'use client';

import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, FileText, Loader2, Sparkles, X, Plus, Check } from 'lucide-react';
import { scoreColor } from '@/lib/utils';

const ROLES = ['CTO', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'PRODUCT_MANAGER', 'AI_ENGINEER', 'FINANCE', 'OPERATIONS', 'BIZDEV'];
const SECTORS = ['FINTECH', 'EDTECH', 'HEALTHTECH', 'AI', 'WEB3', 'SAAS', 'ECOMMERCE', 'MARKETPLACE', 'GAMING', 'DEEPTECH'];
const LEVELS = ['JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'];

export default function SpecialistProfilePage() {
  const [form, setForm] = useState({
    bio: '',
    location: '',
    englishLevel: 'B2',
    experienceYears: 0,
    primaryRoles: [] as string[],
    skills: [] as string[],
    sectors: [] as string[],
    level: 'MIDDLE',
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
    available: true,
  });
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile/specialist').then((r) => r.json()).then((data) => {
      if (data?.id) {
        setForm({
          bio: data.bio || '',
          location: data.location || '',
          englishLevel: data.englishLevel || 'B2',
          experienceYears: data.experienceYears || 0,
          primaryRoles: data.primaryRoles || [],
          skills: data.skills || [],
          sectors: data.sectors || [],
          level: data.level || 'MIDDLE',
          linkedin: data.linkedin || '',
          github: data.github || '',
          portfolio: data.portfolio || '',
          twitter: data.twitter || '',
          available: data.available ?? true,
        });
        setScore(data.aiScore);
        setAiSummary(data.aiSummary || '');
        setResumeText(data.resumeText || '');
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    onDrop: async (files) => {
      const f = files[0];
      if (!f) return;
      setResumeFile(f);
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch('/api/profile/resume', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok) {
        setResumeText(json.text || '');
        toast.success('Rezyume yuklandi va matni o\'qildi');
      } else {
        toast.error(json.error || 'Yuklash xatosi');
      }
    },
  });

  const toggleArr = (key: 'primaryRoles' | 'sectors', v: string) => {
    setForm((s) => ({
      ...s,
      [key]: s[key].includes(v) ? s[key].filter((x) => x !== v) : [...s[key], v],
    }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setForm((s) => ({ ...s, skills: [...new Set([...s.skills, skillInput.trim()])] }));
    setSkillInput('');
  };

  const removeSkill = (s: string) => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  async function evaluate() {
    setEvaluating(true);
    try {
      const res = await fetch('/api/profile/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, resumeText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setScore(json.score);
      setAiSummary(json.summary);
      toast.success('AI baholash tugadi');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEvaluating(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile/specialist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, resumeText }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Profil saqlandi');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Mutaxassis profili</h1>
        <p className="text-muted-foreground mt-1">Sizning ko'nikmalaringiz va tajribangizni AI tahlil qiladi</p>
      </div>

      {/* AI Score banner */}
      {score !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border-violet-500/30">
            <CardContent className="p-6 flex items-center gap-6">
              <div className={`font-display text-6xl font-bold ${scoreColor(score)}`}>{score}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI Score</span>
                </div>
                <p className="text-sm leading-relaxed">{aiSummary}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resume upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-4 h-4" /> Rezyume</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">
              {resumeFile ? resumeFile.name : 'PDF rezyumeni shu yerga tashlang yoki bosing'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
            {resumeText && (
              <Badge variant="success" className="mt-3">
                <Check className="w-3 h-3 mr-1" /> Matn o'qildi ({resumeText.length} char)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic */}
      <Card>
        <CardHeader><CardTitle>Asoslari</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Joylashuv</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ingliz tili darajasi</Label>
              <Select value={form.englishLevel} onValueChange={(v) => setForm({ ...form, englishLevel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tajriba (yil)</Label>
              <Input type="number" min={0} value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: +e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Daraja</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles & Skills */}
      <Card>
        <CardHeader><CardTitle>Rollar va ko'nikmalar</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="mb-2 block">Rollar (bir nechta tanlash mumkin)</Label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleArr('primaryRoles', r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    form.primaryRoles.includes(r)
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Sektorlar</Label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleArr('sectors', s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    form.sectors.includes(s)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Ko'nikmalar (skill teglari)</Label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="React, Node.js, PostgreSQL..." />
              <Button onClick={addSkill} variant="outline"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">
                  {s}
                  <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader><CardTitle>Linklar</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>LinkedIn</Label><Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
          <div className="space-y-2"><Label>GitHub</Label><Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
          <div className="space-y-2"><Label>Portfolio</Label><Input value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></div>
          <div className="space-y-2"><Label>X / Twitter</Label><Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <Label>Loyihalarga ochiqman</Label>
            <p className="text-xs text-muted-foreground">Founder'lar sizni topa oladi</p>
          </div>
          <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 sticky bottom-4">
        <Button variant="outline" onClick={evaluate} disabled={evaluating}>
          {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> AI baholash</>}
        </Button>
        <Button variant="glow" size="lg" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Saqlash'}
        </Button>
      </div>
    </div>
  );
}
