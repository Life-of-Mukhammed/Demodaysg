'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Loader2, Target } from 'lucide-react';

export function CreateSprintButton({ startupId, startupName }: { startupId: string; startupName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    goal: '',
    duration: '7', // days
  });

  async function submit() {
    if (!form.name.trim() || !form.goal.trim()) {
      toast.error("Sprint nomi va maqsadi to'ldirilishi kerak");
      return;
    }
    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date(Date.now() + +form.duration * 24 * 60 * 60 * 1000);
      const res = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId,
          name: form.name.trim(),
          goal: form.goal.trim(),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      toast.success("Sprint yaratildi! Workspace ochildi.");
      setOpen(false);
      setForm({ name: '', goal: '', duration: '7' });
      router.refresh();
    } catch (e: any) {
      console.error('Sprint create failed:', e);
      toast.error(e.message || "Sprint yaratilmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="glow" size="xl" className="rounded-full">
        <Plus className="w-5 h-5" /> Birinchi sprintni yaratish
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-tight">
              {startupName} uchun yangi sprint
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sprint nomi *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: Sprint 1 — MVP ishga tushirish"
              />
            </div>
            <div className="space-y-2">
              <Label>Maqsad / Goal *</Label>
              <Textarea
                rows={3}
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                placeholder="Bu sprint oxiriga nimaga erishishni xohlaysiz? Masalan: 100 ta foydalanuvchi olish, auth tizimini yopish..."
              />
            </div>
            <div className="space-y-2">
              <Label>Davomiyligi (kun)</Label>
              <div className="flex gap-2">
                {['7', '14', '21', '30'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, duration: d })}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      form.duration === d
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {d} kun
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={submit} disabled={loading || !form.name || !form.goal} variant="brand" className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Target className="w-4 h-4" /> Sprintni boshlash</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
