import { geminiJSON } from './gemini';
import { groqJSON } from './groq';
import {
  startupEvalPrompt,
  specialistEvalPrompt,
  sprintTaskGenPrompt,
  mentorBriefPrompt,
  investorReadinessPrompt,
  cofounderMatchPrompt,
} from './prompts';

type Provider = 'gemini' | 'groq';

async function callJSON<T>(provider: Provider, prompt: string): Promise<T> {
  try {
    if (provider === 'gemini') return await geminiJSON<T>(prompt);
    return await groqJSON<T>(prompt);
  } catch (e) {
    const fb: Provider = provider === 'gemini' ? 'groq' : 'gemini';
    console.error(`[ai] ${provider} failed, falling back to ${fb}:`, e);
    if (fb === 'gemini') return await geminiJSON<T>(prompt);
    return await groqJSON<T>(prompt);
  }
}

export type StartupEvalResult = {
  score: number;
  category: 'WEAK' | 'AVERAGE' | 'PROMISING' | 'HIGH_POTENTIAL' | 'VC_BACKABLE';
  metrics: Record<string, number>;
  weights: Record<string, number>;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  next_steps: string[];
};

export type SpecialistEvalResult = {
  score: number;
  level_assessment: 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEAD';
  summary: string;
  strengths: string[];
  gaps: string[];
  best_fit_sectors: string[];
};

export type TaskGenResult = {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimated_hours: number;
};

export const ai = {
  evaluateStartup: (input: Parameters<typeof startupEvalPrompt>[0]) =>
    callJSON<StartupEvalResult>('gemini', startupEvalPrompt(input)),

  evaluateSpecialist: (input: Parameters<typeof specialistEvalPrompt>[0]) =>
    callJSON<SpecialistEvalResult>('gemini', specialistEvalPrompt(input)),

  generateTask: (input: Parameters<typeof sprintTaskGenPrompt>[0]) =>
    callJSON<TaskGenResult>('groq', sprintTaskGenPrompt(input)),

  mentorBrief: (input: Parameters<typeof mentorBriefPrompt>[0]) =>
    callJSON<{
      executive_summary: string;
      key_wins: string[];
      concerns: string[];
      questions_to_ask: string[];
      recommended_focus: string;
    }>('gemini', mentorBriefPrompt(input)),

  investorReadiness: (input: Parameters<typeof investorReadinessPrompt>[0]) =>
    callJSON<{
      readiness: 'NOT_READY' | 'ALMOST_READY' | 'INVESTOR_READY';
      score: number;
      rationale: string;
      checklist: { item: string; status: 'MET' | 'PARTIAL' | 'MISSING' }[];
    }>('gemini', investorReadinessPrompt(input)),

  cofounderMatch: (input: Parameters<typeof cofounderMatchPrompt>[0]) =>
    callJSON<{
      fit_score: number;
      reason: string;
      complementary_skills: string[];
      concerns: string[];
    }>('gemini', cofounderMatchPrompt(input)),
};
