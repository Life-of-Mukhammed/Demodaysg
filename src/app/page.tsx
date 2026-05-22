import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { StatsMarquee } from '@/components/landing/stats-marquee';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Achievements } from '@/components/landing/achievements';
import { Portfolio } from '@/components/landing/portfolio';
import { Quote } from '@/components/landing/quote';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <StatsMarquee />
      <Features />
      <HowItWorks />
      <Achievements />
      <Portfolio />
      <Quote />
      <CTA />
      <Footer />
    </main>
  );
}
