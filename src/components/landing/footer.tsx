import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-sg-dark/10">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg bg-sg-purple flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-white">
                  <path
                    d="M24 7H12C9.79 7 8 8.79 8 11V13C8 15.21 9.79 17 12 17H20C22.21 17 24 18.79 24 21V23C24 25.21 22.21 27 20 27H8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="square"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="font-display text-lg font-bold uppercase tracking-tight text-sg-dark">
                Venture Builders
              </span>
            </Link>
            <p className="mt-5 font-serif italic text-2xl text-sg-dark leading-snug max-w-md">
              The first venture studio in Uzbekistan. From idea to investment.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-sg-dark/15 flex items-center justify-center text-sg-dark/70 hover:text-white hover:bg-sg-purple hover:border-sg-purple transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-sg-dark/15 flex items-center justify-center text-sg-dark/70 hover:text-white hover:bg-sg-purple hover:border-sg-purple transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-sg-dark/15 flex items-center justify-center text-sg-dark/70 hover:text-white hover:bg-sg-purple hover:border-sg-purple transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-display font-bold mb-4 text-xs uppercase tracking-widest text-sg-purple">Product</h4>
            <ul className="space-y-3 text-sm text-sg-dark/70">
              <li><Link href="#features" className="hover:text-sg-purple transition">Features</Link></li>
              <li><Link href="#how" className="hover:text-sg-purple transition">How it works</Link></li>
              <li><Link href="/signup" className="hover:text-sg-purple transition">Get started</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display font-bold mb-4 text-xs uppercase tracking-widest text-sg-purple">Company</h4>
            <ul className="space-y-3 text-sm text-sg-dark/70">
              <li><Link href="#about" className="hover:text-sg-purple transition">About</Link></li>
              <li><Link href="#" className="hover:text-sg-purple transition">Portfolio</Link></li>
              <li><Link href="#" className="hover:text-sg-purple transition">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display font-bold mb-4 text-xs uppercase tracking-widest text-sg-purple">Get in touch</h4>
            <ul className="space-y-3 text-sm text-sg-dark/70">
              <li>partner@startupgarage.uz</li>
              <li>+998 94 112 95 02</li>
              <li>Tashkent, Uzbekistan</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-sg-dark/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-sg-dark/50">
          <p>© {new Date().getFullYear()} Venture Builders. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-sg-purple transition">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-sg-purple transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
