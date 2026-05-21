'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Users, Loader2, Check } from 'lucide-react';

type Role = 'FOUNDER' | 'SPECIALIST';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function onContinue() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selected }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Welcome!');
      if (selected === 'FOUNDER') router.push('/startups/new');
      else router.push('/profile/specialist');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const ROLES: { id: Role; icon: any; titleKey: string; descKey: string; gradient: string }[] = [
    { id: 'FOUNDER', icon: Rocket, titleKey: 'founder', descKey: 'founderDesc', gradient: 'from-amber-500 to-orange-500' },
    { id: 'SPECIALIST', icon: Users, titleKey: 'specialist', descKey: 'specialistDesc', gradient: 'from-orange-500 to-rose-500' },
  ];

  return (
    <div className="w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{t('title')}</h1>
        <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
          >
            <button
              onClick={() => setSelected(r.id)}
              className="w-full text-left"
            >
              <Card
                className={`relative p-6 h-full overflow-hidden transition-all cursor-pointer ${
                  selected === r.id
                    ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
                    : 'hover:border-primary/50 hover:-translate-y-1'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 ${selected === r.id ? 'opacity-10' : ''} transition`} />
                {selected === r.id && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <r.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{t(r.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(r.descKey)}</p>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <Button
          size="xl"
          variant="glow"
          onClick={onContinue}
          disabled={!selected || loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
        </Button>
      </motion.div>
    </div>
  );
}
