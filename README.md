# Claude for Specialists

An interactive learning platform that teaches teams to use Claude for real
work (Growth, Marketing, GTM, Brand). Built on the InstaSpace design system:
a React single-page portal frontend and a Node/Express backend that proxies
Claude and reads course content from Airtable.

## Structure

```
claude-for-specialists/
├── backend/
│   └── server.js          Express API (health, courses, chat proxy, progress)
├── frontend/
│   ├── index.html         React SPA shell (loaded via Babel standalone)
│   ├── portal/*.jsx        app, dashboard, lesson, exercise, progress, data
│   ├── tweaks-panel.jsx    accent + motion controls
│   └── serve.js           tiny static server (port 8000, no dependencies)
├── config/
│   └── airtable.schema.md Airtable table reference
├── docs/
│   └── DEVELOPER_SETUP_GUIDE.md
├── .env / .env.example    credentials (git-ignored)
└── package.json
```

## Quick start

```bash
npm install                 # dependencies (already installed here)

# Terminal 1 - backend on http://localhost:3001
npm run dev

# Terminal 2 - frontend on http://localhost:8000
npm run frontend
```

Open http://localhost:8000.

The portal ships with a built-in scripted mentor and sample courses, so it
runs fully **without any API keys**. To enable live data:

1. Copy `.env.example` to `.env`.
2. Add your `CLAUDE_API_KEY` (real Claude chat) and, optionally,
   `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` (live course content).
3. Restart the backend.

## API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET  | `/api/health` | status + which integrations are configured |
| POST | `/api/auth/login` | sign in, returns a bearer token + user |
| GET  | `/api/auth/me` | current user (requires token) |
| POST | `/api/auth/change-password` | set a new password (requires token) |
| POST | `/api/auth/logout` | end the session (requires token) |
| GET  | `/api/courses` | raw course records (Airtable) |
| GET  | `/api/content/courses` | full nested courses assembled from Airtable |
| GET  | `/api/courses/:courseId/lessons` | lessons for a course |
| GET  | `/api/lessons/:lessonId/exercises` | exercises for a lesson |
| POST | `/api/chat` | proxy a chat turn to Claude |
| GET  | `/api/progress/:studentId` | read saved progress |
| POST | `/api/progress` | upsert progress |
| POST | `/api/submissions` | record an exercise submission |
| GET  | `/api/leadership/overview` | per-intern progress (leadership only) |

Endpoints that need a key return `503` with a hint until it is configured.

## Courses, tracks, and dashboards

- **Two course sets.** Four department courses (Growth, Marketing, GTM, Brand)
  plus four intern specialty tracks (SEO, Design, QA & No-code, QA & SEO). Each
  intern signs in and lands straight on their specialty; department courses stay
  available under "Explore other tracks".
- **Live Claude practice.** Exercises talk to Claude through `POST /api/chat`.
  Add `CLAUDE_API_KEY` to `.env` and restart to turn it on; without a key the
  chat shows an honest "not connected" message instead of failing silently.
- **Content from Airtable.** When `AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID` are
  set, the frontend loads courses from `GET /api/content/courses` and merges
  them over the built-in ones. Not configured, it silently keeps the built-in
  courses. See `config/airtable.schema.md` for the exact field mapping.
- **Leadership dashboard.** CEO / COO / CPO accounts see a live view of every
  intern's completion, exercises passed, streak, and last activity, sourced from
  real progress written as interns complete exercises.

## Accounts & login

The portal is gated by a login screen. Accounts live in the local SQLite
database (`local.db`) and are **seeded automatically on first boot** when the
`users` table is empty. Passwords are hashed with Node's built-in `scrypt`
(no external dependency); sessions are bearer tokens stored server side.

Default password for every seeded account: **`Instaspace@123`**. First sign in
forces the user to set a new password.

| Email | Role | Track / title |
|-------|------|---------------|
| `mesum@myinstaspace.com` | intern | SEO & Backlinks |
| `shahzaib@myinstaspace.com` | intern | Design & Video |
| `umair@myinstaspace.com` | intern | QA, No-code & SEO |
| `abdullah@myinstaspace.com` | intern | QA & SEO |
| `osman@myinstaspace.com` | leadership | CEO |
| `jybran@myinstaspace.com` | leadership | COO |
| `talha@myinstaspace.com` | leadership | CPO |

Interns land in the learning portal; leadership lands on a roster view (the
live progress dashboard is the next build). Override the default with
`DEFAULT_PASSWORD` in `.env` before first boot. To re-provision from scratch,
delete the `users` and `sessions` rows (or `local.db`) and restart the backend.

See `docs/DEVELOPER_SETUP_GUIDE.md` for the full walkthrough and deployment.
