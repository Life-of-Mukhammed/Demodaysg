import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex flex-col bg-warm-gradient">
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-300/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-orange-300/15 rounded-full blur-[120px]" />

      <header className="relative z-10 container py-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center soft-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl tracking-tight">Founders School</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
