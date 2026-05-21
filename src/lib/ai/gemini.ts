import { GoogleGenerativeAI } from '@google/generative-ai';

let client: GoogleGenerativeAI | null = null;

function getClient() {
  if (client) return client;
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');
  client = new GoogleGenerativeAI(key);
  return client;
}

export async function geminiJSON<T>(prompt: string, model = 'gemini-1.5-flash'): Promise<T> {
  const c = getClient();
  const m = c.getGenerativeModel({
    model,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
  });
  const res = await m.generateContent(prompt);
  const text = res.response.text();
  return JSON.parse(text) as T;
}

export async function geminiText(prompt: string, model = 'gemini-1.5-flash'): Promise<string> {
  const c = getClient();
  const m = c.getGenerativeModel({ model, generationConfig: { temperature: 0.5 } });
  const res = await m.generateContent(prompt);
  return res.response.text();
}
