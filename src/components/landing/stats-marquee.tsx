'use client';

const ITEMS = [
  '4,600+ founders',
  '$2.9M+ raised',
  '317 residents',
  '80+ live sessions',
  '20+ startups launched',
  '6 secured investment',
  '500+ mentored',
  '860+ women trained',
];

export function StatsMarquee() {
  return (
    <section className="bg-sg-dark py-6 overflow-hidden border-y border-sg-purple/20">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-display text-lg md:text-xl font-bold text-white uppercase tracking-tight">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-sg-purple" />
          </div>
        ))}
      </div>
    </section>
  );
}
