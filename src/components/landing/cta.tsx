'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
  const t = useTranslations('landing');

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-14 md:p-24 text-center elevated-shadow"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/15 rounded-full blur-3xl" />

          <div className="relative">
            <Sparkles className="w-12 h-12 text-white/90 mx-auto mb-6" />
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="mt-8 text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed">
              {t('ctaSubtitle')}
            </p>
            <div className="mt-12">
              <Button
                asChild
                size="xl"
                className="bg-white text-orange-600 hover:bg-white/95 elevated-shadow group rounded-full"
              >
                <Link href="/signup">
                  {t('ctaPrimary')}
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
