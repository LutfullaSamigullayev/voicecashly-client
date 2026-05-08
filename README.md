# VoiceCashly — Client (Frontend)

VoiceCashly web dashboard. React + Vite + TypeScript + Tailwind + shadcn/ui.

Backend repo: `voicecashly-server` (NestJS + Prisma + grammY + Gemini AI).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router v6
- TanStack Query v5 (server state)
- Zustand (client state, persisted)
- react-i18next (uz / ru / en)
- Recharts (charts)
- date-fns (uz/ru/en locales)
- axios (HTTP + interceptors)
- @supabase/supabase-js (realtime)
- jwt-decode, react-hot-toast, lucide-react

## Setup

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # localhost:5173
```

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | NestJS backend base URL (e.g. `https://voicecashly-server.onrender.com`) |
| `VITE_SUPABASE_URL` | Supabase project URL — enables realtime |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_BOT_USERNAME` | Telegram bot username (without `@`) |

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # Preview production build
npm run lint      # ESLint --fix
```

## Folder layout

```
src/
├── pages/                 # Route pages (Login, Overview, Transactions, ...)
├── components/
│   ├── layout/            # Sidebar, Topbar, WorkspaceSwitcher, UserMenu
│   ├── auth/              # TelegramLoginButton, ProtectedRoute
│   ├── transactions/      # Table, form, filters, modal, quick-add
│   ├── categories/        # Card, form, budget bar
│   ├── analytics/         # Charts, comparison cards
│   ├── shared/            # MetricCard, EmptyState, Confirm, CurrencyAmount
│   └── ui/                # shadcn-style primitives
├── hooks/                 # TanStack Query hooks per resource
├── services/              # axios instance + per-resource API wrappers
├── store/                 # Zustand: auth, workspace, ui
├── i18n/                  # uz.json, ru.json, en.json
├── types/                 # Shared API types
├── lib/                   # format helpers, cn
└── styles/globals.css     # Tailwind + theme tokens
```

## Auth

1. `/login` shows the official Telegram Login Widget for the bot named in `VITE_BOT_USERNAME`.
2. Telegram returns `{ id, first_name, hash, auth_date, ... }` → posted to `POST /auth/telegram`.
3. Backend returns `{ token, user }` — saved in `useAuthStore` (persisted as `voicecashly_token`).
4. axios attaches `Authorization: Bearer <token>` and `X-Workspace-Id` to every request.
5. 401 → store cleared, redirect to `/login`.

Logout is in the user-menu dropdown (top-right). It clears localStorage, the auth + workspace stores, and the entire TanStack Query cache.

## Workspace switching

Sidebar exposes a workspace switcher (`<WorkspaceSwitcher />`). The active workspace ID is persisted in `useWorkspaceStore` and sent in every request via the `X-Workspace-Id` header.

A user can have multiple personal/team workspaces. The `/team` route only appears when the active workspace is a team (non-personal).

## Realtime (Supabase)

`useRealtimeSync()` subscribes (in `Layout`) to `Transaction` + `Budget` row changes filtered by `workspaceId`. Inserts/updates/deletes invalidate the relevant query keys. Disabled automatically if `VITE_SUPABASE_URL` is empty.

## Deploy (Vercel)

1. Push the repo to GitHub.
2. Import to Vercel — framework: Vite.
3. Add env vars from `.env.example`.
4. Deploy.

For local production preview: `npm run build && npm run preview`.
