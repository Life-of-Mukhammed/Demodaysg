'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function CTA() {
  const t = useTranslations('landing');

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-sg-dark rounded-[2.5rem] overflow-hidden p-10 md:p-16 lg:p-20"
        >
          {/* Floating purple orb */}
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-sg-purple/40 blur-[100px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="text-xs font-bold uppercase tracking-widest text-sg-purple mb-6">
                / ready to start?
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold uppercase text-white tracking-tight leading-[0.95]">
                Start working<br />
                on your<br />
                <span className="font-serif italic font-normal normal-case text-sg-purple lowercase">startup today.</span>
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
                {t('ctaSubtitle')}
              </p>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 bg-sg-purple text-white rounded-full pl-7 pr-2 py-2 font-semibold hover:opacity-90 transition shadow-lg shadow-sg-purple/30"
              >
                {t('ctaPrimary')}
                <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5 text-sg-purple" />
                </span>
              </Link>

              <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50">Contact</div>
                  <div className="mt-1 text-sm text-white">partner@startupgarage.uz</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50">Phone</div>
                  <div className="mt-1 text-sm text-white">+998 94 112 95 02</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
