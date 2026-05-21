import Link from 'next/link';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center soft-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl">Founders School</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              AI-powered startup operating system. From idea to investment.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-accent transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-accent transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-accent transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="#how" className="hover:text-foreground">How it works</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Get started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Founders School. All rights reserved.</p>
          <p>Made with 🧡 in Tashkent</p>
        </div>
      </div>
    </footer>
  );
}
