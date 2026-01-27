# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js web app for quick Google Calendar event creation using natural language input (e.g., "finish homework 3pm 1hr tomorrow").

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint (Next.js + TypeScript rules)
```

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, NextAuth.js 5

**Source Structure:**
- `src/app/` - Pages and API routes (App Router)
- `src/components/` - Client components (EventInput, EventPreview, Toast, auth buttons)
- `src/lib/` - Core utilities (auth, parsing, calendar API, types)

**Key Files:**
- `src/lib/parse-event.ts` - Natural language parsing using chrono-node + regex for durations
- `src/lib/auth.ts` - NextAuth config with Google OAuth, JWT strategy, automatic token refresh
- `src/lib/google-calendar.ts` - Google Calendar API client for event creation
- `src/app/api/calendar/route.ts` - POST endpoint to create calendar events (authenticated)

**Data Flow:**
1. User types natural language → `parseEventInput()` extracts title, date/time, duration in real-time
2. Preview component shows parsed event details
3. Submit calls `/api/calendar` with parsed data
4. Server validates auth, creates event via Google Calendar API
5. Toast shows success/error

**Authentication:**
- Google OAuth with `calendar.events` scope
- JWT session strategy with automatic refresh token handling
- Access token stored in JWT, passed to Google API

## Environment Variables

Required in `.env.local`:
```
AUTH_SECRET=        # NextAuth secret (generate with: openssl rand -base64 32)
AUTH_GOOGLE_ID=     # Google OAuth client ID
AUTH_GOOGLE_SECRET= # Google OAuth client secret
```

## Key Patterns

- Server Components for auth checks and layout; Client Components ("use client") for forms and interactive UI
- `useMemo` for real-time parsing without unnecessary re-renders
- Default duration is 1 hour when not specified in input
- Timezone defaults to "America/Chicago" in calendar API
