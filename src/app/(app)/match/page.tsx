'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart, X, Sparkles, MapPin, Briefcase, Github, Linkedin, Globe, Loader2, Send,
  Rocket, AlertCircle, Coins, Zap,
} from 'lucide-react';
import { scoreColor } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Mode = 'startup-finds-specialist' | 'specialist-finds-listing' | 'founder-no-startup';
type Item = any;

export default function MatchPage() {
  const params = useSearchParams();
  const startupId = params.get('startup');
  const [data, setData] = useState<{ mode: Mode; items: Item[]; startupName?: string; needsStartup?: boolean; needsEval?: boolean }>({ mode: 'specialist-finds-listing', items: [] });
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applyDialog, setApplyDialog] = useState<Item | null>(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchedName, setMatchedName] = useState('');

  async function load() {
    setLoading(true);
    const url = startupId ? `/api/match/candidates?startup=${startupId}` : '/api/match/candidates';
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
    setIndex(0);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [startupId]);

  const current = data.items[index];

  async function onSwipe(direction: 'LIKE' | 'PASS') {
    if (!current) return;
    if (data.mode === 'startup-finds-specialist') {
      const body = { targetUserId: current.user.id, startupId: startupId || (data as any).startupId, direction };
      const res = await fetch('/api/match/swipe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setIndex((i) => i + 1);
      if (json.match) {
        setMatchedName(current.user?.displayName || current.user?.email || 'New match');
        setMatchOpen(true);
      }
    } else {
      if (direction === 'PASS') setIndex((i) => i + 1);
      else setApplyDialog(current);
    }
  }

  async function submitApplication(message: string) {
    if (!applyDialog) return;
    const res = await fetch(`/api/listings/${applyDialog.id}/apply`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (res.ok) {
      toast.success("Ariza yuborildi! Founder bildirishnoma oldi.");
      setApplyDialog(null);
      setIndex((i) => i + 1);
    } else {
      const j = await res.json();
      toast.error(j.error || 'Xato');
    }
  }

  if (loading) {
    return (
      <div className="container max-w-md py-12 text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (data.mode === 'founder-no-startup') {
    return (
      <div className="container max-w-md py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4">
          {data.needsStartup ? <Rocket className="w-9 h-9 text-primary" /> : <AlertCircle className="w-9 h-9 text-primary" />}
        </div>
        {data.needsStartup ? (
          <>
            <h2 className="font-display text-3xl tracking-tight">Avval startup yarating</h2>
            <p className="text-muted-foreground mt-2">Mutaxassis topish uchun avval startup'ingiz bo'lishi kerak. AI baholaydi va sizga mos mutaxassislarni topadi.</p>
            <Button asChild className="mt-6 rounded-full" variant="brand">
              <Link href="/startups/new">Startup yaratish</Link>
            </Button>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl tracking-tight">AI baholash kutilmoqda</h2>
            <p className="text-muted-foreground mt-2">Startup'ingiz AI baholashidan o'tmoqda. Bir necha soniyadan keyin qayta urinib ko'ring.</p>
            <Button onClick={load} className="mt-6 rounded-full" variant="outline">Qayta yuklash</Button>
          </>
        )}
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container max-w-md py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-9 h-9 text-primary" />
        </div>
        <h2 className="font-display text-3xl tracking-tight">
          {data.mode === 'startup-finds-specialist' ? "Hozircha boshqa nomzod yo'q" : "Hozircha boshqa vakansiya yo'q"}
        </h2>
        <p className="text-muted-foreground mt-2">Birozdan keyin qayta keling</p>
        <Button onClick={load} className="mt-6 rounded-full" variant="outline">Qayta yuklash</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-8 select-none">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl tracking-tight">
          {data.mode === 'startup-finds-specialist' ? 'Mutaxassis topish' : 'Vakansiya topish'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data.startupName && `${data.startupName} uchun · `}
          {data.items.length - index} ta qoldi
        </p>
      </div>

      <div className="relative h-[620px]">
        <AnimatePresence>
          {[data.items[index + 2], data.items[index + 1], current].filter(Boolean).map((item, i) => (
            <SwipeCard
              key={item.id + index}
              item={item}
              mode={data.mode}
              top={i === 2}
              offset={2 - i}
              onSwipe={i === 2 ? onSwipe : undefined}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={() => onSwipe('PASS')}
          className="w-16 h-16 rounded-full bg-card border-2 border-border hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all soft-shadow flex items-center justify-center group"
        >
          <X className="w-7 h-7 text-rose-500 group-hover:scale-110 transition" />
        </button>
        <button
          onClick={() => onSwipe('LIKE')}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 elevated-shadow hover:shadow-2xl flex items-center justify-center group transition-all"
        >
          {data.mode === 'specialist-finds-listing'
            ? <Send className="w-8 h-8 text-white group-hover:scale-110 transition" />
            : <Heart className="w-9 h-9 text-white fill-white group-hover:scale-110 transition" />}
        </button>
      </div>

      <ApplyDialog listing={applyDialog} onClose={() => setApplyDialog(null)} onSubmit={submitApplication} />

      <Dialog open={matchOpen} onOpenChange={setMatchOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogTitle className="sr-only">Match</DialogTitle>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="py-6">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="font-display text-3xl tracking-tight text-gradient">Match!</h2>
            <p className="text-muted-foreground mt-2">Siz va {matchedName} bir-biringizni yoqdingiz</p>
            <Button onClick={() => setMatchOpen(false)} className="mt-6 w-full" variant="glow">Davom etish</Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SwipeCard({ item, mode, top, offset, onSwipe }: {
  item: Item; mode: Mode; top: boolean; offset: number; onSwipe?: (dir: 'LIKE' | 'PASS') => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, -50], [1, 0]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 120) onSwipe?.(info.offset.x > 0 ? 'LIKE' : 'PASS');
  }

  return (
    <motion.div
      drag={top ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      style={{ x, rotate }}
      initial={{ scale: 1 - offset * 0.05, y: offset * 12, opacity: top ? 1 : 0.55 }}
      animate={{ scale: 1 - offset * 0.05, y: offset * 12, opacity: top ? 1 : 0.55 }}
      exit={{ x: 400, opacity: 0, transition: { duration: 0.2 } }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <Card className="relative h-full overflow-hidden bg-card elevated-shadow border-border/40">
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-6 z-20 pointer-events-none">
          <div className="bg-emerald-500 text-white text-2xl font-display tracking-wider px-5 py-2 rounded-xl rotate-[-12deg] border-4 border-white shadow-2xl">
            {mode === 'specialist-finds-listing' ? 'APPLY' : 'LIKE'}
          </div>
        </motion.div>
        <motion.div style={{ opacity: passOpacity }} className="absolute top-8 right-6 z-20 pointer-events-none">
          <div className="bg-rose-500 text-white text-2xl font-display tracking-wider px-5 py-2 rounded-xl rotate-[12deg] border-4 border-white shadow-2xl">PASS</div>
        </motion.div>

        {mode === 'startup-finds-specialist' ? <SpecialistContent item={item} /> : <ListingContent item={item} />}
      </Card>
    </motion.div>
  );
}

function SpecialistContent({ item }: { item: Item }) {
  return (
    <>
      <div className="h-44 relative bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
      </div>
      <div className="px-6 pb-6 -mt-14 relative">
        <Avatar className="w-28 h-28 border-4 border-card mx-auto soft-shadow">
          {item.user?.avatarUrl && <AvatarImage src={item.user.avatarUrl} />}
          <AvatarFallback className="text-3xl">{(item.user?.displayName || item.user?.email || '?')[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-center mt-4">
          <h3 className="font-display text-2xl tracking-tight">{item.user?.displayName || item.user?.email}</h3>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
            {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>}
            {item.level && <Badge variant="outline" className="text-[10px]">{item.level}</Badge>}
          </div>
        </div>

        {item.aiScore != null && (
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-primary/20 w-full justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className={`font-display text-3xl ${scoreColor(item.aiScore)}`}>{item.aiScore}</span>
            <span className="text-xs text-muted-foreground">AI Score</span>
          </div>
        )}

        {item.primaryRoles?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {item.primaryRoles.slice(0, 3).map((r: string) => (
              <Badge key={r} variant="gradient" className="text-[10px]">{r.replace('_', ' ')}</Badge>
            ))}
          </div>
        )}

        {item.bio && <p className="mt-4 text-sm text-muted-foreground line-clamp-3 text-center">{item.bio}</p>}

        {item.skills?.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {item.skills.slice(0, 8).map((s: string) => (
                <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2 justify-center">
          {item.linkedin && <a href={item.linkedin} target="_blank" className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent flex items-center justify-center transition"><Linkedin className="w-4 h-4" /></a>}
          {item.github && <a href={item.github} target="_blank" className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent flex items-center justify-center transition"><Github className="w-4 h-4" /></a>}
          {item.portfolio && <a href={item.portfolio} target="_blank" className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent flex items-center justify-center transition"><Globe className="w-4 h-4" /></a>}
        </div>
      </div>
    </>
  );
}

function ListingContent({ item }: { item: Item }) {
  const TYPE_COLORS: Record<string, string> = {
    FULL_TIME: 'from-emerald-500 to-teal-500',
    CONTRACT: 'from-orange-500 to-amber-500',
    COFOUNDER: 'from-violet-500 to-purple-500',
    ADVISOR: 'from-blue-500 to-cyan-500',
  };
  const typeGrad = TYPE_COLORS[item.type] || 'from-orange-500 to-amber-500';

  return (
    <>
      <div className={`h-48 relative bg-gradient-to-br ${typeGrad} overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full bg-white/15 blur-xl" />

        <div className="relative h-full flex flex-col justify-end p-5">
          <div className="text-white/80 text-xs font-medium uppercase tracking-widest mb-1">
            {item.type.replace('_', ' ')} · {item.level}
          </div>
          <div className="text-white font-display text-3xl tracking-tight leading-tight">{item.title}</div>
          <div className="mt-2 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/90 text-sm font-medium">{item.role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-5 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/40 border border-border/40">
          <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${typeGrad} flex items-center justify-center text-white font-display text-xl soft-shadow`}>
            {item.startup.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate text-sm">{item.startup.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px]">{item.startup.sector}</Badge>
              <Badge variant="outline" className="text-[10px]">{item.startup.stage?.replace('_', ' ')}</Badge>
            </div>
          </div>
          {item.startup.aiScore != null && (
            <div className="flex flex-col items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className={`font-display text-xl ${scoreColor(item.startup.aiScore)}`}>{item.startup.aiScore}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {item.equity != null && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <Coins className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-[9px] uppercase text-muted-foreground font-semibold">Equity</div>
                <div className="text-sm font-bold">{item.equity}%</div>
              </div>
            </div>
          )}
          {item.remote && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <Globe className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-[9px] uppercase text-muted-foreground font-semibold">Remote</div>
                <div className="text-sm font-bold">Worldwide</div>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>

        {item.skills?.length > 0 && (
          <div>
            <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Required skills
            </div>
            <div className="flex flex-wrap gap-1">
              {item.skills.slice(0, 8).map((s: string) => (
                <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ApplyDialog({ listing, onClose, onSubmit }: { listing: Item | null; onClose: () => void; onSubmit: (msg: string) => Promise<void> }) {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await onSubmit(msg);
    setLoading(false);
    setMsg('');
  }

  return (
    <Dialog open={!!listing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="font-display text-2xl tracking-tight">
          {listing?.startup.name} — biz bilan ishlashni xohlaysizmi?
        </DialogTitle>
        <div className="space-y-4 mt-4">
          <div className="p-3 rounded-lg border border-border/40 bg-accent/30">
            <div className="text-sm font-semibold">{listing?.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{listing?.role.replace('_', ' ')} · {listing?.level}</div>
          </div>
          <div className="space-y-2">
            <Label>Founder uchun xabar <span className="text-xs text-muted-foreground">— ixtiyoriy</span></Label>
            <Textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="O'zingiz haqida qisqacha, nima uchun bu vakansiya sizga mos..." />
          </div>
          <Button onClick={submit} disabled={loading} variant="brand" className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Ariza yuborish</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
