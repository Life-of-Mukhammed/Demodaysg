import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users, Play, Lock, CheckCircle, Zap, Code2, Rocket } from 'lucide-react';

const VIBE_MODULES = [
  {
    number: 1,
    title: "Vibe Coding nima?",
    desc: "AI bilan birgalikda kod yozish falsafasi va asosiy tushunchalar",
    duration: "45 min",
    free: true,
    done: false,
  },
  {
    number: 2,
    title: "Claude & ChatGPT bilan ishlash",
    desc: "Prompt engineering asoslari va samarali AI so'rovlar",
    duration: "1 soat",
    free: true,
    done: false,
  },
  {
    number: 3,
    title: "Cursor IDE — AI bilan kod yozish",
    desc: "Cursor editor o'rnatish, sozlash va asosiy buyruqlar",
    duration: "1.5 soat",
    free: false,
    done: false,
  },
  {
    number: 4,
    title: "Landing Page — 1 soatda",
    desc: "Next.js + Tailwind CSS bilan tez landing page yaratish",
    duration: "2 soat",
    free: false,
    done: false,
  },
  {
    number: 5,
    title: "Backend API — AI yordamida",
    desc: "Node.js / Next.js API routes + Prisma + PostgreSQL",
    duration: "2 soat",
    free: false,
    done: false,
  },
  {
    number: 6,
    title: "Auth tizimi yaratish",
    desc: "Firebase Auth yoki NextAuth.js integratsiyasi",
    duration: "1.5 soat",
    free: false,
    done: false,
  },
  {
    number: 7,
    title: "Deploy va Production",
    desc: "Vercel, Railway, Supabase — startup-ready deployment",
    duration: "1 soat",
    free: false,
    done: false,
  },
  {
    number: 8,
    title: "MVP dan Startupga",
    desc: "Real foydalanuvchi uchun product tayyor qilish",
    duration: "2 soat",
    free: false,
    done: false,
  },
];

export default async function CoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kurslar</span>
        </div>
        <h1 className="font-display text-4xl tracking-tight">Kurslar</h1>
        <p className="text-muted-foreground">Venture Builders platformasidagi o&apos;quv kurslari</p>
      </div>

      {/* Vibe Coding Course Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40">
        <div className="h-40 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <h2 className="font-display text-2xl font-bold">Vibe Coding</h2>
              <p className="text-white/80 text-sm">AI bilan startup yaratish kursi</p>
            </div>
          </div>
          <div className="absolute bottom-5 right-6 flex items-center gap-3 text-white/90">
            <div className="text-center">
              <div className="font-display text-2xl font-bold">8</div>
              <div className="text-[10px] opacity-80">dars</div>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold">12+</div>
              <div className="text-[10px] opacity-80">soat</div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-violet-500/15 text-violet-600 border-violet-500/30">Yangi</Badge>
            <Badge variant="outline" className="text-[10px]">
              <Users className="w-3 h-3 mr-1" /> Beginner friendly
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              <Code2 className="w-3 h-3 mr-1" /> Hands-on
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
            AI vositalari (Claude, ChatGPT, Cursor) yordamida noldan startup MVP yaratishni o&apos;rganing.
            Dasturlash tajribasiz ham boshlash mumkin — AI sizning coding hamkoringiz.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="glow" className="rounded-full gap-2">
              <Play className="w-4 h-4" /> Kursni boshlash
            </Button>
            <span className="text-xs text-muted-foreground">2 ta bepul dars mavjud</span>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div>
        <h3 className="font-display text-xl tracking-tight mb-4">Kurs dasturi</h3>
        <div className="space-y-3">
          {VIBE_MODULES.map((m) => (
            <Card
              key={m.number}
              className={`soft-shadow transition-all ${m.free ? 'hover:-translate-y-0.5 hover:elevated-shadow cursor-pointer' : 'opacity-80'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-lg font-bold flex-shrink-0 ${
                    m.done
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : m.free
                      ? 'bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-600'
                      : 'bg-accent text-muted-foreground'
                  }`}>
                    {m.done ? <CheckCircle className="w-5 h-5" /> : m.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-sm">{m.title}</h4>
                      {m.free && <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">Bepul</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {m.duration}
                    </span>
                    {m.free ? (
                      <Play className="w-4 h-4 text-violet-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coming soon card */}
      <Card className="soft-shadow border-dashed">
        <CardContent className="py-10 text-center">
          <Rocket className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <h4 className="font-display text-xl tracking-tight mb-2">Ko&apos;proq kurslar yaqinda</h4>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            No-code tools, AI product management, investor pitch — yangi kurslar qo&apos;shilmoqda
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
