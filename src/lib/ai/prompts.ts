export const SYSTEM_EVAL =
  'You are a venture analyst trained on Y Combinator, Sequoia, Antler, Techstars, and 500 Global startup evaluation frameworks. You return strict JSON only.';

export function startupEvalPrompt(input: {
  name: string;
  pitch: string;
  problem: string;
  solution: string;
  targetAudience: string;
  revenueModel: string;
  competitors?: string;
  hasMVP: boolean;
  teamSize: number;
  stage: string;
  sector: string;
}) {
  return `${SYSTEM_EVAL}

Evaluate this startup using YC/Sequoia frameworks. Pick weights dynamically based on sector "${input.sector}".

INPUT:
${JSON.stringify(input, null, 2)}

Return JSON with this exact shape:
{
  "score": <0-100 overall>,
  "category": "WEAK" | "AVERAGE" | "PROMISING" | "HIGH_POTENTIAL" | "VC_BACKABLE",
  "metrics": {
    "founder_strength": <0-100>,
    "market_size": <0-100>,
    "problem_quality": <0-100>,
    "solution_quality": <0-100>,
    "monetization": <0-100>,
    "investment_readiness": <0-100>
  },
  "weights": {
    "founder_strength": <0-1>,
    "market_size": <0-1>,
    "problem_quality": <0-1>,
    "solution_quality": <0-1>,
    "monetization": <0-1>,
    "investment_readiness": <0-1>
  },
  "feedback": "<3-4 paragraph constructive feedback in same language as input>",
  "strengths": ["<3 strengths>"],
  "weaknesses": ["<3 weaknesses>"],
  "next_steps": ["<3 actionable next steps>"]
}`;
}

export function specialistEvalPrompt(input: {
  resumeText?: string;
  primaryRoles: string[];
  skills: string[];
  sectors: string[];
  experienceYears: number;
  level: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  workSamples?: unknown;
}) {
  return `You are a senior technical recruiter scoring a candidate 0-100 for startup readiness.

Score based on:
- Quality of past projects and companies
- Skill depth vs claimed level
- Sector fit and relevance
- Portfolio strength
- Resume coherence

INPUT:
${JSON.stringify(input, null, 2)}

Return JSON:
{
  "score": <0-100>,
  "level_assessment": "JUNIOR" | "MIDDLE" | "SENIOR" | "LEAD",
  "summary": "<2-3 sentence summary in same language as input>",
  "strengths": ["<top 3 strengths>"],
  "gaps": ["<top 2 gaps>"],
  "best_fit_sectors": ["<top 3 sectors>"]
}`;
}

export function sprintTaskGenPrompt(input: {
  startup: { name: string; stage: string; sector: string; pitch: string };
  sprintGoal: string;
  assigneeRole: string;
  assigneeLevel: string;
  briefHint?: string;
}) {
  return `You are a startup execution coach. Generate a clear, actionable task for a ${input.assigneeLevel} ${input.assigneeRole} working on this startup.

STARTUP: ${input.startup.name} (${input.startup.stage}, ${input.startup.sector})
PITCH: ${input.startup.pitch}
SPRINT GOAL: ${input.sprintGoal}
${input.briefHint ? `HINT: ${input.briefHint}` : ''}

Return JSON. IMPORTANT: "description" must be a single STRING (use \\n for line breaks between bullets), NOT an array.
{
  "title": "<concise task title in same language as input>",
  "description": "<detailed description as a single string with acceptance criteria as bullet points separated by \\n, e.g. '• item 1\\n• item 2\\n• item 3'>",
  "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  "estimated_hours": <number>
}`;
}

export function mentorBriefPrompt(input: {
  startup: unknown;
  recentSprints: unknown;
  metrics: unknown;
}) {
  return `You are an AI mentor assistant. Generate a brief for a human mentor about to review this startup.

DATA:
${JSON.stringify(input, null, 2)}

Return JSON:
{
  "executive_summary": "<2 paragraphs>",
  "key_wins": ["<3>"],
  "concerns": ["<3>"],
  "questions_to_ask": ["<5 questions for the founder>"],
  "recommended_focus": "<one sentence>"
}`;
}

export function investorReadinessPrompt(input: {
  startup: unknown;
  sprintHistory: unknown;
  team: unknown;
  metrics: unknown;
  mentorReviews: unknown;
}) {
  return `You are an investor analyst. Assess if this startup is investor-ready.

DATA:
${JSON.stringify(input, null, 2)}

Return JSON:
{
  "readiness": "NOT_READY" | "ALMOST_READY" | "INVESTOR_READY",
  "score": <0-100>,
  "rationale": "<2 paragraphs>",
  "checklist": [
    { "item": "<criterion>", "status": "MET" | "PARTIAL" | "MISSING" }
  ]
}`;
}

export function cofounderMatchPrompt(input: {
  startup: unknown;
  candidate: unknown;
}) {
  return `You evaluate co-founder fit. Compare candidate and startup.

${JSON.stringify(input, null, 2)}

Return JSON:
{
  "fit_score": <0-100>,
  "reason": "<1 paragraph>",
  "complementary_skills": ["<2-3>"],
  "concerns": ["<1-2>"]
}`;
}
