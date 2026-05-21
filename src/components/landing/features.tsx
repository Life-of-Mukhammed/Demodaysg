'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Brain,
  Heart,
  Zap,
  Trophy,
  Users,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

type Feature = {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  gradient: string;
};

const FEATURES: Feature[] = [
  { icon: Brain, titleKey: 'feature1Title', descKey: 'feature1Desc', gradient: 'from-orange-500 to-amber-500' },
  { icon: Heart, titleKey: 'feature2Title', descKey: 'feature2Desc', gradient: 'from-rose-500 to-orange-500' },
  { icon: Zap, titleKey: 'feature3Title', descKey: 'feature3Desc', gradient: 'from-amber-500 to-yellow-500' },
  { icon: Trophy, titleKey: 'feature4Title', descKey: 'feature4Desc', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Users, titleKey: 'feature5Title', descKey: 'feature5Desc', gradient: 'from-orange-600 to-rose-500' },
  { icon: Sparkles, titleKey: 'feature6Title', descKey: 'feature6Desc', gradient: 'from-amber-600 to-orange-600' },
];

export function Features() {
  const t = useTranslations('landing');

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Features
          </div>
          <h2 className="font-display text-5xl md:text-6xl tracking-tight">
            {t('featuresTitle')}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{t('featuresSubtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Card className="group relative p-7 h-full overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 soft-shadow hover:elevated-shadow">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 soft-shadow group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-2xl mb-3 tracking-tight">{t(f.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
