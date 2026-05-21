'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, Check, X, Sparkles, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';
import { scoreColor, timeAgo } from '@/lib/utils';

const STATUS_COLORS: Record<string, any> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'destructive',
};

export default function ApplicationsPage() {
  const [data, setData] = useState<{ role: string; items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/applications');
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function decide(id: string, status: 'accepted' | 'rejected') {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(status === 'accepted' ? 'Qabul qilindi! Specialist jamoaga qo\'shildi.' : 'Rad etildi');
      load();
    } else {
      toast.error('Xato');
    }
  }

  if (loading) {
    return <div className="container max-w-4xl py-8"><div className="h-32 rounded-xl animate-shimmer-bg" /></div>;
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-9 h-9 text-primary" />
        </div>
        <h2 className="font-display text-3xl tracking-tight">
          {data?.role === 'SPECIALIST' ? 'Hali ariza yubormagansiz' : 'Hali ariza yo\'q'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {data?.role === 'SPECIALIST'
            ? 'Match sahifasidan vakansiyalarga ariza yuboring'
            : 'Vakansiyalaringizga arizalar shu yerda paydo bo\'ladi'}
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight">
          {data.role === 'SPECIALIST' ? 'Mening arizalarim' : 'Kelgan arizalar'}
        </h1>
        <p className="text-muted-foreground mt-1">{data.items.length} ta ariza</p>
      </div>

      <div className="space-y-3">
        {data.items.map((a) =>
          data.role === 'SPECIALIST'
            ? <SpecialistApplicationCard key={a.id} app={a} />
            : <FounderApplicationCard key={a.id} app={a} onDecide={decide} />
        )}
      </div>
    </div>
  );
}

function FounderApplicationCard({ app, onDecide }: { app: any; onDecide: (id: string, status: 'accepted' | 'rejected') => void }) {
  const u = app.user;
  const profile = u.specialistProfile;

  return (
    <Card className="soft-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-14 h-14">
            {u.avatarUrl && <AvatarImage src={u.avatarUrl} />}
            <AvatarFallback>{(u.displayName || u.email)[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-semibold">{u.displayName || u.email.split('@')[0]}</div>
              {profile?.aiScore != null && (
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className={`text-sm font-bold ${scoreColor(profile.aiScore)}`}>{profile.aiScore}</span>
                </div>
              )}
              <Badge variant={STATUS_COLORS[app.status] || 'secondary'} className="text-[10px] capitalize">{app.status}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {u.email} · {timeAgo(app.createdAt)}
            </div>
            <div className="text-sm font-medium">
              📌 {app.listing.title} <span className="text-muted-foreground">— {app.listing.startup.name}</span>
            </div>
            {profile?.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{profile.bio}</p>}
            {profile?.primaryRoles?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.primaryRoles.slice(0, 3).map((r: string) => (
                  <Badge key={r} variant="gradient" className="text-[10px]">{r.replace('_', ' ')}</Badge>
                ))}
              </div>
            )}
            {profile?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.skills.slice(0, 8).map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                ))}
              </div>
            )}
            {app.message && (
              <div className="mt-3 p-3 rounded-lg bg-accent/40 border border-border/40">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Xabar</div>
                <p className="text-sm">{app.message}</p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs">
              {profile?.linkedin && <a href={profile.linkedin} target="_blank" className="text-muted-foreground hover:text-primary"><Linkedin className="w-4 h-4" /></a>}
              {profile?.github && <a href={profile.github} target="_blank" className="text-muted-foreground hover:text-primary"><Github className="w-4 h-4" /></a>}
              {profile?.portfolio && <a href={profile.portfolio} target="_blank" className="text-muted-foreground hover:text-primary"><Globe className="w-4 h-4" /></a>}
            </div>
          </div>
          {app.status === 'pending' && (
            <div className="flex flex-col gap-2">
              <Button onClick={() => onDecide(app.id, 'accepted')} variant="brand" size="sm"><Check className="w-4 h-4" /> Qabul</Button>
              <Button onClick={() => onDecide(app.id, 'rejected')} variant="outline" size="sm"><X className="w-4 h-4" /> Rad etish</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SpecialistApplicationCard({ app }: { app: any }) {
  return (
    <Card className="soft-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-xl">
          {app.listing.startup.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold">{app.listing.title}</div>
            <Badge variant={STATUS_COLORS[app.status] || 'secondary'} className="text-[10px] capitalize">{app.status}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">{app.listing.startup.name} · {timeAgo(app.createdAt)}</div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="text-[10px]">{app.listing.role.replace('_', ' ')}</Badge>
            <Badge variant="outline" className="text-[10px]">{app.listing.level}</Badge>
            <Badge variant="outline" className="text-[10px]">{app.listing.startup.sector}</Badge>
          </div>
          {app.message && (
            <div className="mt-3 p-3 rounded-lg bg-accent/40 border border-border/40">
              <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Sizning xabaringiz</div>
              <p className="text-sm">{app.message}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
