import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const match = await prisma.match.findUnique({
    where: { id },
    include: { startup: true },
  });
  if (!match) notFound();

  const otherId = match.userAId === user.id ? match.userBId : match.userAId;
  const other = await prisma.user.findUnique({
    where: { id: otherId },
    include: { specialistProfile: true, founderProfile: true },
  });
  if (!other) notFound();

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500" />
        <CardContent className="p-6 -mt-12 relative">
          <Avatar className="w-24 h-24 border-4 border-card shadow-xl">
            {other.avatarUrl && <AvatarImage src={other.avatarUrl} />}
            <AvatarFallback className="text-2xl">{(other.displayName || other.email)[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="font-display text-2xl font-bold mt-4">{other.displayName || other.email}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="gradient">{other.primaryRole}</Badge>
            {match.startup && <Badge variant="outline">{match.startup.name}</Badge>}
          </div>
          {other.specialistProfile?.aiScore != null && (
            <div className="flex items-center gap-2 mt-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-2xl font-bold">{other.specialistProfile.aiScore}</span>
              <span className="text-xs text-muted-foreground">AI Score</span>
            </div>
          )}
          {other.specialistProfile?.bio && <p className="text-sm text-muted-foreground mt-4">{other.specialistProfile.bio}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
