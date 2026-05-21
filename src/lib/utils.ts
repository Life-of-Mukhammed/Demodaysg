import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | null | undefined): string {
  if (score == null) return '—';
  return String(Math.round(score));
}

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return 'text-muted-foreground';
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-violet-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-rose-500';
}

export function scoreCategory(score: number): string {
  if (score >= 85) return 'VC Backable';
  if (score >= 70) return 'High Potential';
  if (score >= 55) return 'Promising';
  if (score >= 40) return 'Average';
  return 'Weak';
}

export function levelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpToNextLevel(xp: number): number {
  const lvl = levelFromXP(xp);
  const next = lvl * lvl * 100;
  return Math.max(0, next - xp);
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}
