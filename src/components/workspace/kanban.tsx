'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId: string | null;
  assignee?: { displayName?: string | null; email: string } | null;
  aiGenerated: boolean;
};

const COLUMNS = [
  { id: 'TODO' as const, label: 'To Do', gradient: 'from-slate-500 to-slate-600' },
  { id: 'IN_PROGRESS' as const, label: 'In Progress', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'DONE' as const, label: 'Done', gradient: 'from-emerald-500 to-teal-500' },
];

const PRIORITY_COLORS = {
  LOW: 'bg-slate-500/10 text-slate-500',
  MEDIUM: 'bg-blue-500/10 text-blue-500',
  HIGH: 'bg-amber-500/10 text-amber-500',
  URGENT: 'bg-rose-500/10 text-rose-500',
};

export function KanbanBoard({
  startupId,
  sprintId,
  initialTasks,
  team,
  canEdit = false,
  currentUserId,
  startupBrief,
}: {
  startupId: string;
  sprintId?: string;
  initialTasks: any[];
  team: { id: string; name: string; role: string }[];
  canEdit?: boolean;
  currentUserId?: string;
  startupBrief: { name: string; stage: string; sector: string; pitch: string };
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks as any);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  async function move(taskId: string, status: Task['status']) {
    const prev = tasks;
    setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, status } : t)));
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const e = await res.json();
      toast.error(e.error || 'Status o\'zgartirish mumkin emas');
      setTasks(prev);
    }
  }

  async function createTask(data: any) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, startupId, sprintId }),
    });
    const json = await res.json();
    if (res.ok) {
      setTasks((ts) => [json, ...ts]);
      toast.success('Vazifa qo\'shildi');
      setDialogOpen(false);
    } else {
      toast.error(json.error);
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {canEdit ? (
        <div className="px-6 py-3 border-b border-border/40 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => { setAiMode(false); setDialogOpen(true); }}>
            <Plus className="w-4 h-4" /> Vazifa qo'shish
          </Button>
          <Button variant="glow" size="sm" onClick={() => { setAiMode(true); setDialogOpen(true); }}>
            <Sparkles className="w-4 h-4" /> AI orqali yaratish
          </Button>
        </div>
      ) : (
        <div className="px-6 py-3 border-b border-border/40 text-xs text-muted-foreground">
          Faqat Founder vazifa qo'sha oladi. Siz tayinlangan vazifalarni bajaring.
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 overflow-auto">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${col.gradient}`} />
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <Badge variant="secondary" className="text-[10px]">{colTasks.length}</Badge>
                </div>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin pr-1">
                <AnimatePresence>
                  {colTasks.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      drag="y"
                      dragSnapToOrigin
                      whileDrag={{ scale: 1.05, zIndex: 10 }}
                    >
                      <TaskCard
                        task={t}
                        onMove={(s) => move(t.id, s)}
                        columns={COLUMNS.map((c) => c.id)}
                        canChangeStatus={canEdit || t.assigneeId === currentUserId}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {colTasks.length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border/50 rounded-lg">
                    Bo'sh
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        aiMode={aiMode}
        team={team}
        startupBrief={startupBrief}
        sprintGoal=""
        onCreate={createTask}
      />
    </div>
  );
}

function TaskCard({
  task,
  onMove,
  columns,
  canChangeStatus,
}: {
  task: Task;
  onMove: (s: Task['status']) => void;
  columns: Task['status'][];
  canChangeStatus: boolean;
}) {
  const next = columns[(columns.indexOf(task.status) + 1) % columns.length];
  return (
    <Card className="p-3 hover:border-primary/50 transition">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge className={PRIORITY_COLORS[task.priority] + ' text-[10px]'} variant="outline">{task.priority}</Badge>
            {task.aiGenerated && <Sparkles className="w-3 h-3 text-violet-500" />}
          </div>
          <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
          {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2 whitespace-pre-line">{task.description}</p>}
          <div className="flex items-center justify-between mt-2 gap-2">
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[10px]">{(task.assignee.displayName || task.assignee.email)[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground truncate">
                  {task.assignee.displayName || task.assignee.email?.split('@')[0]}
                </span>
              </div>
            ) : <span />}
            {canChangeStatus && task.status !== 'DONE' && (
              <button
                onClick={() => onMove(next)}
                className="text-[10px] font-medium text-primary hover:underline px-2 py-1 rounded bg-primary/10"
              >
                → {next === 'IN_PROGRESS' ? 'Boshlash' : next === 'DONE' ? 'Tugatish' : next.replace('_', ' ')}
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TaskDialog({
  open,
  onOpenChange,
  aiMode,
  team,
  startupBrief,
  sprintGoal,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  aiMode: boolean;
  team: { id: string; name: string; role: string }[];
  startupBrief: { name: string; stage: string; sector: string; pitch: string };
  sprintGoal: string;
  onCreate: (data: any) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [generating, setGenerating] = useState(false);
  const [hint, setHint] = useState('');

  async function generate() {
    if (!assigneeId) {
      toast.error('Avval xodimni tanlang');
      return;
    }
    const member = team.find((t) => t.id === assigneeId);
    setGenerating(true);
    try {
      const res = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startup: startupBrief,
          sprintGoal: sprintGoal || `Move ${startupBrief.name} forward`,
          assigneeRole: member?.role || 'DEVELOPER',
          assigneeLevel: 'MIDDLE',
          briefHint: hint,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTitle(json.title);
      setDescription(json.description);
      setPriority(json.priority);
      toast.success('AI vazifa tayyorladi');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setGenerating(false);
    }
  }

  function submit() {
    if (!title) return;
    onCreate({ title, description, priority, assigneeId, aiGenerated: aiMode && !!description });
    setTitle(''); setDescription(''); setHint('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{aiMode ? 'AI vazifa yaratish' : 'Yangi vazifa'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Xodim ({team.length} ta jamoada)</Label>
            {team.length === 0 ? (
              <div className="p-3 rounded-lg bg-accent/40 border border-border/40 text-sm text-muted-foreground">
                Jamoada hech kim yo'q. Mutaxassis qabul qiling.
              </div>
            ) : (
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger><SelectValue placeholder="Kimga..." /></SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted-foreground text-xs ml-2">{m.role.replace('_', ' ')}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {aiMode && (
            <div className="space-y-2">
              <Label>Maslahat AI uchun (ixtiyoriy)</Label>
              <Input value={hint} onChange={(e) => setHint(e.target.value)} placeholder="Login flow, auth API, ..." />
              <Button onClick={generate} disabled={generating || !assigneeId} variant="glow" className="w-full">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Vazifani yaratish</>}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Nomi</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tafsilot</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </div>
          <div className="space-y-2">
            <Label>Muhimlik</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={submit} disabled={!title} className="w-full">Yaratish</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
