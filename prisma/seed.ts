import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BADGES = [
  { code: 'first_startup', name: 'First Startup', description: 'Created your first startup', icon: '🚀', xpReward: 100 },
  { code: 'first_match', name: 'First Match', description: 'Got your first co-founder match', icon: '🤝', xpReward: 75 },
  { code: 'sprint_warrior', name: 'Sprint Warrior', description: 'Completed your first sprint', icon: '⚡', xpReward: 150 },
  { code: 'investor_ready', name: 'Investor Ready', description: 'Your startup is investor-ready', icon: '💎', xpReward: 500 },
  { code: 'streak_7', name: '7-Day Streak', description: 'Active for 7 days in a row', icon: '🔥', xpReward: 100 },
  { code: 'streak_30', name: '30-Day Streak', description: 'Active for 30 days in a row', icon: '🌟', xpReward: 500 },
  { code: 'top_mentor', name: 'Top Mentor', description: 'Highly rated mentor', icon: '🧙', xpReward: 300 },
  { code: 'ai_score_90', name: 'AI Score 90+', description: 'Achieved AI score of 90+', icon: '🏆', xpReward: 400 },
  { code: 'team_builder', name: 'Team Builder', description: 'Built a team of 5+', icon: '👥', xpReward: 200 },
  { code: 'vc_backable', name: 'VC Backable', description: 'Reached VC Backable category', icon: '💰', xpReward: 1000 },
];

async function main() {
  console.log('Seeding badges...');
  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: b,
      create: b,
    });
  }
  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
