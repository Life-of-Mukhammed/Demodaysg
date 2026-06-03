'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/page-header';
import {
  Rocket, Users, Trophy, Flame, Plus, ArrowRight,
  Activity, Sparkles, Wand2, FileText, Upload, Trash2,
  RefreshCw, Loader2, UserCircle2, X, Check,
} from 'lucide-react';
import { formatScore, scoreColor, scoreCategory, xpToNextLevel } from '@/lib/utils';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

type Startup = {
  id: string; name: string; stage: string; pitch: string;
  aiScore: number | null; members: any[]; sprints: any[];
  _count: { tasks: number };
  pitchDeckUrl: string | null; pitchDeckName: string | null; pitchDeckUploadedAt: string | null;
};
type Member = { id: string; userId: string; role: string; equity: number | null; user: { displayName: string | null; email: string; avatarUrl: string | null } };
type Badge_ = { id: string; badge: { icon: string; name: string } };

export function FounderDashboard({ user, startups, streak, badges, teamMembers }: {
  user: any;
  startups: Startup[];
  streak: any;
  badges: Badge_[];
  teamMembers: Record<string, Member[]>;
}) {
  return (
    <div className="container max-w-7xl py-6 md:py-8 space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Founder Dashboard"
        icon={<Rocket />}
        title={`Salom, ${user.displayName || user.email.split('@')[0]} 👋`}
        subtitle="Sizning startup operatsion markaziz. AI baholash, jamoa va pitch tayyorlash — bir joyda."
        action={
          <Button asChild variant="glow" size="lg" className="rounded-full">
            <Link href="/startups/new"><Plus className="w-4 h-4" /> Yangi startup</Link>
          </Button>
        }
      />

      {/* KPI row — 3 cards (Sprints removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard icon={Rocket} label="Startups" value={String(startups.length)} sub="Aktiv" gradient="from-orange-500 to-amber-500" />
        <KpiCard icon={Flame} label="Streak" value={`${streak?.currentDays || 0}d`} sub={`Top: ${streak?.longestDays || 0}d`} gradient="from-rose-500 to-orange-500" />
        <KpiCard icon={Trophy} label={`Level ${user.level}`} value={`${user.xp} XP`} sub={`${xpToNextLevel(user.xp)} XP to next`} gradient="from-emerald-500 to-teal-500" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <StartupsCard startups={startups} />
          {startups[0] && (
            <>
              <PitchDeckCard startup={startups[0]} />
              <TeamEquityCard startup={startups[0]} members={teamMembers[startups[0].id] || []} founderName={user.displayName || user.email.split('@')[0]} />
            </>
          )}
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          <BadgesCard badges={badges} />
          <QuickLinksCard />
        </div>
      </div>
    </div>
  );
}

// ─── Startups Card ─────────────────────────────────────────────────────────────

function StartupsCard({ startups }: { startups: Startup[] }) {
  return (
    <Card className="soft-shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-base">Sizning startuplaringiz</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/startups" className="gap-1">Hammasi <ArrowRight className="w-3 h-3" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {startups.length === 0 ? (
          <EmptyStartups />
        ) : (
          <div className="space-y-3">
            {startups.slice(0, 5).map((s) => (
              <Link key={s.id} href={`/startups/${s.id}`} className="block group">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-accent/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center font-display text-xl shrink-0">
                    {s.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate group-hover:text-primary transition">{s.name}</h4>
                      <Badge variant="outline" className="text-[10px] shrink-0">{s.stage}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-2">{s.pitch}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.members.length + 1}</span>
                      <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{s.sprints.length} aktiv</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-display text-2xl ${scoreColor(s.aiScore)}`}>{formatScore(s.aiScore)}</div>
                    <div className="text-[10px] text-muted-foreground">{s.aiScore != null ? scoreCategory(s.aiScore) : 'eval...'}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Pitch Deck Card ────────────────────────────────────────────────────────────

function PitchDeckCard({ startup }: { startup: Startup }) {
  const [uploading, setUploading] = useState(false);
  const [deckUrl, setDeckUrl] = useState(startup.pitchDeckUrl);
  const [deckName, setDeckName] = useState(startup.pitchDeckName);
  const [deckDate, setDeckDate] = useState(startup.pitchDeckUploadedAt);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const storageInstance = storage();
      if (!storageInstance) throw new Error('Storage unavailable');
      const fileRef2 = ref(storageInstance, `pitch-decks/${startup.id}/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef2, file);
      const url = await getDownloadURL(fileRef2);

      const res = await fetch('/api/startups/pitch-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId: startup.id, pitchDeckUrl: url, pitchDeckName: file.name }),
      });
      if (!res.ok) throw new Error('Saqlashda xato');
      setDeckUrl(url);
      setDeckName(file.name);
      setDeckDate(new Date().toISOString());
      toast.success('Pitch deck yuklandi!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch('/api/startups/pitch-deck', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId: startup.id }),
      });
      setDeckUrl(null); setDeckName(null); setDeckDate(null);
      toast.success("Pitch deck o'chirildi");
    } catch {
      toast.error('Xato yuz berdi');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="soft-shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-base">Pitch Deck</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.pptx,.ppt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        />

        {deckUrl ? (
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-accent/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{deckName}</p>
              {deckDate && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(deckDate).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
              <a href={deckUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                Ko&apos;rish →
              </a>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="icon"
                variant="outline"
                className="w-8 h-8"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                title="Almashtirish"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-8 h-8 text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={deleting}
                title="O'chirish"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-border/40 rounded-xl hover:border-blue-300/60 transition">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-500/60" />
            </div>
            <p className="text-sm font-medium mb-1">Pitch deck yuklang</p>
            <p className="text-xs text-muted-foreground mb-4">.pdf yoki .pptx format qabul qilinadi</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Team & Equity Card ─────────────────────────────────────────────────────────

function TeamEquityCard({ startup, members, founderName }: { startup: Startup; members: Member[]; founderName: string }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [equityInputs, setEquityInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const totalMemberEquity = members.reduce((sum, m) => sum + (m.equity || 0), 0);
  const founderEquity = Math.max(0, 100 - totalMemberEquity);

  const COLORS = ['from-orange-500 to-amber-500', 'from-violet-500 to-fuchsia-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500'];

  const saveEquity = async (memberId: string) => {
    setSaving(true);
    try {
      await fetch('/api/startups/equity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, equity: +(equityInputs[memberId] || 0) }),
      });
      toast.success('Yangilandi');
      setEditing(null);
    } catch {
      toast.error('Xato');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="soft-shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-base">Jamoa & Ulushlar</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/startups/${startup.id}`} className="gap-1">Boshqarish <ArrowRight className="w-3 h-3" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        {/* Visual equity bar */}
        <div>
          <div className="flex rounded-full overflow-hidden h-3 mb-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
              style={{ width: `${founderEquity}%` }}
              title={`Founder: ${founderEquity.toFixed(1)}%`}
            />
            {members.map((m, i) => (
              <div
                key={m.id}
                className={`bg-gradient-to-r ${COLORS[(i + 1) % COLORS.length]} transition-all`}
                style={{ width: `${m.equity || 0}%` }}
                title={`${m.user.displayName || m.user.email}: ${m.equity || 0}%`}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-amber-500 inline-block" />
              {founderName} ({founderEquity.toFixed(1)}%)
            </span>
            {members.map((m, i) => (
              <span key={m.id} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm bg-gradient-to-r ${COLORS[(i + 1) % COLORS.length]} inline-block`} />
                {m.user.displayName || m.user.email.split('@')[0]} ({(m.equity || 0).toFixed(1)}%)
              </span>
            ))}
          </div>
        </div>

        {/* Team list */}
        <div className="space-y-2">
          {/* Founder row */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {founderName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{founderName}</p>
              <p className="text-xs text-muted-foreground">Founder</p>
            </div>
            <div className="text-sm font-semibold text-primary">{founderEquity.toFixed(1)}%</div>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Hali jamoa a&apos;zolari yo&apos;q</p>
          ) : (
            members.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-accent/20 transition">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${COLORS[(i + 1) % COLORS.length]} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                  {(m.user.displayName || m.user.email)[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.user.displayName || m.user.email.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground">{m.role.replace('_', ' ')}</p>
                </div>
                {editing === m.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={equityInputs[m.id] ?? (m.equity || 0)}
                      onChange={(e) => setEquityInputs((s) => ({ ...s, [m.id]: e.target.value }))}
                      className="w-16 text-sm text-right border border-border rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs">%</span>
                    <button onClick={() => saveEquity(m.id)} disabled={saving} className="w-7 h-7 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 flex items-center justify-center text-emerald-600 transition">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setEditing(null)} className="w-7 h-7 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center text-destructive transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditing(m.id); setEquityInputs((s) => ({ ...s, [m.id]: String(m.equity || 0) })); }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {(m.equity || 0).toFixed(1)}%
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Badges Card ────────────────────────────────────────────────────────────────

function BadgesCard({ badges }: { badges: Badge_[] }) {
  return (
    <Card className="soft-shadow">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="w-4 h-4 text-amber-500" /> Yutuqlar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {badges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Startup yarating va sprint tugating</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {badges.map((ub) => (
              <div key={ub.id} className="text-center p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="text-3xl">{ub.badge.icon}</div>
                <div className="text-[10px] text-muted-foreground mt-1 truncate">{ub.badge.name}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Quick Links Card ───────────────────────────────────────────────────────────

function QuickLinksCard() {
  return (
    <Card className="soft-shadow">
      <CardContent className="p-4 space-y-1">
        <Link href="/programmers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500/15 to-orange-500/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Dasturchi topish</div>
            <div className="text-[10px] text-muted-foreground">Dasturchilar ro&apos;yxati</div>
          </div>
          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition" />
        </Link>
        <Link href="/applications" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center shrink-0">
            <Wand2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Arizalar</div>
            <div className="text-[10px] text-muted-foreground">Kelgan arizalarni ko&apos;rish</div>
          </div>
          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition" />
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────────

function EmptyStartups() {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5 soft-shadow">
        <Rocket className="w-9 h-9 text-primary" />
      </div>
      <h3 className="font-display text-3xl tracking-tight mb-2">Birinchi startup&apos;ingiz</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">AI g&apos;oyangizni baholaydi va sizga mos jamoa quradi</p>
      <Button asChild className="mt-6 rounded-full" variant="brand">
        <Link href="/startups/new">Yaratish boshlash</Link>
      </Button>
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, gradient }: any) {
  return (
    <Card className="relative overflow-hidden group hover:-translate-y-1 transition soft-shadow hover:elevated-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.08] transition`} />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center soft-shadow group-hover:scale-110 transition`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold">{label}</div>
        <div className="font-display text-3xl tracking-tight mt-1">{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}
