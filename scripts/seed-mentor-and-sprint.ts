import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  // 1. Find admin user (zohid) and promote to MENTOR for testing
  const admin = await p.user.findFirst({ where: { isAdmin: true } });
  if (!admin) {
    console.log('No admin user found');
    return;
  }
  console.log('Found admin:', admin.email);

  // Ensure mentor profile exists
  await p.mentorProfile.upsert({
    where: { userId: admin.id },
    create: {
      userId: admin.id,
      bio: 'Tajribali tech mentor. Startuplarni idea bosqichidan investitsiyagacha olib boradi.',
      expertise: ['Product', 'Engineering', 'Strategy', 'Fundraising'],
      sectors: ['SAAS', 'AI', 'FINTECH'],
      yearsExperience: 8,
      invitedBy: 'system-seed',
    },
    update: {},
  });

  // 2. Assign as mentor to 'alo' startup
  const alo = await p.startup.findFirst({ where: { name: { contains: 'alo', mode: 'insensitive' } } });
  if (!alo) {
    console.log('alo startup not found');
    return;
  }

  await p.startup.update({
    where: { id: alo.id },
    data: { mentorId: admin.id },
  });
  console.log('Assigned', admin.email, 'as mentor of', alo.name);

  // 3. Create 30-day sprint as mentor
  const existingSprint = await p.sprint.findFirst({ where: { startupId: alo.id } });
  if (existingSprint) {
    console.log('Sprint already exists, skipping:', existingSprint.name);
  } else {
    const startDate = new Date();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const sprint = await p.sprint.create({
      data: {
        startupId: alo.id,
        name: 'Sprint 1 - MVP Launch + First Users',
        goal: '30 kun ichida: MVP yakuniy versiyani ishga tushirish, 100 ta dastlabki foydalanuvchi olish, key metrics dashboardini qurish, va auth + payment flow yopish.',
        startDate,
        endDate,
        createdById: admin.id,
      },
    });
    console.log('Created 30-day sprint:', sprint.name);

    // 4. Add some initial tasks for the sprint (mentor assigns to founder)
    const tasks = [
      { title: 'Auth flow tugatish', description: 'Email/Password + Google OAuth + email verification\n• Firebase Auth setup\n• Session management\n• Profile completion flow', priority: 'HIGH', assigneeRole: 'FOUNDER' },
      { title: 'Landing page reditsayn', description: 'Hero + features + pricing sections\n• A/B test 2 ta versiya\n• Conversion tracking', priority: 'MEDIUM', assigneeRole: 'DESIGNER' },
      { title: 'Database schema review', description: 'Production scale uchun optimizatsiya\n• Indexes\n• Query performance\n• Backup strategy', priority: 'HIGH', assigneeRole: 'DEVELOPER' },
      { title: '10 ta dastlabki foydalanuvchi bilan interview', description: 'Custom dev intervyular o\'tkazish\n• User research script tayyorlash\n• Findings ni systematizatsiya qilish', priority: 'URGENT', assigneeRole: 'FOUNDER' },
      { title: 'KPI dashboard prototip', description: 'Asosiy metrika ko\'rinishlari\n• DAU/MAU\n• Conversion funnel\n• Retention curves', priority: 'MEDIUM', assigneeRole: 'DEVELOPER' },
    ];

    // Get team
    const founder = await p.user.findUnique({ where: { id: alo.founderId } });
    const devMember = await p.startupMember.findFirst({ where: { startupId: alo.id, role: 'DEVELOPER' }, include: { user: true } });

    for (const t of tasks) {
      let assigneeId: string;
      if (t.assigneeRole === 'FOUNDER' || !devMember) assigneeId = founder!.id;
      else assigneeId = devMember.userId;
      await p.task.create({
        data: {
          startupId: alo.id,
          sprintId: sprint.id,
          title: t.title,
          description: t.description,
          status: 'TODO',
          priority: t.priority as any,
          assigneeId,
          creatorId: admin.id,
          aiGenerated: false,
        },
      });
    }
    console.log('Created', tasks.length, 'initial tasks for sprint');
  }

  // 5. Award XP to specialist for joining (zohid joined alo as DEVELOPER)
  const member = await p.startupMember.findFirst({
    where: { startupId: alo.id, role: 'DEVELOPER' },
    include: { user: true },
  });
  if (member) {
    // Bring them to level 2 minimum (need 100 XP for level 2)
    const newXP = Math.max(member.user.xp, 200);
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    await p.user.update({
      where: { id: member.userId },
      data: { xp: newXP, level: newLevel },
    });
    console.log('Awarded', member.user.email, 'XP:', newXP, 'Level:', newLevel);
  }

  console.log('\nDone!');
}

main().catch((e) => console.error(e)).finally(() => p.$disconnect());
