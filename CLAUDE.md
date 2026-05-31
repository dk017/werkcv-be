# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WerkCV is a Dutch CV/resume builder web application. Users create CVs through a live editor with real-time preview, then pay once to download as PDF. The app is in Dutch (lang="nl").

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint with Next.js rules
```

### Database

```bash
docker compose up -d                    # Start PostgreSQL
npx prisma generate                     # Generate Prisma client
npx prisma db push                      # Push schema to database
npx prisma studio                       # Database GUI
```

Requires `DATABASE_URL` in `.env` (format: `postgresql://postgres:postgres@localhost:5432/werkcv`)

## Architecture

- **Next.js 16** with App Router, React 19, TypeScript, Tailwind CSS 4
- **Prisma** with PostgreSQL for persistence
- **Zod** for CV data validation (`lib/cv.ts`)

### Key Files

- `lib/cv.ts` - CV schema definition and TypeScript types (CVData)
- `lib/prisma.ts` - Singleton Prisma client
- `app/actions.ts` - Server actions for CV CRUD operations
- `app/editor/` - Main CV editor UI
  - `editor.tsx` - Form with react-hook-form, two-column layout (editor + live preview)
  - `sections.tsx` - Form sections for experience, education, skills, languages
  - `templates/` - CV template components

### Data Models (prisma/schema.prisma)

- **User** - Email-based users
- **CVDocument** - CV data stored as JSON with template reference
- **Template** - CV templates with config
- **Order** - Payment records (LemonSqueezy integration placeholder)

### Path Alias

`@/*` maps to project root (e.g., `@/lib/cv`)
