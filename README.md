# Calendar Quick Add

A web app for adding events to Google Calendar using natural language. Type something like "finish problem set 3pm 1hr tomorrow" and it parses the title, date, time, and duration automatically.

## Usage

1. Sign in with your Google account.
2. Type an event in natural language:
   - `team meeting 2pm friday` — creates a 1-hour event
   - `dentist appointment 9:30am 45m march 15` — 45-minute event
   - `submit report tomorrow 5pm to 6pm` — explicit time range
3. The preview updates as you type, showing parsed title/date/time.
4. Press **Enter** or click **Add to Google Calendar**.

Durations default to 1 hour if not specified. Supports formats like `1hr`, `30m`, `2 hours`, `45 minutes`.

## How It Works

1. As you type, [chrono-node](https://github.com/wanasit/chrono) extracts dates and times from natural language.
2. A regex parser identifies duration patterns (`1hr`, `30m`, etc.) and calculates end time.
3. The remaining text becomes the event title.
4. On submit, the frontend sends parsed data to a Next.js API route.
5. The server authenticates via NextAuth.js and calls the Google Calendar API to create the event.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Main page, auth check
│   ├── layout.tsx                    # Root layout with SessionProvider
│   └── api/
│       ├── calendar/route.ts         # POST endpoint to create events
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── EventInput.tsx                # Input form with real-time parsing
│   ├── EventPreview.tsx              # Shows parsed event details
│   └── Toast.tsx                     # Success/error notifications
└── lib/
    ├── auth.ts                       # NextAuth config, token refresh
    ├── parse-event.ts                # Natural language parsing logic
    ├── google-calendar.ts            # Google Calendar API client
    └── types.ts                      # TypeScript declarations
```

---

## Development

### Prerequisites

- Node.js 18+
- Google Cloud project with Calendar API enabled
- OAuth 2.0 credentials (Web application type)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Guanc27/proj2_calendar.git
   cd proj2_calendar
   npm install
   ```

2. Create `.env.local` with your credentials:
   ```
   AUTH_SECRET=<generate with: openssl rand -base64 32>
   AUTH_GOOGLE_ID=<your-google-client-id>
   AUTH_GOOGLE_SECRET=<your-google-client-secret>
   ```

3. In Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs.

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

### Deploy

Deploy to [Vercel](https://vercel.com) with one click. Set the three environment variables in the Vercel dashboard and update the OAuth redirect URI to your production domain.

## License

MIT License
