import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Crown, Medal, Rocket, Briefcase, GraduationCap } from 'lucide-react';

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const [topAll, topFounders, topSpecialists, topMentors] = await Promise.all([
    prisma.user.findMany({ orderBy: { xp: 'desc' }, take: 50 }),
    prisma.user.findMany({ where: { primaryRole: 'FOUNDER' }, orderBy: { xp: 'desc' }, take: 20 }),
    prisma.user.findMany({ where: { primaryRole: 'SPECIALIST' }, orderBy: { xp: 'desc' }, take: 20 }),
    prisma.user.findMany({ where: { primaryRole: 'MENTOR' }, orderBy: { xp: 'desc' }, take: 20 }),
  ]);

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <PageHeader
        eyebrow="Leaderboard"
        icon={<Trophy />}
        title="Eng faollar"
        subtitle="XP va daraja bo'yicha top foydalanuvchilar. Streak, badge, va sprint completion bilan o'ssa boradi."
      />

      <Tabs defaultValue="all">
        <TabsList className="bg-secondary/60 p-1 h-11">
          <TabsTrigger value="all" className="gap-1.5 px-4"><Trophy className="w-3.5 h-3.5" /> Hammasi</TabsTrigger>
          <TabsTrigger value="founders" className="gap-1.5 px-4"><Rocket className="w-3.5 h-3.5" /> Founder</TabsTrigger>
          <TabsTrigger value="specialists" className="gap-1.5 px-4"><Briefcase className="w-3.5 h-3.5" /> Specialist</TabsTrigger>
          <TabsTrigger value="mentors" className="gap-1.5 px-4"><GraduationCap className="w-3.5 h-3.5" /> Mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="all"><RankList users={topAll} currentId={user.id} showRole /></TabsContent>
        <TabsContent value="founders"><RankList users={topFounders} currentId={user.id} /></TabsContent>
        <TabsContent value="specialists"><RankList users={topSpecialists} currentId={user.id} /></TabsContent>
        <TabsContent value="mentors"><RankList users={topMentors} currentId={user.id} /></TabsContent>
      </Tabs>
    </div>
  );
}

function RankList({ users, currentId, showRole }: { users: any[]; currentId: string; showRole?: boolean }) {
  if (users.length === 0) {
    return (
      <Card className="soft-shadow">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">Bu kategoriyada hali foydalanuvchi yo'q</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top 3 podium */}
      {users.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[users[1], users[0], users[2]].map((u, i) => {
            const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const iconColor = realRank === 1 ? 'text-amber-500 fill-amber-400' : realRank === 2 ? 'text-slate-400 fill-slate-300' : 'text-amber-700 fill-amber-600';
            const grad = realRank === 1 ? 'from-amber-400 to-orange-400' : realRank === 2 ? 'from-slate-300 to-slate-400' : 'from-amber-600 to-amber-700';
            const order = realRank === 1 ? 'order-2' : realRank === 2 ? 'order-1' : 'order-3';
            const scale = realRank === 1 ? 'scale-110' : '';
            return (
              <Card key={u.id} className={`${order} ${scale} relative overflow-hidden soft-shadow`}>
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${grad}`} />
                <CardContent className="p-4 text-center">
                  <Crown className={`w-6 h-6 mx-auto mb-2 ${iconColor}`} />
                  <Avatar className="w-14 h-14 mx-auto soft-shadow">
                    {u.avatarUrl && <AvatarImage src={u.avatarUrl} />}
                    <AvatarFallback>{(u.displayName || u.email)[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 font-semibold text-sm truncate">{u.displayName || u.email.split('@')[0]}</div>
                  <div className="text-[10px] text-muted-foreground">L{u.level}</div>
                  <Badge variant="gradient" className="text-[10px] mt-2">{u.xp} XP</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Rest */}
      <Card className="soft-shadow">
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {users.slice(users.length >= 3 ? 3 : 0).map((u, i) => {
              const rank = (users.length >= 3 ? 3 : 0) + i + 1;
              const isMe = u.id === currentId;
              return (
                <div key={u.id} className={`flex items-center gap-4 p-4 ${isMe ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-accent/40'} transition`}>
                  <div className="w-10 text-center">
                    <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
                  </div>
                  <Avatar>
                    {u.avatarUrl && <AvatarImage src={u.avatarUrl} />}
                    <AvatarFallback>{(u.displayName || u.email)[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{u.displayName || u.email.split('@')[0]}</div>
                      {isMe && <Badge variant="outline" className="text-[10px]">Siz</Badge>}
                      {showRole && <Badge variant="outline" className="text-[10px]">{u.primaryRole}</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">Level {u.level}</div>
                  </div>
                  <Badge variant="gradient" className="text-xs">{u.xp} XP</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
