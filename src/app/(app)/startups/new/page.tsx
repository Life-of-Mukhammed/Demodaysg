'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Loader2, Sparkles, Rocket, Upload, X } from 'lucide-react';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

const STAGES = ['IDEA', 'MVP', 'EARLY_TRACTION', 'REVENUE', 'SCALING'];
const SECTORS = ['FINTECH', 'EDTECH', 'HEALTHTECH', 'AI', 'WEB3', 'SAAS', 'ECOMMERCE', 'MARKETPLACE', 'GAMING', 'DEEPTECH', 'OTHER'];

type Form = {
  name: string;
  pitch: string;
  problem: string;
  solution: string;
  targetAudience: string;
  revenueModel: string;
  competitors: string;
  teamSize: number;
  stage: string;
  sectors: string[];
  location: string;
  equityOffered: string;
  fundraising: string;
  cofounderNeeded: string[];
  logoUrl: string;
};

const initial: Form = {
  name: '',
  pitch: '',
  problem: '',
  solution: '',
  targetAudience: '',
  revenueModel: '',
  competitors: '',
  teamSize: 1,
  stage: 'IDEA',
  sectors: [],
  location: '',
  equityOffered: '',
  fundraising: '',
  cofounderNeeded: [],
  logoUrl: '',
};

export default function NewStartupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((s) => ({ ...s, [k]: v }));

  const toggleSector = (s: string) => {
    setForm((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(s)
        ? prev.sectors.filter((x) => x !== s)
        : [...prev.sectors, s],
    }));
  };

  const handleLogoFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setLogoUploading(true);
    try {
      const storageInstance = storage();
      if (storageInstance) {
        const logoRef = ref(storageInstance, `startup-logos/${Date.now()}-${file.name}`);
        await uploadBytes(logoRef, file);
        const url = await getDownloadURL(logoRef);
        update('logoUrl', url);
      }
    } catch {
      toast.error('Logo yuklashda xato');
    } finally {
      setLogoUploading(false);
    }
  };

  const steps = [
    {
      title: 'Asoslari',
      subtitle: "Startup haqida asosiy ma'lumot",
      content: (
        <>
          {/* Logo upload */}
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-primary/50 transition overflow-hidden bg-accent/20 relative"
              onClick={() => logoInputRef.current?.click()}
            >
              {logoPreview ? (
                <Image src={logoPreview} alt="logo" fill className="object-cover rounded-2xl" />
              ) : logoUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <Label className="mb-1 block">Logo</Label>
              <Button variant="outline" size="sm" type="button" onClick={() => logoInputRef.current?.click()} disabled={logoUploading}>
                {logoUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                {logoUploading ? 'Yuklanmoqda...' : 'Logo yuklash'}
              </Button>
              {form.logoUrl && (
                <button
                  type="button"
                  className="ml-2 text-xs text-rose-500 hover:underline"
                  onClick={() => { update('logoUrl', ''); setLogoPreview(''); }}
                >
                  <X className="w-3 h-3 inline" /> Olib tashlash
                </button>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG · Max 2MB</p>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoFile(file);
              }}
            />
          </div>

          <Field label="Startup nomi" required>
            <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ajoyib Startup" />
          </Field>
          <Field label="Qisqacha pitch" hint="1-2 jumlada">
            <Textarea value={form.pitch} onChange={(e) => update('pitch', e.target.value)} rows={2} placeholder="Biz X uchun Y qilamiz, chunki Z" />
          </Field>
          <Field label="Soha">
            <div className="flex flex-wrap gap-2 mt-1">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSector(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    form.sectors.includes(s)
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Joylashuv">
            <Input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Tashkent, UZ" />
          </Field>
        </>
      ),
    },
    {
      title: 'Muammo va yechim',
      subtitle: 'Qanday muammoni qanday hal qilasiz?',
      content: (
        <>
          <Field label="Muammo">
            <Textarea value={form.problem} onChange={(e) => update('problem', e.target.value)} rows={3} placeholder="Foydalanuvchilar bunday muammoga duch keladi..." />
          </Field>
          <Field label="Yechim">
            <Textarea value={form.solution} onChange={(e) => update('solution', e.target.value)} rows={3} placeholder="Bizning yechim..." />
          </Field>
          <Field label="Maqsadli auditoriya">
            <Textarea value={form.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} rows={2} placeholder="25-40 yoshli professionallar..." />
          </Field>
        </>
      ),
    },
    {
      title: 'Biznes modeli',
      subtitle: 'Qanday daromad olasiz?',
      content: (
        <>
          <Field label="Daromad modeli">
            <Textarea value={form.revenueModel} onChange={(e) => update('revenueModel', e.target.value)} rows={2} placeholder="Subscription, marketplace fee, ..." />
          </Field>
          <Field label="Asosiy raqobatchilar" hint="ixtiyoriy">
            <Textarea value={form.competitors} onChange={(e) => update('competitors', e.target.value)} rows={2} placeholder="X, Y, Z kompaniyalari" />
          </Field>
          <Field label="Moliyalashtirish holati">
            <Input value={form.fundraising} onChange={(e) => update('fundraising', e.target.value)} placeholder="Bootstrap, Seed olingan, Looking for $500k..." />
          </Field>
        </>
      ),
    },
    {
      title: 'Jamoa va bosqich',
      subtitle: 'Hozirgi holat',
      content: (
        <>
          <Field label="Bosqich">
            <Select value={form.stage} onValueChange={(v) => update('stage', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Jamoa hajmi">
            <Input type="number" min={1} value={form.teamSize} onChange={(e) => update('teamSize', +e.target.value)} />
          </Field>
          <div className="p-4 rounded-lg bg-accent/30 border border-border/40">
            <p className="text-sm font-medium">💡 Dasturchi kerakmi?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Startup yaratilgandan keyin startup sahifasida <strong>"Vakansiya joylash"</strong> tugmasi orqali kerakli dasturchilarni qidiring.
            </p>
          </div>
        </>
      ),
    },
  ];

  const canNext = () => {
    if (step === 0) return form.name && form.pitch;
    if (step === 1) return form.problem && form.solution && form.targetAudience;
    if (step === 2) return form.revenueModel;
    return true;
  };

  async function onSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sector: form.sectors[0] || 'OTHER',
          equityOffered: form.equityOffered ? parseFloat(form.equityOffered) : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Startup yaratildi! AI baholashga jo'natildi.");
      router.push(`/startups/${json.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Rocket className="w-4 h-4 text-primary" />
          Yangi startup yaratish
        </div>
        <Progress value={((step + 1) / steps.length) * 100} className="h-1.5" />
        <div className="mt-1 text-xs text-muted-foreground">{step + 1} / {steps.length}</div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl font-bold mb-1">{steps[step].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[step].subtitle}</p>
              <div className="space-y-5">{steps[step].content}</div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4" /> Orqaga
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Keyingi <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={onSubmit} disabled={submitting} variant="glow">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Yaratish va AI baholash</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {label}
        {required && <span className="text-rose-500">*</span>}
        {hint && <span className="text-xs font-normal text-muted-foreground">({hint})</span>}
      </Label>
      {children}
    </div>
  );
}
