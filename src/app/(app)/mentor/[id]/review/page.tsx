'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Star, Sparkles } from 'lucide-react';

export default function MentorReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    score: 7,
    progress: '',
    blockers: '',
    teamHealth: 7,
    kpiStatus: '',
    nextSteps: '',
    freeText: '',
  });
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [saving, setSaving] = useState(false);

  async function getBrief() {
    setLoadingBrief(true);
    try {
      const res = await fetch(`/api/mentor/${id}/brief`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAiBrief(json.executive_summary);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoadingBrief(false);
    }
  }

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/mentor/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Review saqlandi');
      router.push('/mentor');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <h1 className="font-display text-3xl font-bold">Weekly review</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> AI Mentor Brief</CardTitle>
          <Button onClick={getBrief} disabled={loadingBrief} variant="outline" size="sm">
            {loadingBrief ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Brief generate'}
          </Button>
        </CardHeader>
        <CardContent>
          {aiBrief ? <p className="text-sm whitespace-pre-line text-muted-foreground">{aiBrief}</p> : <p className="text-xs text-muted-foreground">AI startup haqida brief tayyorlaydi</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Baholash</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-500" /> Umumiy ball (1-10)</Label>
            <Input type="number" min={1} max={10} value={form.score} onChange={(e) => setForm({ ...form, score: +e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">Jamoa salomatligi (1-10)</Label>
            <Input type="number" min={1} max={10} value={form.teamHealth} onChange={(e) => setForm({ ...form, teamHealth: +e.target.value })} />
          </div>
          <div className="space-y-2"><Label>Progress</Label><Textarea value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} rows={3} /></div>
          <div className="space-y-2"><Label>Blokerlar</Label><Textarea value={form.blockers} onChange={(e) => setForm({ ...form, blockers: e.target.value })} rows={3} /></div>
          <div className="space-y-2"><Label>KPI holati</Label><Textarea value={form.kpiStatus} onChange={(e) => setForm({ ...form, kpiStatus: e.target.value })} rows={2} /></div>
          <div className="space-y-2"><Label>Keyingi qadamlar</Label><Textarea value={form.nextSteps} onChange={(e) => setForm({ ...form, nextSteps: e.target.value })} rows={2} /></div>
          <div className="space-y-2"><Label>Qo'shimcha izoh</Label><Textarea value={form.freeText} onChange={(e) => setForm({ ...form, freeText: e.target.value })} rows={3} /></div>
        </CardContent>
      </Card>

      <Button onClick={submit} disabled={saving} variant="glow" size="lg" className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Saqlash'}
      </Button>
    </div>
  );
}
