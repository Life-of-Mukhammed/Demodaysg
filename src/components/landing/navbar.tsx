'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

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
        'fixed top-4 inset-x-4 z-50 transition-all duration-300',
        scrolled ? 'top-2' : 'top-4'
      )}
    >
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-full border border-sg-dark/10 shadow-sm">
        <div className="flex items-center justify-between pl-6 pr-2 py-2">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Logo />
            <span className="font-display text-sm font-bold tracking-tight uppercase text-sg-dark hidden sm:inline">
              Venture Buildings
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link href="#features" className="text-sg-dark/70 hover:text-sg-purple transition font-medium">
              {t('features')}
            </Link>
            <Link href="#how" className="text-sg-dark/70 hover:text-sg-purple transition font-medium">
              {t('howItWorks')}
            </Link>
            <Link href="#about" className="text-sg-dark/70 hover:text-sg-purple transition font-medium">
              {t('about')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild variant="ghost" size="sm" className="text-sg-dark/80 hover:text-sg-purple hover:bg-transparent hidden sm:inline-flex">
              <Link href="/signin">{t('signin')}</Link>
            </Button>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 bg-sg-dark text-white rounded-full pl-4 pr-1.5 py-1.5 font-medium text-sm hover:bg-sg-purple transition"
            >
              {t('getStarted')}
              <span className="w-7 h-7 rounded-full bg-sg-purple flex items-center justify-center group-hover:bg-white transition">
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:text-sg-purple transition" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative w-9 h-9 rounded-lg bg-sg-purple flex items-center justify-center">
      <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-white">
        <path
          d="M24 7H12C9.79 7 8 8.79 8 11V13C8 15.21 9.79 17 12 17H20C22.21 17 24 18.79 24 21V23C24 25.21 22.21 27 20 27H8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          fill="none"
        />
      </svg>
    </div>
  );
}
