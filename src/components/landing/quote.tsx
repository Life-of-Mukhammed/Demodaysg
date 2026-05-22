'use client';

import { motion } from 'framer-motion';

export function Quote() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="font-serif text-7xl md:text-9xl text-sg-purple leading-none absolute -top-4 -left-2 select-none">
            &ldquo;
          </div>
          <blockquote className="relative pl-12 md:pl-20">
            <p className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-sg-dark leading-[1.1] tracking-tight">
              We&apos;re building a network designed for the most <span className="font-serif italic font-normal text-sg-purple">influential founders</span> in Central Asia — <span className="text-sg-dark/40">free and open to everyone.</span>
            </p>
            <footer className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sg-purple flex items-center justify-center text-white font-bold">
                OM
              </div>
              <div>
                <div className="font-display font-bold text-sg-dark">Oxunjon Madaminjonov</div>
                <div className="text-sm text-sg-dark/60">Founder, Startup Garage</div>
              </div>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
