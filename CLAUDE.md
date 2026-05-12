# CLAUDE.md — voicecashly-client

Bu fayl Claude Code (claude.ai/code) uchun **frontend** kodi bilan ishlash bo'yicha qo'llanma. Backend uchun alohida `voicecashly-server/` repo mavjud.

## Loyiha haqida

**VoiceCashly client** — VoiceCashly backend uchun React + Vite + TypeScript asosida qurilgan veb dashboard. Foydalanuvchi Telegram bot orqali ovoz/matn yuborib tranzaksiya qo'shadi, web dashboard'da esa ularni ko'radi, tahrirlaydi, byudjet boshqaradi va analytics ko'radi.

**Stack:** React 18 · Vite 5 · TypeScript 5 · TailwindCSS 3 + shadcn/ui (Radix) · TanStack Query 5 · Zustand 4 · React Router 6 · axios · i18next · Supabase Realtime · Recharts · date-fns

**Deploy:** Vercel (static SPA) · backend Render'da · DB Supabase

---

## Komandalar

Hammasi `voicecashly-client/` ichidan ishga tushadi:

```bash
npm run dev            # Vite dev server (localhost:5173)
npm run build          # tsc -b && vite build → dist/
npm run preview        # Build natijasini lokal ko'rib chiqish
npm run lint           # ESLint --fix
```

### Vercel'ga Deploy

`vercel.json` SPA rewrites'ni belgilaydi (barcha route'lar `/index.html`'ga). Vercel dashboard'da env vars o'rnatilishi kerak — quyidagi `Environment Variables` bo'limiga qarang. Build commandi default Vite (`npm run build`), output `dist/`.

> Backend va frontend domenlar o'rtasida CORS allaqachon backend tomonida `app.enableCors()` orqali `*`'ga ochilgan. Hech narsa qo'shish shart emas.

---

## Environment Variables

`.env.example` → `.env` nusxalab to'ldiring (lokal dev uchun) yoki Vercel dashboard'da o'rnating (prod uchun):

| Variable | Tavsif |
|----------|--------|
| `VITE_API_URL` | Backend URL'i (lokalda `http://localhost:3001`, prod'da `https://voicecashly-server.onrender.com`) |
| `VITE_SUPABASE_URL` | Supabase project URL (realtime sync uchun) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (faqat realtime read uchun) |
| `VITE_BOT_USERNAME` | Telegram bot username (link va instruktsiyalar uchun, `@`-siz) |
| `VITE_BOT_ID` | Telegram bot ID (rezervatsiya — hozir foydalanilmayapti) |

> Vite env vars **build-time'da** bundle ichiga inject qilinadi. O'zgartirgandan keyin qayta build/deploy qilish shart.

---

## Arxitektura

### Papkalar tuzilishi

```
src/
├── main.tsx                    # Bootstrap: QueryClient, BrowserRouter, Toaster, i18n init, theme apply
├── App.tsx                     # Router: /login, /onboarding, ProtectedRoute → Layout (nested)
├── i18n/
│   ├── index.ts                # i18next + LanguageDetector (localStorage: 'lang')
│   ├── uz.json · ru.json · en.json   # tarjimalar (~195 satr, key-value tekis ierarxiya)
├── types/index.ts              # Bir joyda — User, Workspace, Transaction, Category, Budget, AuthResponse...
├── lib/
│   ├── format.ts               # formatMoney, formatDate, formatRelative, formatPercent (date-fns + Intl)
│   └── utils.ts                # cn() (clsx + tailwind-merge)
├── services/                   # Backend bilan ulanish qatlami (axios)
│   ├── api.ts                  # axios instance + interceptors (Authorization, X-Workspace-Id, 401 logout)
│   ├── auth.service.ts         # /auth/bot/start, /auth/bot/check, /auth/me
│   ├── workspaces.service.ts   # /workspaces/me, /workspaces, /workspaces/:id/invite
│   ├── transactions.service.ts # /transactions (CRUD), /summary, /export
│   ├── categories.service.ts   # /categories (CRUD)
│   ├── analytics.service.ts    # /analytics/monthly, /analytics/by-category
│   ├── budgets.service.ts      # /budgets (list, progress, upsert)
│   ├── settings.service.ts     # /settings (get, update)
│   ├── exchange-rates.service.ts # /exchange-rates/latest
│   └── supabase.ts             # createClient(url, anon) — null bo'lishi mumkin
├── store/                      # Zustand stores (persist orqali localStorage'da)
│   ├── useAuthStore.ts         # token, user, isAuthenticated, isTokenValid (jwt-decode)
│   ├── useWorkspaceStore.ts    # activeWorkspaceId, activeRole + pickActiveWorkspace helper
│   └── useUiStore.ts           # sidebarCollapsed, theme ('light'|'dark')
├── hooks/                      # TanStack Query wrappers
│   ├── useAuth.ts              # useTelegramLogin, useMe, useLogout
│   ├── useWorkspaces.ts        # useMyWorkspaces, useActiveWorkspace, useCreateWorkspace, useWorkspaceDetail, useInviteCode
│   ├── useTransactions.ts      # useTransactions, useSummary, useCreate/Update/DeleteTransaction
│   ├── useCategories.ts        # useCategories, useCreate/Update/DeleteCategory
│   ├── useAnalytics.ts         # useMonthlyAnalytics, useByCategoryAnalytics
│   ├── useBudgets.ts           # useBudgets, useBudgetProgress, useUpsertBudget
│   ├── useSettings.ts          # useSettings, useUpdateSettings
│   └── useRealtimeSync.ts      # Supabase channel: Transaction & Budget rows → invalidateQueries
├── components/
│   ├── auth/ProtectedRoute.tsx          # isAuthenticated + isTokenValid → /login navigate
│   ├── layout/
│   │   ├── Layout.tsx                   # Sidebar + Topbar + Outlet, workspace yuklash + slow-banner
│   │   ├── Sidebar.tsx                  # Menyu navigation
│   │   ├── Topbar.tsx                   # Theme, lang, UserMenu, WorkspaceSwitcher
│   │   ├── WorkspaceSwitcher.tsx        # Dropdown — active workspace tanlash
│   │   └── UserMenu.tsx                 # Profile, logout
│   ├── shared/                          # Universal komponentlar: CurrencyAmount, MetricCard, EmptyState, ConfirmDialog, DateRangePicker, ErrorBoundary, LoadingSpinner
│   ├── transactions/                    # QuickAddForm, TransactionsTable, TransactionRow, TransactionForm, EditTransactionModal, TransactionFilters
│   ├── categories/                      # CategoryCard, CategoryForm, BudgetProgressBar
│   ├── analytics/                       # MonthlyTrendChart, CategoryBreakdownChart, ComparisonCard, TopCategoriesList
│   └── ui/                              # shadcn/ui primitives: button, input, label, badge, card, dialog, dropdown-menu, popover, select, tabs, skeleton, table
└── pages/
    ├── Login/index.tsx          # Telegram bot orqali login (poll-based)
    ├── Onboarding/index.tsx     # Yangi user uchun bot'ga yo'naltirish
    ├── Overview/index.tsx       # Bosh sahifa — metrics, charts, recent transactions, QuickAdd
    ├── Transactions/index.tsx   # CRUD + filtrlar + CSV export
    ├── Analytics/index.tsx      # Monthly trend + category breakdown
    ├── Categories/index.tsx     # CRUD + per-category budgets
    ├── Team/index.tsx           # Workspace a'zolari, invite code (faqat OWNER ko'radi)
    ├── Settings/index.tsx       # Til, valyuta, timezone, notifikatsiyalar
    └── NotFound/index.tsx       # 404
```

### Routing va Auth

`App.tsx` da React Router 6:

- `/login` — ochiq (agar `isAuthenticated` bo'lsa → `/`'ga redirect)
- `/onboarding` — `ProtectedRoute` bilan o'ralgan
- `/` — `ProtectedRoute` + `Layout` → nested routes (`/`, `transactions`, `analytics`, `categories`, `team`, `settings`)
- `/404` — Not found
- `*` → `/404`

`ProtectedRoute` ikkita shart tekshiradi:
1. `useAuthStore.isAuthenticated` (persist localStorage'dan tiklanadi)
2. `isTokenValid()` — `jwt-decode` orqali `exp` claim'ni tekshiradi

Agar shartlardan biri yolg'on bo'lsa — `/login`'ga navigate + `state.from` saqlanadi.

Axios interceptor (`services/api.ts`) 401 javob kelganda **avtomatik logout** qiladi va `AUTH_LOGOUT_EVENT` window event'ini chiqaradi. `App.tsx` shu event'ni tinglaydi → `/login`'ga uloqtiradi.

### Login Oqimi (Telegram Bot orqali — Login Widget yo'q!)

```
LoginPage
  → useMutation: authService.botAuthStart()
       POST /auth/bot/start → { token, deepLink, expiresAt }
  → window.open(deepLink, '_blank')   (https://t.me/<bot>?start=login_<token>)
  → useQuery: authService.botAuthCheck(token), refetchInterval: 2000ms
       GET /auth/bot/check?token=... → { status: 'pending'|'confirmed'|'expired', jwt?, user? }
  → Foydalanuvchi Telegram'da botda "Tasdiqlash" tugmasini bosadi
  → Keyingi pollda status='confirmed' kelganda:
       login(jwt, user) → setActive(user.workspaces[0].workspaceId, role) → navigate('/')
```

> Eslatma: `loginWithTelegram(POST /auth/telegram)` Telegram Login Widget uchun mavjud, lekin **hozirgi UI ishlatmaydi**. `useTelegramLogin()` hook'i meros sifatida qolgan.

### Data Fetching: TanStack Query

Barcha hook'lar `services/`'dan funksiya chaqirib `useQuery`/`useMutation`'da o'raydi. Konventsiyalar:

- **Query key**: `['transactions', filters]`, `['workspaces', 'me']`, `['analytics', 'monthly', workspaceId, months]`
- **enabled**: `!!workspaceId` yoki `isAuthenticated` — kerakli data bo'lmaguncha so'rov yuborilmaydi
- **invalidation onSuccess**: mutation muvaffaqiyatli bo'lganda mos query'larni `invalidateQueries` qiladi (masalan, transaction yaratilsa: `['transactions']`, `['summary']`, `['analytics']`)
- **toast**: `react-hot-toast` orqali success/error xabarlari, til `react-i18next` orqali

`main.tsx` da global QueryClient sozlamalari:
- `retry`: 4xx'da retry yo'q, 5xx/network'da 3 marta exponential backoff (Render cold start uchun)
- `retryDelay`: `Math.min(1000 * 2 ** attempt, 15000)`
- `staleTime: 60s` · `gcTime: 10min` · `refetchOnWindowFocus: false` · `refetchOnReconnect: 'always'`

### Cold Start (Render free tier)

Render free tier 15 daqiqa harakatsizlikdan keyin xizmatni o'chiradi. Birinchi so'rov 30-60 soniya kutib qoladi. Frontend buni quyidagicha boshqaradi:

1. **`main.tsx` da warm-up ping** — sahifa yuklanganida darhol `fetch(VITE_API_URL, { mode: 'no-cors' })` jo'natiladi (response o'qilmaydi, lekin Render'ni uyg'otadi)
2. **`Layout.tsx` SlowLoadBanner** — `useMyWorkspaces` 8 soniyadan ko'p yuklanmasa, "Server ishga tushmoqda..." banner ko'rsatadi
3. **Backend tomonida `KeepAliveService`** — `@Cron('*/14 * * * *')` har 14 daqiqada o'zini ping qilib turadi

### Realtime Sync (Supabase)

`useRealtimeSync` hook (`Layout.tsx` ichida chaqiriladi) Supabase realtime channel ochadi:

- Channel: `ws-<activeWorkspaceId>`
- Postgres changes filter: `Transaction` va `Budget` jadvallarida `workspaceId=eq.<active>`
- Event keladi → `invalidateQueries(['transactions'/'summary'/'analytics'/'budgets'])`
- INSERT bo'lsa kichik toast ham chiqaradi

Agar `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` o'rnatilmagan bo'lsa, `supabase` `null` bo'ladi va hook hech narsa qilmaydi (xato bermaydi).

### Axios va Workspace Header

`services/api.ts` har bir so'rovga ikki header qo'shadi:
- `Authorization: Bearer <token>` — `useAuthStore.token` mavjud bo'lsa
- `X-Workspace-Id: <activeWorkspaceId>` — `useWorkspaceStore.activeWorkspaceId` mavjud bo'lsa

> Backend asosan `workspaceId` query param'i orqali ishlaydi, lekin header ham yuboriladi kelajakdagi route guard'lar uchun.

Interceptor xatolar:
- `!error.response` (network/CORS/timeout) → `toast.error(t('toasts.no_internet'))`
- `401` → `logout()` + `reset()` + `AUTH_LOGOUT_EVENT`
- `403` → `toast.error(t('toasts.no_permission'))`
- `5xx` → `toast.error(t('toasts.server_error'))`

### Multi-language (i18n)

- 3 til: `uz` (default + fallback), `ru`, `en`
- Detection tartibi: `localStorage['lang']` → `navigator.language`
- Til o'zgartirilganda `localStorage`'ga ham yoziladi (`i18n/index.ts`'da `caches: ['localStorage']`)
- Komponentda: `const { t, i18n } = useTranslation()` · `t('overview.total_income')` · `i18n.changeLanguage('ru')`
- Tarjima fayllari `src/i18n/{uz,ru,en}.json` — tekis kalit ierarxiyasi: `common.*`, `nav.*`, `overview.*`, `transactions.*`, `toasts.*`, `login.*`, `onboarding.*`, etc.
- Kategoriya/tranzaksiya `nameUz`/`nameRu`/`nameEn` (yoki `noteUz`/...) — joriy tilga qarab tanlanadi (`Overview/index.tsx`'dagi `name = lang==='uz' ? cat.nameUz : lang==='ru' ? cat.nameRu : cat.nameEn`)

### Theming (Dark mode)

- `useUiStore.theme: 'light' | 'dark'` (persist'da)
- `main.tsx` bootstrap'da `document.documentElement.classList.add('dark')` qo'shadi agar `theme === 'dark'`
- `useUiStore.setTheme` ham DOM class'ni yangilaydi
- Tailwind config'da `darkMode: ['class']`
- Ranglar `hsl(var(--*))` CSS variables orqali (`styles/globals.css`)
- Maxsus ranglar: `income`, `expense`, `warning`, `danger`

### Valyuta ko'rsatish

`<CurrencyAmount amount={N} currency={c?} sign={'+'|'−'?} className={...} />` — `lib/format.ts` `formatMoney()`'ni o'raydi.

- UZS uchun: `Intl.NumberFormat('fr-FR')` (bo'sh oraliq), keyin `so'm` qo'shiladi
- USD uchun: `Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' })`
- Backend `amount`/`amountUzs`'ni `Decimal` sifatida `string` yuboradi — `Number()`'ga o'tkazish kerak

### Workspace Roles (Frontend tomonida)

UI ba'zi tugmalarni rolga qarab ko'rsatadi:

| Action | OWNER | ADMIN | MEMBER |
|--------|-------|-------|--------|
| Tranzaksiya qo'shish/tahrirlash/o'chirish | ✅ | ✅ | ✅ (o'ziniki) |
| Kategoriya yaratish/o'chirish | ✅ | ✅ | ❌ |
| Byudjet o'rnatish | ✅ | ✅ | ❌ |
| Team sahifasini ko'rish | ✅ | ✅ | ✅ |
| Invite link olish | ✅ | ❌ | ❌ |
| Workspace nomini o'zgartirish | ✅ | ✅ | ❌ |
| Workspace o'chirish | ✅ | ❌ | ❌ |

Lekin asosiy guard backend tomonida — frontend faqat UX uchun yashiradi.

---

## Konventsiyalar

- **TypeScript strict** yoqilgan. `any`'dan qochish, `unknown`'ni `as` bilan toraytirish.
- **Path alias** `@/*` → `src/*` (vite.config.ts + tsconfig.json'da)
- **Component naming** PascalCase, fayl nomi komponent nomiga teng
- **Hooks** `use*` prefiks bilan, har bir hook bitta TanStack Query'ni o'raydi
- **Service funksiyasi** har doim async va `axios.AxiosResponse`'ni `res.data`'ga ochib qaytaradi
- **Form** boshqaruvi local `useState` — alohida form lib ishlatilmaydi
- **Error handling** — UI'da `ErrorBoundary` (`shared/ErrorBoundary.tsx`) + axios interceptor toast'lari
- **Yangi sahifa qo'shish:** `pages/<Name>/index.tsx` + lazy import + `App.tsx` route + `Sidebar.tsx` link + i18n kalitlari uch tilda
- **Yangi API endpoint chaqiruvi:** service'da funksiya qo'sh → hook'da `useQuery`/`useMutation` qoplama → komponentda chaqir → loading/error UI yoz
- **Stiling** Tailwind utility-first + shadcn/ui primitivlar. Maxsus CSS faqat `globals.css`'da (CSS vars, animatsiya)
- **Loading state**: skeleton'lar (`shared/LoadingSpinner.tsx`, `ui/skeleton.tsx`)
- **Empty state**: `shared/EmptyState.tsx` — icon, sarlavha, tavsif, action tugmasi

---

## Backend bilan integratsiya

Backend route'lar (`voicecashly-server/`'dan):

| Method · Path | Service · Hook |
|---------------|-----------------|
| `POST /auth/bot/start` | `authService.botAuthStart` |
| `GET /auth/bot/check?token=` | `authService.botAuthCheck` |
| `POST /auth/telegram` | `authService.loginWithTelegram` (Login Widget — hozir ishlatilmaydi) |
| `GET /auth/me` | `authService.me` · `useMe` |
| `GET /settings` · `PATCH /settings` | `settingsService` · `useSettings` |
| `GET /workspaces/me` | `workspacesService.myWorkspaces` · `useMyWorkspaces` |
| `POST /workspaces` · `POST /workspaces/join` · `GET /workspaces/:id` · `GET /workspaces/:id/invite` | `workspacesService` |
| `GET /transactions?workspaceId=` · `GET /transactions/summary` · `GET /transactions/export` | `transactionsService` · `useTransactions`/`useSummary` |
| `POST/PATCH/DELETE /transactions[/:id]` | `transactionsService` mutations |
| `GET /categories?workspaceId=` · CRUD | `categoriesService` · `useCategories` |
| `GET /analytics/monthly?workspaceId=&months=` · `GET /analytics/by-category?workspaceId=&type=&from=&to=` | `analyticsService` · `useAnalytics` |
| `GET /budgets?workspaceId=&month=&year=` · `GET /budgets/progress?workspaceId=` · `POST /budgets` | `budgetsService` |
| `GET /exchange-rates/latest` | `exchangeRatesService` |

> Backend `class-validator` DTO'lar bilan validatsiya qiladi (`@IsDateString()`, `@IsNumber()` + `@Type(() => Number)`). Frontend `from`/`to`'ni doimo `new Date(...).toISOString()` formatda yuborishi kerak.

---

## Tipik nosozliklar (debug)

1. **"Internet aloqasi yo'q" toast** — axios `error.response` undefined. Sabablar: Render cold start (>60s timeout), CORS bloklangan, network down. Tekshiruv: brauzer DevTools Network → so'rov status. Backend `/health` endpoint'ini to'g'ridan-to'g'ri brauzerda oching.
2. **Login bo'ldi, lekin `/`'da skeleton qotib qoldi** — `useActiveWorkspace()` `undefined` qaytaryapti. Sabablar: `useMyWorkspaces` empty array qaytardi (foydalanuvchi botda hech qachon workspace yaratmagan) yoki 401 kelyapti. `Layout.tsx` memberships uchun `length === 0` bo'lsa `/onboarding`'ga uloqtiradi.
3. **Onboarding loop** — onboarding'da workspace yaratish tugmasi yo'q. Foydalanuvchi botda `/start` qilib workspace yaratishi kerak. Onboarding'dagi "Boshlash" tugmasi `/` ga olib boradi va u yana onboarding'ga qaytaradi cheksiz.
4. **JWT expired** — `isTokenValid()` `false` qaytaradi → ProtectedRoute /login'ga uloqtiradi. Yoki `exp` yo'q bo'lsa true qaytariladi va keyingi API call'ida 401 → logout. Backend JWT TTL `30d`.
5. **Realtime sync ishlamayapti** — `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` env vars Vercel'da o'rnatilmagan. Supabase project'da Database → Replication → `Transaction`, `Budget` jadvallari uchun realtime yoqilgan bo'lishi kerak.
6. **Bundle eski env'lar bilan deploy** — Vite env vars build-time'da inject qilinadi. Vercel'da env o'zgartirgandan keyin **Redeploy** kerak.
