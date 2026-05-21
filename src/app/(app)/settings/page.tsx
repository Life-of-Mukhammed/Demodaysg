import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/page-header';
import { Settings as SettingsIcon, Trophy, Flame, Sparkles, Mail, Crown, Award } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { xpToNextLevel } from '@/lib/utils';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });
  const badges = await prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true } });
  const nextLevelXP = xpToNextLevel(user.xp);
  const currentLevelXP = (user.level - 1) * (user.level - 1) * 100;
  const xpInLevel = user.xp - currentLevelXP;
  const xpRange = user.level * user.level * 100 - currentLevelXP;
  const levelProgress = xpRange ? (xpInLevel / xpRange) * 100 : 0;

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <PageHeader
        eyebrow="Settings"
        icon={<SettingsIcon />}
        title="Profil va sozlamalar"
      />

      {/* Profile card */}
      <Card className="soft-shadow overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
        </div>
        <CardContent className="px-6 pb-6 -mt-14 relative">
          <Avatar className="w-24 h-24 border-4 border-card soft-shadow">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback className="text-3xl">{(user.displayName || user.email)[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-3xl tracking-tight">{user.displayName || user.email.split('@')[0]}</h2>
              {user.isAdmin && <Badge variant="destructive" className="gap-1 text-[10px]"><Crown className="w-3 h-3" /> Admin</Badge>}
              {user.verifiedFounder && <Badge variant="success" className="text-[10px]">✓ Verified</Badge>}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </div>
            <Badge variant="gradient" className="mt-3">{user.primaryRole}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Level + XP */}
      <Card className="soft-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center soft-shadow">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Level</div>
              <div className="font-display text-4xl tracking-tight">{user.level}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total XP</div>
              <div className="font-display text-4xl tracking-tight">{user.xp}</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Level {user.level}</span>
            <span>{nextLevelXP} XP to L{user.level + 1}</span>
          </div>
          <Progress value={levelProgress} />
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="soft-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center soft-shadow">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Joriy Streak</div>
                <div className="font-display text-3xl">{streak?.currentDays || 0}d</div>
                <div className="text-[10px] text-muted-foreground">Eng yaxshi: {streak?.longestDays || 0}d</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="soft-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center soft-shadow">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Badges</div>
                <div className="font-display text-3xl">{badges.length}</div>
                <div className="text-[10px] text-muted-foreground">olingan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <Card className="soft-shadow">
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Yutuqlar</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {badges.map((ub) => (
                <div key={ub.id} className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
                  <div className="text-4xl mb-2">{ub.badge.icon}</div>
                  <div className="text-sm font-medium">{ub.badge.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{ub.badge.description}</div>
                  <Badge variant="gradient" className="text-[10px] mt-2">+{ub.badge.xpReward} XP</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
