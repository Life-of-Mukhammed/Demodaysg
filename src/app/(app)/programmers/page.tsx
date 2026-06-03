import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';
import { ProgrammerApplyButton } from '@/components/programmers/apply-modal';
import { ProgrammersClient } from '@/components/programmers/programmers-client';

export default async function ProgrammersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const profiles = await prisma.specialistProfile.findMany({
    where: { available: true },
    include: {
      user: { select: { id: true, displayName: true, email: true, avatarUrl: true } },
    },
    orderBy: { aiScore: 'desc' },
  });

  const myProfile = await prisma.specialistProfile.findUnique({ where: { userId: user.id } });

  const serialized = profiles.map((p) => ({
    ...p,
    workExperience: (p.workExperience as any) ?? null,
  }));

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dasturchilar</span>
        </div>
        <h1 className="font-display text-4xl tracking-tight">Programmers</h1>
        <p className="text-muted-foreground">
          {profiles.length} ta dasturchi startupga qo&apos;shilishga tayyor
        </p>
      </div>

      <ProgrammerApplyButton hasProfile={!!myProfile} />

      <ProgrammersClient profiles={serialized as any} />
    </div>
  );
}
