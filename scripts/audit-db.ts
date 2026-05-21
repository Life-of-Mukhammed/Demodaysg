import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  console.log('═══ Users ═══');
  const users = await p.user.findMany({
    include: {
      founderProfile: true,
      specialistProfile: true,
      mentorProfile: true,
      _count: { select: { ownedStartups: true, memberships: true, notifications: true, badges: true } },
    },
  });
  for (const u of users) {
    const profiles = [u.founderProfile && 'F', u.specialistProfile && 'S', u.mentorProfile && 'M'].filter(Boolean).join(',');
    console.log(`  ${u.email} | role=${u.primaryRole} | admin=${u.isAdmin} | L${u.level} ${u.xp}XP | profiles=[${profiles}] | own=${u._count.ownedStartups} mem=${u._count.memberships} badges=${u._count.badges}`);

    // Check for missing profile based on role
    if (u.primaryRole === 'FOUNDER' && !u.founderProfile) console.log(`    ⚠️ Missing founder profile`);
    if (u.primaryRole === 'SPECIALIST' && !u.specialistProfile) console.log(`    ⚠️ Missing specialist profile`);
    if (u.primaryRole === 'MENTOR' && !u.mentorProfile) console.log(`    ⚠️ Missing mentor profile`);
  }

  console.log('\n═══ Startups ═══');
  const startups = await p.startup.findMany({
    include: {
      founder: { select: { email: true } },
      mentor: { select: { email: true } },
      _count: { select: { members: true, listings: true, sprints: true, tasks: true } },
    },
  });
  for (const s of startups) {
    console.log(`  ${s.name} | sector=${s.sector} stage=${s.stage} score=${s.aiScore}/${s.scoreCategory}`);
    console.log(`    founder=${s.founder.email} mentor=${s.mentor?.email || 'NONE'}`);
    console.log(`    members=${s._count.members} listings=${s._count.listings} sprints=${s._count.sprints} tasks=${s._count.tasks}`);
    if (!s.aiScore) console.log(`    ⚠️ No AI score`);
    if (!s.mentor) console.log(`    ⚠️ No mentor assigned`);
  }

  console.log('\n═══ Tasks distribution ═══');
  const tasks = await p.task.groupBy({
    by: ['status'],
    _count: true,
  });
  tasks.forEach(t => console.log(`  ${t.status}: ${t._count}`));

  console.log('\n═══ Applications ═══');
  const apps = await p.application.findMany({
    include: { user: { select: { email: true } }, listing: { include: { startup: { select: { name: true } } } } },
  });
  apps.forEach(a => console.log(`  ${a.user.email} → ${a.listing.startup.name}/${a.listing.title} | ${a.status}`));

  console.log('\n═══ Matches ═══');
  const matches = await p.match.count();
  console.log(`  Total: ${matches}`);

  console.log('\n═══ Sprints ═══');
  const sprints = await p.sprint.findMany({
    include: { startup: { select: { name: true } }, _count: { select: { tasks: true } } },
  });
  sprints.forEach(s => console.log(`  ${s.startup.name}/${s.name} | tasks=${s._count.tasks} completed=${s.completed} rate=${s.completionRate}%`));

  console.log('\n═══ Notifications ═══');
  const notifs = await p.notification.groupBy({ by: ['type', 'read'], _count: true });
  notifs.forEach(n => console.log(`  ${n.type} (${n.read ? 'read' : 'unread'}): ${n._count}`));

  console.log('\n═══ Listings ═══');
  const listings = await p.listing.findMany({
    include: { startup: { select: { name: true } }, _count: { select: { applications: true } } },
  });
  listings.forEach(l => console.log(`  ${l.startup.name}/${l.title} | ${l.role}/${l.level} | apps=${l._count.applications} active=${l.active}`));
}

main().catch(console.error).finally(() => p.$disconnect());
