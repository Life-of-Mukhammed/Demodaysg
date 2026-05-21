'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, ShieldCheck, ShieldOff, Trash2, UserPlus, Crown, GraduationCap, Briefcase, Rocket } from 'lucide-react';
import { scoreColor } from '@/lib/utils';

const ROLES = ['ALL', 'FOUNDER', 'SPECIALIST', 'MENTOR', 'ADMIN'];
const ROLE_ICONS: Record<string, any> = { FOUNDER: Rocket, SPECIALIST: Briefcase, MENTOR: GraduationCap, ADMIN: Crown };

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (role !== 'ALL') params.set('role', role);
    const res = await fetch(`/api/admin/users?${params}`);
    setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [role]);

  async function updateUser(id: string, data: any) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success('Updated');
      load();
    } else toast.error('Failed');
  }

  async function deleteUser(id: string) {
    if (!confirm('Foydalanuvchini o\'chirishni tasdiqlaysizmi?')) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      load();
    } else toast.error('Failed');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Email yoki ism qidirish..."
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r === 'ALL' ? 'Barcha rollar' : r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="brand" onClick={() => setCreateOpen(true)}><UserPlus className="w-4 h-4" /> Yangi</Button>
      </div>

      <Card className="soft-shadow overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Yuklanmoqda...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Foydalanuvchi topilmadi</div>
          ) : (
            <div className="divide-y divide-border/40">
              {users.map((u) => {
                const Icon = ROLE_ICONS[u.primaryRole] || Briefcase;
                return (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/30 transition">
                    <Avatar className="w-10 h-10">
                      {u.avatarUrl && <AvatarImage src={u.avatarUrl} />}
                      <AvatarFallback>{(u.displayName || u.email)[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium truncate">{u.displayName || u.email.split('@')[0]}</div>
                        {u.isAdmin && <Badge variant="destructive" className="text-[10px]">ADMIN</Badge>}
                        {u.verifiedFounder && <Badge variant="success" className="text-[10px]">✓ Verified</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>

                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <Icon className="w-3 h-3" /> {u.primaryRole}
                    </Badge>

                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                      <div>L{u.level}</div>
                      <div>{u.xp} XP</div>
                      {u.specialistProfile?.aiScore != null && (
                        <div className={`font-bold ${scoreColor(u.specialistProfile.aiScore)}`}>{u.specialistProfile.aiScore}</div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Rolni o'zgartirish</DropdownMenuLabel>
                        {['FOUNDER', 'SPECIALIST', 'MENTOR'].map((r) => (
                          <DropdownMenuItem key={r} onClick={() => updateUser(u.id, { primaryRole: r })} disabled={u.primaryRole === r}>
                            {r}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateUser(u.id, { isAdmin: !u.isAdmin })}>
                          {u.isAdmin ? <><ShieldOff className="w-4 h-4" /> Admin'dan olib tashlash</> : <><ShieldCheck className="w-4 h-4" /> Admin qilish</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateUser(u.id, { verifiedFounder: !u.verifiedFounder })}>
                          {u.verifiedFounder ? 'Verified olib tashlash' : 'Verify qilish'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteUser(u.id)} className="text-rose-500 focus:text-rose-500">
                          <Trash2 className="w-4 h-4" /> O'chirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserDialog open={createOpen} onClose={() => { setCreateOpen(false); load(); }} />
    </div>
  );
}

function CreateUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ email: '', displayName: '', primaryRole: 'FOUNDER', isAdmin: false });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      toast.success('Foydalanuvchi yaratildi');
      setForm({ email: '', displayName: '', primaryRole: 'FOUNDER', isAdmin: false });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Yangi foydalanuvchi</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Ismi</Label><Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={form.primaryRole} onValueChange={(v) => setForm({ ...form, primaryRole: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['FOUNDER', 'SPECIALIST', 'MENTOR'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Foydalanuvchi shu email bilan o'zi signup qilishi kerak. Bu rol va boshqa ma'lumotlarni oldindan tayyorlaydi.
          </p>
          <Button onClick={submit} disabled={loading || !form.email} className="w-full">
            {loading ? 'Yaratilmoqda...' : 'Yaratish'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
