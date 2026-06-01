import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Sparkles, MapPin, Github, Linkedin, Globe, UserPlus, ChevronRight } from 'lucide-react';
import { scoreColor } from '@/lib/utils';

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

  const myProfile = user.primaryRole === 'SPECIALIST'
    ? await prisma.specialistProfile.findUnique({ where: { userId: user.id } })
    : null;

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex items-start justify-between">
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
        {user.primaryRole === 'SPECIALIST' && (
          <Link href="/profile/specialist">
            <Button variant={myProfile ? 'outline' : 'glow'} className="rounded-full gap-2">
              <UserPlus className="w-4 h-4" />
              {myProfile ? 'Profilni tahrirlash' : 'Nomzodingizni qo\'ying'}
            </Button>
          </Link>
        )}
      </div>

      {/* CTA for non-specialists */}
      {user.primaryRole !== 'SPECIALIST' && (
        <Card className="soft-shadow bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 border-violet-500/20">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Dasturchi sifatida ro&apos;yxatdan o&apos;ting</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Profilingizni to&apos;ldiring va startuplarga qo&apos;shiling</p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm" className="rounded-full gap-1">
                Boshlash <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {profiles.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5">
              <Users className="w-9 h-9 text-primary" />
            </div>
            <h3 className="font-display text-3xl tracking-tight mb-2">Hozircha dasturchi yo'q</h3>
            <p className="text-sm text-muted-foreground">Tez orada yangi dasturchilar qo'shiladi</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((p) => (
            <Card key={p.id} className="soft-shadow hover:elevated-shadow hover:-translate-y-1 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-14 h-14">
                    {p.user.avatarUrl && <AvatarImage src={p.user.avatarUrl} />}
                    <AvatarFallback className="text-lg font-display">
                      {(p.user.displayName || p.user.email)[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.user.displayName || p.user.email.split('@')[0]}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{p.level}</Badge>
                      {p.aiScore != null && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className={`text-sm font-bold ${scoreColor(p.aiScore)}`}>{p.aiScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {p.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </div>
                )}

                {p.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.bio}</p>
                )}

                {p.primaryRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.primaryRoles.slice(0, 3).map((r) => (
                      <Badge key={r} variant="gradient" className="text-[10px]">{r.replace('_', ' ')}</Badge>
                    ))}
                  </div>
                )}

                {p.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.skills.slice(0, 6).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-border/40 text-muted-foreground">
                  {p.linkedin && (
                    <a href={p.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {p.portfolio && (
                    <a href={p.portfolio} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {p.experienceYears > 0 && (
                    <span className="text-xs ml-auto">{p.experienceYears} yil tajriba</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
