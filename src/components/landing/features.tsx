'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Brain, Heart, Zap, Trophy, Users, Sparkles, ArrowUpRight } from 'lucide-react';

export function Features() {
  const t = useTranslations('landing');

  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-sg-purple mb-4">
              / what we offer
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-sg-dark leading-[1.05]">
              Everything a founder needs,<br />
              <span className="font-serif italic font-normal text-sg-purple">in one place.</span>
            </h2>
          </div>
          <p className="text-base text-sg-dark/60 max-w-sm">{t('featuresSubtitle')}</p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[180px]">
          {/* Card 1 — large, purple */}
          <BentoCard
            className="md:col-span-3 md:row-span-2 bg-sg-purple text-white"
            icon={Brain}
            title={t('feature1Title')}
            desc={t('feature1Desc')}
            big
          />

          {/* Card 2 */}
          <BentoCard
            className="md:col-span-3 bg-white border border-sg-dark/10"
            icon={Heart}
            title={t('feature2Title')}
            desc={t('feature2Desc')}
          />

          {/* Card 3 — dark */}
          <BentoCard
            className="md:col-span-3 bg-sg-dark text-white"
            icon={Zap}
            title={t('feature3Title')}
            desc={t('feature3Desc')}
          />

          {/* Card 4 */}
          <BentoCard
            className="md:col-span-2 bg-white border border-sg-dark/10"
            icon={Trophy}
            title={t('feature4Title')}
            desc={t('feature4Desc')}
            compact
          />

          {/* Card 5 */}
          <BentoCard
            className="md:col-span-2 bg-white border border-sg-dark/10"
            icon={Users}
            title={t('feature5Title')}
            desc={t('feature5Desc')}
            compact
          />

          {/* Card 6 */}
          <BentoCard
            className="md:col-span-2 bg-sg-dark/[0.03] border border-sg-dark/10"
            icon={Sparkles}
            title={t('feature6Title')}
            desc={t('feature6Desc')}
            compact
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  className = '',
  icon: Icon,
  title,
  desc,
  big = false,
  compact = false,
}: {
  className?: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  big?: boolean;
  compact?: boolean;
}) {
  const isDark = className.includes('bg-sg-purple') || className.includes('bg-sg-dark');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group relative rounded-3xl p-6 md:p-7 ${big ? 'flex flex-col justify-between' : ''} hover:-translate-y-1 transition-all duration-500 overflow-hidden ${className}`}
    >
      <div className={`flex items-start justify-between ${big ? '' : ''}`}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/15' : 'bg-sg-purple/10'}`}>
          <Icon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-sg-purple'}`} />
        </div>
        <ArrowUpRight className={`w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:rotate-45 transition ${isDark ? 'text-white' : 'text-sg-dark'}`} />
      </div>
      <div className={big ? 'mt-auto' : 'mt-4'}>
        <h3 className={`font-display ${big ? 'text-3xl md:text-4xl' : compact ? 'text-lg' : 'text-2xl'} font-bold leading-tight tracking-tight ${isDark ? 'text-white' : 'text-sg-dark'}`}>
          {title}
        </h3>
        {!compact && (
          <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-white/75' : 'text-sg-dark/60'}`}>
            {desc}
          </p>
        )}
      </div>
    </motion.div>
  );
}
