'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '4,600', suffix: '+', label: 'Community members' },
  { value: '$2.9', suffix: 'M+', label: 'Investment raised by portfolio' },
  { value: '317', suffix: '', label: 'Active residents' },
  { value: '20', suffix: '+', label: 'Startups launched' },
];

export function Achievements() {
  return (
    <section id="about" className="py-24 md:py-32 bg-sg-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-sg-purple/20 blur-[140px]" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-sg-purple mb-4">
              / by the numbers
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              We don&apos;t just<br />
              <span className="font-serif italic font-normal text-sg-purple">talk about</span><br />
              founders.<br />
              We build them.
            </h2>
            <p className="mt-8 text-base text-white/60 leading-relaxed max-w-md">
              The largest startup community in Central Asia — free, open, and built for the most ambitious founders.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-l-2 border-sg-purple pl-5"
              >
                <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight">
                  {s.value}
                  <span className="text-sg-purple">{s.suffix}</span>
                </div>
                <div className="mt-3 text-sm text-white/60 uppercase tracking-wider">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
