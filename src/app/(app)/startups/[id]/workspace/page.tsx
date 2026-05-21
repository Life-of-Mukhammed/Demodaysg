import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, Lock, Kanban as KanbanIcon } from 'lucide-react';
import { KanbanBoard } from '@/components/workspace/kanban';
import { CreateSprintButton } from '@/components/workspace/create-sprint';

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      founder: true,
      members: { include: { user: true } },
      sprints: { where: { completed: false }, take: 1, orderBy: { createdAt: 'desc' } },
      tasks: { include: { assignee: true }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!startup) notFound();

  const isFounder = startup.founderId === user.id;
  const isMember = startup.members.some((m) => m.userId === user.id);
  const isMentor = user.primaryRole === 'MENTOR';

  // Only founder, mentor, member, or admin can access workspace
  if (!isFounder && !isMember && !isMentor && !user.isAdmin) {
    return (
      <div className="container max-w-md py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-9 h-9 text-rose-500" />
        </div>
        <h2 className="font-display text-3xl tracking-tight">Kirish taqiqlangan</h2>
        <p className="text-muted-foreground mt-2">Bu workspace faqat jamoa a'zolari uchun</p>
      </div>
    );
  }

  const canCreateSprint = (isMentor && startup.mentorId === user.id) || user.isAdmin;
  const activeSprint = startup.sprints[0];

  const teamMembers = [
    {
      id: startup.founderId,
      name: (startup.founder.displayName || startup.founder.email.split('@')[0]) + ' (Founder)',
      role: 'FOUNDER',
    },
    ...startup.members.map((m) => ({
      id: m.userId,
      name: m.user.displayName || m.user.email.split('@')[0],
      role: m.role,
    })),
  ];

  // No sprint yet → show creation empty state
  if (!activeSprint) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-tight">{startup.name} — Workspace</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Sprint mavjud emas</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-secondary/20">
          <div className="text-center max-w-lg px-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-6 soft-shadow">
              <KanbanIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-4xl tracking-tight mb-3">Workspace hali ochiq emas</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {canCreateSprint
                ? "Mentor sifatida birinchi sprintni yarating. Sprint — bu jamoa 1-4 hafta davomida bajaradigan vazifalar to'plami."
                : startup.mentorId
                  ? "Sprintni faqat shu startupga biriktirilgan mentor yaratadi"
                  : "Bu startupga hali mentor biriktirilmagan. Admin'dan so'rang"}
            </p>

            {canCreateSprint ? (
              <CreateSprintButton startupId={id} startupName={startup.name} />
            ) : (
              <Badge variant="secondary" className="px-4 py-2">
                <Lock className="w-3 h-3 mr-1.5" /> Mentor kutilmoqda
              </Badge>
            )}

            <div className="mt-10 grid grid-cols-3 gap-3 text-left">
              <FeatureCard icon={Target} title="Sprint maqsadi" desc="Aniq natija belgilang" />
              <FeatureCard icon={KanbanIcon} title="Kanban board" desc="Vazifalarni boshqaring" />
              <FeatureCard icon={Sparkles} title="AI yordami" desc="AI task generator" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/workspace" className="text-xs text-muted-foreground hover:text-primary">← Boshqa startup</Link>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl tracking-tight">{startup.name}</h1>
            <Badge variant="gradient" className="text-[10px]">
              <Target className="w-3 h-3 mr-1" /> {activeSprint.name}
            </Badge>
            <Badge variant="outline" className="text-[10px]">{teamMembers.length} a'zo</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{activeSprint.goal}</p>
        </div>
        {canCreateSprint && (
          <Link href={`/startups/${id}/sprint`} className="text-xs text-primary hover:underline">
            Sprintlar ›
          </Link>
        )}
      </div>
      <KanbanBoard
        startupId={id}
        sprintId={activeSprint.id}
        initialTasks={startup.tasks}
        team={teamMembers}
        canEdit={isFounder || user.isAdmin}
        currentUserId={user.id}
        startupBrief={{
          name: startup.name,
          stage: startup.stage,
          sector: startup.sector,
          pitch: startup.pitch,
        }}
      />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-4 rounded-xl border border-border/40 bg-card">
      <Icon className="w-5 h-5 text-primary mb-2" />
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
  );
}
