# Coaching MVP

Manage batches, students, attendance, and monthly fees for a coaching institute.

## Stack

- Next.js 16 (App Router, Server Actions) + TypeScript
- shadcn/ui + Tailwind
- Prisma 7 + PostgreSQL (driver adapter: `@prisma/adapter-pg`)
- Auth.js (NextAuth v5) — single admin login

## Setup

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `AUTH_SECRET` (generate with `npx auth secret`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Create the database and run migrations:
   ```
   createdb coaching_mvp
   npx prisma migrate dev
   ```
3. Seed the admin user:
   ```
   npx tsx prisma/seed.ts
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Log in at `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Features

- **Batches** — create/edit/deactivate batches with a monthly fee
- **Students** — create/edit students, enroll/unenroll into batches (optional per-student fee override)
- **Attendance** — mark present/late/absent per batch per day, edit past sessions, view history
- **Fees** — month-by-month dues across all students, record payments, per-student ledger
- **Dashboard** — active students/batches, this month's collection, today's attendance
