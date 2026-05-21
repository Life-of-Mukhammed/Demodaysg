'use client';

import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [, startTransition] = useTransition();

  const setLocale = (l: string) => {
    document.cookie = `locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('uz')} className={locale === 'uz' ? 'bg-accent' : ''}>
          🇺🇿 O'zbek
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('ru')} className={locale === 'ru' ? 'bg-accent' : ''}>
          🇷🇺 Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
