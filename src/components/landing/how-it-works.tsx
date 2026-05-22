'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Lightbulb, Wrench, BarChart3, Rocket } from 'lucide-react';

const STEPS = [
  { icon: Lightbulb, key: 'step1', month: '01–03', title: 'Idea testing' },
  { icon: Wrench, key: 'step2', month: '04–09', title: 'MVP build' },
  { icon: BarChart3, key: 'step3', month: '10–15', title: 'Sales & traction' },
  { icon: Rocket, key: 'step4', month: '16–18', title: 'Investment' },
];

export function HowItWorks() {
  const t = useTranslations('landing');

  return (
    <section id="how" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-sg-purple mb-4">
            / how it works
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-sg-dark leading-[1.05]">
            18 months,<br />
            <span className="font-serif italic font-normal text-sg-purple">from zero to investment.</span>
          </h2>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-sg-dark/10 hidden md:block" />

          {STEPS.map((s, i) => {
            const isRight = i % 2 === 1;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 ${isRight ? 'md:[direction:rtl]' : ''}`}
              >
                <div className="md:[direction:ltr]">
                  <div className="bg-sg-dark/[0.03] border border-sg-dark/10 rounded-3xl p-7 hover:border-sg-purple/30 transition">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-sg-purple flex items-center justify-center">
                        <s.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-sg-purple">
                          Month {s.month}
                        </div>
                        <div className="font-display font-bold text-xl text-sg-dark">
                          {s.title}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-sg-dark/70 leading-relaxed">{t(s.key)}</p>
                  </div>
                </div>

                {/* Center node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-7 w-12 h-12 rounded-full bg-white border-4 border-sg-purple items-center justify-center font-display font-bold text-sg-purple text-sm">
                  {i + 1}
                </div>

                {/* Empty side */}
                <div className="hidden md:block md:[direction:ltr]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
