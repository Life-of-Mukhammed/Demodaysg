# Founders School

AI-powered startup operating system. From idea to investment.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js API routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Firebase Auth (Email + Google)
- **Storage:** Firebase Storage
- **AI:** Google Gemini (Free tier) + Groq (Free tier) — fallback router
- **i18n:** Uzbek + Russian (next-intl)
- **Email:** Resend (free tier)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env` and fill in:
```bash
cp .env.example .env
```

Required:
- **`DATABASE_URL`** — PostgreSQL connection string (use [Neon](https://neon.tech) for free Postgres)
- **`NEXT_PUBLIC_FIREBASE_*`** — From Firebase Console → Project Settings → Web app
- **`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`** — Firebase Admin from Service Account JSON
- **`GEMINI_API_KEY`** — [Get free key](https://aistudio.google.com/app/apikey)
- **`GROQ_API_KEY`** — [Get free key](https://console.groq.com/keys)

### 3. Initialize database
```bash
npx prisma db push
npm run db:seed
```

### 4. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- 🎯 **AI Startup Evaluation** — 0-100 score via YC/Sequoia frameworks
- 🤝 **Tinder-style co-founder matching** — Tier-based algorithm
- 📋 **Kanban workspace** — Sprint + task management with AI task generator
- 🎓 **Mentor dashboard** — Weekly reviews + AI mentor brief
- 💎 **Investor readiness** — AI-driven readiness assessment
- 🏆 **Gamification** — Badges, streaks, levels, leaderboard
- 📰 **News feed** — Admin + RSS + user submissions
- 🌐 **i18n** — Uzbek + Russian
- 🌙 **Dark mode** — Beautiful glass UI

## Structure

```
src/
  app/
    (auth)/             # signin, signup
    (app)/              # authenticated pages (dashboard, startups, match, etc.)
    api/                # API routes
  components/
    ui/                 # shadcn/ui primitives
    landing/            # landing page sections
    app/                # sidebar, topbar
    workspace/          # kanban
    admin/              # admin charts
  lib/
    ai/                 # Gemini + Groq integrations
    firebase/           # client + admin
    prisma.ts
    matching.ts
    gamification.ts
  messages/             # uz.json, ru.json
prisma/
  schema.prisma
  seed.ts
```

## Deployment

Recommended: **Vercel** + **Neon Postgres** + **Firebase**.

```bash
npm run build
```

## License

Private.
