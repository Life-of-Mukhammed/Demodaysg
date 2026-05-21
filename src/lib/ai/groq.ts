import Groq from 'groq-sdk';

let client: Groq | null = null;

function getClient() {
  if (client) return client;
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY missing');
  client = new Groq({ apiKey: key });
  return client;
}

export async function groqJSON<T>(prompt: string, model = 'llama-3.3-70b-versatile'): Promise<T> {
  const c = getClient();
  const res = await c.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    temperature: 0.4,
    messages: [
      { role: 'system', content: 'You are a strict JSON generator. Output only valid JSON, no markdown.' },
      { role: 'user', content: prompt },
    ],
  });
  return JSON.parse(res.choices[0].message.content || '{}') as T;
}

export async function groqText(prompt: string, model = 'llama-3.3-70b-versatile'): Promise<string> {
  const c = getClient();
  const res = await c.chat.completions.create({
    model,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.choices[0].message.content || '';
}
