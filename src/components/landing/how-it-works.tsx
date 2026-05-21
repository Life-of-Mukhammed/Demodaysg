'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { UserPlus, Brain, Heart, Rocket } from 'lucide-react';

const STEPS = [
  { icon: UserPlus, key: 'step1', color: 'from-amber-500 to-orange-500' },
  { icon: Brain, key: 'step2', color: 'from-orange-500 to-rose-500' },
  { icon: Heart, key: 'step3', color: 'from-rose-500 to-orange-600' },
  { icon: Rocket, key: 'step4', color: 'from-emerald-500 to-teal-500' },
];

export function HowItWorks() {
  const t = useTranslations('landing');

  return (
    <section id="how" className="py-32 relative bg-secondary/30">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Workflow
          </div>
          <h2 className="font-display text-5xl md:text-6xl tracking-tight">{t('stepsTitle')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} blur-xl opacity-40`} />
                  <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-2xl`}>
                    <s.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                </div>
              </div>
              <p className="text-base text-foreground/90 max-w-xs mx-auto">{t(s.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
