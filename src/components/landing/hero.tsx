'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, TrendingUp, Users } from 'lucide-react';

export function Hero() {
  const t = useTranslations('landing');

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Floating purple orbs */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-sg-purple/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-sg-purple/10 blur-[100px] pointer-events-none" />

      <div className="container relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left side — text */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sg-dark/10 bg-sg-dark/[0.03] text-xs font-medium text-sg-dark mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sg-purple animate-pulse" />
            VENTURE STUDIO · UZBEKISTAN
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight uppercase text-sg-dark leading-[0.95]"
          >
            The first<br />
            <span className="font-serif italic font-normal normal-case text-sg-purple lowercase">venture studio</span><br />
            in Uzbekistan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-sg-dark/70 leading-relaxed max-w-xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-3 bg-sg-purple text-white rounded-full pl-7 pr-2 py-2 font-semibold hover:opacity-90 transition shadow-lg shadow-sg-purple/30"
            >
              {t('ctaPrimary')}
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-sg-purple" />
              </span>
            </Link>
            <Link
              href="#how"
              className="inline-flex items-center gap-2 text-sg-dark font-semibold hover:text-sg-purple transition group"
            >
              <span className="border-b-2 border-sg-dark group-hover:border-sg-purple pb-0.5 transition">
                {t('ctaSecondary')}
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </Link>
          </motion.div>
        </div>

        {/* Right side — floating cards */}
        <div className="lg:col-span-5 relative h-[480px] hidden lg:block">
          {/* Big metric card */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute top-0 left-0 bg-sg-dark text-white rounded-3xl p-6 w-64 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-wider text-white/60">Total raised</div>
              <TrendingUp className="w-4 h-4 text-sg-purple" />
            </div>
            <div className="font-display text-4xl font-bold">$2.9M+</div>
            <div className="text-xs text-white/60 mt-2">across 20 portfolio startups</div>
            <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-3/4 bg-sg-purple" />
            </div>
          </motion.div>

          {/* Founders card */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute top-32 right-0 bg-white border border-sg-dark/10 rounded-3xl p-6 w-56 shadow-xl"
          >
            <div className="flex -space-x-2 mb-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white bg-sg-purple flex items-center justify-center text-white text-xs font-bold"
                  style={{ opacity: 0.6 + i * 0.1 }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-sg-dark flex items-center justify-center text-white text-[10px] font-bold">
                +4k
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-sg-dark">4,600+</div>
            <div className="text-xs text-sg-dark/60 mt-1">founders in community</div>
          </motion.div>

          {/* Purple accent card */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-0 left-8 bg-sg-purple text-white rounded-3xl p-6 w-72 shadow-2xl shadow-sg-purple/30"
          >
            <Sparkles className="w-6 h-6 mb-3" />
            <div className="font-serif italic text-2xl leading-tight">
              &ldquo;From idea to investment in 18 months.&rdquo;
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-white/80">
              Residency program
            </div>
          </motion.div>

          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute top-2 right-12 bg-white border border-sg-dark/10 rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-sg-purple" />
            <span className="text-xs font-bold text-sg-dark">317 residents</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
