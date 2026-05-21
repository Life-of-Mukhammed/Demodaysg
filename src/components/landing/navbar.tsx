'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border/40 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
          <span className="font-display text-xl tracking-tight">Founders School</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition font-medium">
            {t('features')}
          </Link>
          <Link href="#how" className="text-muted-foreground hover:text-foreground transition font-medium">
            {t('howItWorks')}
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition font-medium">
            {t('about')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/signin">{t('signin')}</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/signup">{t('getStarted')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 flex items-center justify-center soft-shadow">
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
        <path
          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
