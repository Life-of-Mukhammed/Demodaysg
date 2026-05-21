'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Play, Star } from 'lucide-react';

export function Hero() {
  const t = useTranslations('landing');

  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-warm-gradient">
      {/* Soft texture */}
      <div className="absolute inset-0 dot-pattern opacity-60" />

      {/* Floating warm orbs */}
      <div className="absolute top-32 left-1/4 w-[420px] h-[420px] rounded-full bg-amber-200/40 blur-[120px] animate-float" />
      <div className="absolute bottom-20 right-1/4 w-[380px] h-[380px] rounded-full bg-orange-200/40 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-white/60 backdrop-blur-sm text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-medium text-foreground/80">AI-Powered Startup OS</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-center text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.95] text-foreground"
        >
          From <em className="text-gradient italic">idea</em>
          <br />
          to <em className="text-gradient-warm italic">investment</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 max-w-2xl mx-auto text-center text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button asChild size="xl" variant="glow" className="group rounded-full">
            <Link href="/signup">
              {t('ctaPrimary')}
              <ArrowRight className="ml-1 group-hover:translate-x-1 transition" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="rounded-full">
            <Link href="#how">
              <Play className="mr-1" />
              {t('ctaSecondary')}
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['amber', 'orange', 'rose', 'red'].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-background shadow-sm bg-gradient-to-br from-${c}-300 to-${c}-500`}
                />
              ))}
            </div>
            <span className="font-medium">1,000+ founders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-medium ml-1">4.9 / 5</span>
          </div>
          <div className="font-medium">🚀 200+ startups launched</div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/40 via-orange-200/40 to-rose-200/40 rounded-3xl blur-2xl" />
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-border/60 bg-card elevated-shadow">
            <div className="bg-muted/40 px-4 py-3 flex items-center gap-2 border-b border-border/40">
              <div className="w-3 h-3 rounded-full bg-rose-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <div className="flex-1 text-center text-xs text-muted-foreground font-medium">
                founders-school.app/dashboard
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-background to-muted/20">
              <DashboardPreview />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 space-y-3">
        {[
          { label: 'Startup Score', value: '87', color: 'from-amber-500 to-orange-500' },
          { label: 'Sprint Progress', value: '64%', color: 'from-orange-500 to-rose-500' },
          { label: 'Team Activity', value: '94%', color: 'from-emerald-500 to-teal-500' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/40 p-4 bg-background soft-shadow">
            <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            <div className={`font-display text-3xl mt-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <div className="col-span-3 rounded-xl border border-border/40 p-5 bg-background soft-shadow">
        <div className="text-xs text-muted-foreground font-medium mb-3">Investor Readiness</div>
        <div className="flex items-center gap-3 mb-5">
          <div className="font-display text-3xl text-gradient">Almost Ready</div>
          <div className="text-xs text-muted-foreground">7/10 criteria met</div>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Team strength', met: true },
            { label: 'Traction', met: true },
            { label: 'Revenue model', met: true },
            { label: 'Pitch deck', met: false },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between text-xs">
              <span className={c.met ? 'text-foreground' : 'text-muted-foreground'}>{c.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  c.met ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {c.met ? 'MET' : 'PARTIAL'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
