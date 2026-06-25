# 📈 Yieldly

Track your money across accounts and see how it grows. Yieldly is a personal
finance tracker focused on **investment yields** — log balances per account,
record deposits and withdrawals, and watch your daily yield and total balance
trend over time.

## Features

- **Accounts** — group your money by institution + label (e.g. "Nubank — Reserve")
- **Transaction types** — custom inflow/outflow categories per user; new accounts
  are seeded with sensible defaults on first sign-in
- **Ledger** — dated entries with amount and an optional note, stored in minor
  units (cents) to avoid floating-point drift
- **Spread** — distribute a single amount (e.g. a month's yield) evenly across a
  date range instead of entering it day by day
- **Daily summaries** — per-account end balance, yields and deposits rolled up by
  day, plus an account-level and total overview
- **Balance graph** — visualize how each account (and your total) evolves over time
- **Roles & authorization** — `admin` / `member` / `viewer` with a permission layer
  guarding every mutation
- **i18n** — multi-language UI (pt-BR default) via i18next
- Installable **PWA**

## Tech

Next.js 15 (App Router, Turbopack) · React 19 · Prisma 6 + Postgres ·
Auth.js / NextAuth v4 (Google) · TanStack Query · React Hook Form + Zod ·
Recharts · Tailwind + shadcn/ui · PWA (`@ducanh2912/next-pwa`)

Money is stored as integer **minor units** everywhere (`amountMinor`,
`balanceEndMinor`, `yieldsMinor`, `depositsMinor`) and formatted on display.

## Local setup

```bash
npm install
cp .env.example .env        # then fill in the values below
npx prisma migrate dev      # create the schema in your Postgres database
npm run dev                 # runs on http://localhost:3001
```

The dev server runs on a fixed non-default port (**3001**) so it won't clash with
other projects that use 3000.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client |
| `ADMIN_EMAIL` | email that is granted the `admin` role on first sign-in |
| `NEXTAUTH_SECRET` | NextAuth session secret (`npx auth secret` or `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | base URL of the app (e.g. `http://localhost:3001`) |
| `NEXT_PUBLIC_API_URL` | optional API base override for the HTTP client |

### Google OAuth

1. Create an OAuth client (Web) at https://console.cloud.google.com/apis/credentials
2. Add redirect URI `http://localhost:3001/api/auth/callback/google` (and your prod URL later)
3. On the OAuth consent screen, add yourself as a **Test user**
4. Put the client id/secret into `.env` as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

## Useful scripts

```bash
npm run dev          # dev server on :3001 (Turbopack)
npm run build        # production build
npm run db:migrate   # prisma migrate dev
npm run db:push      # prisma db push (no migration file)
npm run db:studio    # open Prisma Studio
npm run db:generate  # regenerate Prisma client
npm run lint         # eslint
```

## Deploying to Vercel

1. Push to GitHub, import the repo in Vercel
2. Set the env vars above (`DATABASE_URL`, `GOOGLE_*`, `ADMIN_EMAIL`, `NEXTAUTH_*`)
3. Add the production redirect URI in GCP: `https://YOUR_DOMAIN/api/auth/callback/google`
4. `prisma generate` runs on install; run `prisma migrate deploy` for the schema
