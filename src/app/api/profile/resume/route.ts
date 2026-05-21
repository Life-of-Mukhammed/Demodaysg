import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import pdf from 'pdf-parse';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await requireUser();
    const fd = await req.formData();
    const file = fd.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    const parsed = await pdf(buf);
    return NextResponse.json({ text: parsed.text.slice(0, 20000) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
