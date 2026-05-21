'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const tn = useTranslations('nav');
  const router = useRouter();
  const { signUp, signInGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function friendlyError(err: any) {
    const code = err?.code || '';
    if (code.includes('configuration-not-found') || code.includes('operation-not-allowed')) {
      return 'Email/Password auth Firebase Console\'da yoqilmagan. Authentication > Sign-in method > Email/Password > Enable.';
    }
    if (code.includes('email-already')) return 'Bu email allaqachon ro\'yxatda. Kiring.';
    if (code.includes('weak-password')) return 'Parol juda kuchsiz (kamida 6 belgi).';
    if (code.includes('invalid-email')) return 'Email manzili noto\'g\'ri.';
    if (code.includes('popup-closed')) return 'Google popup yopildi.';
    return err?.message || 'Xato yuz berdi';
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name);
      toast.success('Hisob yaratildi!');
      window.location.href = '/onboarding';
    } catch (err: any) {
      toast.error(friendlyError(err));
      setLoading(false);
    }
  }

  async function onGoogle() {
    setGLoading(true);
    try {
      await signInGoogle();
      window.location.href = '/onboarding';
    } catch (err: any) {
      toast.error(friendlyError(err));
    } finally {
      setGLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="p-8 backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">{t('signupTitle')}</h1>
        </div>

        <Button onClick={onGoogle} disabled={gLoading} variant="outline" size="lg" className="w-full mb-4">
          {gLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t('google')}</>}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t('orContinue')}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tc('create')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t('hasAccount')}{' '}
          <Link href="/signin" className="text-primary font-medium hover:underline">
            {tn('signin')}
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
