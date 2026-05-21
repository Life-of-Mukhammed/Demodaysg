import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  const alo = await p.startup.findFirst({
    where: { name: { contains: 'alo', mode: 'insensitive' } },
  });
  if (!alo) {
    console.log('alo startup not found');
    return;
  }

  const existing = await p.listing.count({ where: { startupId: alo.id } });
  if (existing > 0) {
    console.log('Already has listings:', existing);
    return;
  }

  const listings = await Promise.all([
    p.listing.create({
      data: {
        startupId: alo.id,
        type: 'CONTRACT',
        role: 'DEVELOPER',
        title: 'Senior React Developer',
        description: 'Bizning SaaS platforma uchun senior React developer kerak. Tajriba: 3+ yil, TypeScript, Next.js, talabchan loyihalar tajribasi.',
        skills: ['React', 'TypeScript', 'Next.js', 'PostgreSQL'],
        level: 'SENIOR',
        equity: 2.5,
        remote: true,
      },
    }),
    p.listing.create({
      data: {
        startupId: alo.id,
        type: 'FULL_TIME',
        role: 'DESIGNER',
        title: 'Product Designer',
        description: 'UI/UX designer, Figma da kuchli, design system yaratish tajribasi bilan.',
        skills: ['Figma', 'UI/UX', 'Design Systems'],
        level: 'MIDDLE',
        equity: 1.0,
        remote: true,
      },
    }),
    p.listing.create({
      data: {
        startupId: alo.id,
        type: 'COFOUNDER',
        role: 'CTO',
        title: 'Technical Co-founder',
        description: 'Texnik co-founder qidiramiz. Loyihaning texnik strategiyasini boshqaradi.',
        skills: ['System Design', 'Leadership', 'Full-stack'],
        level: 'LEAD',
        equity: 15,
        remote: true,
      },
    }),
  ]);

  console.log('Created', listings.length, 'listings on', alo.name);
  for (const l of listings) {
    console.log('  -', l.title, '(' + l.role + '/' + l.level + ') -', l.type);
  }
}

main().catch((e) => console.error(e)).finally(() => p.$disconnect());
