'use client';

import { motion } from 'framer-motion';

const PORTFOLIO = [
  { name: 'Pulse', amount: '$780K' },
  { name: 'bito', amount: '$200K' },
  { name: 'OYGUL', amount: '$100K' },
  { name: 'Detecting-AI', amount: '$160K' },
  { name: 'AliPos', amount: '$80K' },
  { name: 'Magicstore', amount: '$50K' },
  { name: 'Romchi', amount: '$50K' },
  { name: 'Zingo', amount: '$50K' },
  { name: 'Edu tizim', amount: '$30K' },
  { name: 'TOKCHA', amount: '$20K' },
  { name: 'Inter-AI', amount: '$20K' },
  { name: 'SpaceAgro', amount: '$10K' },
];

export function Portfolio() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-sg-purple mb-4">
              / portfolio
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-sg-dark leading-[1.05]">
              Companies we&apos;ve helped<br />
              <span className="font-serif italic font-normal text-sg-purple">raise capital.</span>
            </h2>
          </div>
          <div className="font-display text-right">
            <div className="text-xs uppercase tracking-widest text-sg-dark/50">Total raised</div>
            <div className="text-5xl md:text-6xl font-bold text-sg-purple leading-none mt-2">
              $2.9M+
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee row 1 */}
      <div className="flex gap-4 animate-marquee whitespace-nowrap mb-4">
        {[...PORTFOLIO, ...PORTFOLIO].map((p, i) => (
          <PortfolioCard key={`r1-${i}`} {...p} />
        ))}
      </div>

      {/* Marquee row 2 — reverse direction */}
      <div className="flex gap-4 whitespace-nowrap" style={{ animation: 'marquee 50s linear infinite reverse' }}>
        {[...PORTFOLIO.slice().reverse(), ...PORTFOLIO.slice().reverse()].map((p, i) => (
          <PortfolioCard key={`r2-${i}`} {...p} variant="dark" />
        ))}
      </div>
    </section>
  );
}

function PortfolioCard({ name, amount, variant }: { name: string; amount: string; variant?: 'dark' }) {
  if (variant === 'dark') {
    return (
      <div className="shrink-0 bg-sg-dark text-white rounded-2xl px-7 py-5 flex items-center gap-5 hover:opacity-90 transition">
        <div className="font-display text-2xl font-bold">{name}</div>
        <div className="text-sg-purple font-bold text-lg">{amount}</div>
      </div>
    );
  }
  return (
    <div className="shrink-0 bg-white border border-sg-dark/10 rounded-2xl px-7 py-5 flex items-center gap-5 hover:border-sg-purple/40 transition">
      <div className="font-display text-2xl font-bold text-sg-dark">{name}</div>
      <div className="text-sg-purple font-bold text-lg">{amount}</div>
    </div>
  );
}
