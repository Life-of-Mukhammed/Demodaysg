import { prisma } from './prisma';
import { levelFromXP } from './utils';

export async function awardBadge(userId: string, badgeCode: string) {
  const badge = await prisma.badge.findUnique({ where: { code: badgeCode } });
  if (!badge) return;
  try {
    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
    await addXP(userId, badge.xpReward);
    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE_EARNED',
        title: `Badge earned: ${badge.name}`,
        body: badge.description,
        link: '/dashboard',
      },
    });
  } catch {
    // already has badge
  }
}

export async function addXP(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const newXP = user.xp + amount;
  const newLevel = levelFromXP(newXP);
  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXP, level: newLevel },
  });
}

export async function updateStreak(userId: string) {
  const s = await prisma.streak.findUnique({ where: { userId } });
  const now = new Date();
  if (!s) {
    await prisma.streak.create({
      data: { userId, currentDays: 1, longestDays: 1, lastActiveAt: now },
    });
    return;
  }
  const last = s.lastActiveAt;
  const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return; // same day
  if (diff === 1) {
    const newDays = s.currentDays + 1;
    await prisma.streak.update({
      where: { userId },
      data: {
        currentDays: newDays,
        longestDays: Math.max(s.longestDays, newDays),
        lastActiveAt: now,
      },
    });
    if (newDays === 7) await awardBadge(userId, 'streak_7');
    if (newDays === 30) await awardBadge(userId, 'streak_30');
  } else {
    await prisma.streak.update({
      where: { userId },
      data: { currentDays: 1, lastActiveAt: now },
    });
  }
}
