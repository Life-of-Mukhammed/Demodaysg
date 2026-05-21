import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { ai } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    await requireUser();
    const body = await req.json();
    const result = await ai.generateTask({
      startup: body.startup,
      sprintGoal: body.sprintGoal,
      assigneeRole: body.assigneeRole,
      assigneeLevel: body.assigneeLevel,
      briefHint: body.briefHint,
    });
    // Normalize description if AI returned an array
    const desc = Array.isArray(result.description)
      ? (result.description as string[]).map((b) => `• ${b}`).join('\n')
      : String(result.description ?? '');
    return NextResponse.json({ ...result, description: desc });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
