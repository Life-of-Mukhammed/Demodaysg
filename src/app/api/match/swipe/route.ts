import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { recordSwipe } from '@/lib/matching';
import { awardBadge } from '@/lib/gamification';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const result = await recordSwipe({
      swiperId: user.id,
      targetUserId: body.targetUserId,
      startupId: body.startupId,
      direction: body.direction,
    });
    if (result.match) await awardBadge(user.id, 'first_match');
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
