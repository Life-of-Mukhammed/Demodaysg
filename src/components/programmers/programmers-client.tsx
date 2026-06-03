'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Users, Sparkles, MapPin, Github, Linkedin, Globe, X,
  Briefcase, Calendar, Building2, ChevronRight,
} from 'lucide-react';
import { scoreColor } from '@/lib/utils';

const FILTER_OPTIONS = [
  { label: 'Hammasi', value: null },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Fullstack', value: 'Fullstack' },
  { label: 'Mobile', value: 'Mobile' },
  { label: 'Designer', value: 'Designer' },
  { label: 'AI / ML', value: 'AI/ML' },
  { label: 'Product Manager', value: 'Product Manager' },
];

type WorkExp = { company: string; position: string; duration: string; projects: string[] };

type Profile = {
  id: string;
  bio: string | null;
  developerType: string | null;
  location: string | null;
  experienceYears: number;
  level: string;
  primaryRoles: string[];
  skills: string[];
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  aiScore: number | null;
  workExperience: WorkExp[] | null;
  user: { id: string; displayName: string | null; email: string; avatarUrl: string | null };
};

export function ProgrammersClient({ profiles }: { profiles: Profile[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Profile | null>(null);

  const filtered = filter
    ? profiles.filter((p) => p.developerType === filter)
    : profiles;

  const getName = (p: Profile) => p.user.displayName || p.user.email.split('@')[0];
  const getInitial = (p: Profile) => getName(p)[0]?.toUpperCase();

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === opt.value
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'border-border/60 hover:border-primary/40 hover:bg-accent/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="soft-shadow">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mx-auto mb-5">
              <Users className="w-9 h-9 text-primary" />
            </div>
            <h3 className="font-display text-3xl tracking-tight mb-2">Dasturchi topilmadi</h3>
            <p className="text-sm text-muted-foreground">Bu turdagi dasturchilar hali qo&apos;shilmagan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="soft-shadow hover:elevated-shadow hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => setSelected(p)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-14 h-14 rounded-full border-2 border-border/30">
                    {p.user.avatarUrl && <AvatarImage src={p.user.avatarUrl} className="rounded-full object-cover" />}
                    <AvatarFallback className="rounded-full text-lg font-display bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                      {getInitial(p)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{getName(p)}</div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px]">{p.level}</Badge>
                      {p.developerType && (
                        <Badge variant="secondary" className="text-[10px]">{p.developerType}</Badge>
                      )}
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
                    <a href={p.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-primary transition">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-primary transition">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {p.portfolio && (
                    <a href={p.portfolio} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-primary transition">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {p.experienceYears > 0 && (
                    <span className="text-xs ml-auto">{p.experienceYears} yil tajriba</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Profile Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0">
          {selected && <ProfileDetail profile={selected} onClose={() => setSelected(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProfileDetail({ profile: p, onClose }: { profile: Profile; onClose: () => void }) {
  const getName = () => p.user.displayName || p.user.email.split('@')[0];
  const workExp = (p.workExperience as WorkExp[] | null) || [];

  return (
    <div>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-orange-500/10 via-amber-500/8 to-rose-500/8 p-6 pb-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg">
            {p.user.avatarUrl && <AvatarImage src={p.user.avatarUrl} className="rounded-full object-cover" />}
            <AvatarFallback className="rounded-full text-2xl font-display bg-gradient-to-br from-orange-400 to-amber-500 text-white">
              {getName()[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-2xl tracking-tight">{getName()}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline">{p.level}</Badge>
              {p.developerType && <Badge variant="secondary">{p.developerType}</Badge>}
              {p.aiScore != null && (
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className={`font-bold ${scoreColor(p.aiScore)}`}>{p.aiScore}</span>
                </div>
              )}
            </div>
            {p.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" /> {p.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Bio */}
        {p.bio && (
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
          </div>
        )}

        {/* Roles */}
        {p.primaryRoles.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rollar</h3>
            <div className="flex flex-wrap gap-1.5">
              {p.primaryRoles.map((r) => (
                <Badge key={r} variant="gradient">{r.replace('_', ' ')}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {p.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Ko&apos;nikmalar</h3>
            <div className="flex flex-wrap gap-1.5">
              {p.skills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {p.experienceYears > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{p.experienceYears} yil umumiy tajriba</span>
          </div>
        )}

        {/* Work Experience */}
        {workExp.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Ish tajribasi</h3>
            <div className="space-y-3">
              {workExp.map((exp, i) => (
                <div key={i} className="border border-border/40 rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{exp.position}</div>
                      <div className="text-sm text-muted-foreground">{exp.company}</div>
                    </div>
                  </div>
                  {exp.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 ml-6">
                      <Calendar className="w-3 h-3" /> {exp.duration}
                    </div>
                  )}
                  {exp.projects.filter(Boolean).length > 0 && (
                    <ul className="mt-2 ml-6 space-y-1">
                      {exp.projects.filter(Boolean).map((proj, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-1">•</span> {proj}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(p.linkedin || p.github || p.portfolio) && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Havolalar</h3>
            <div className="flex flex-wrap gap-2">
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </Button>
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </Button>
                </a>
              )}
              {p.portfolio && (
                <a href={p.portfolio} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
