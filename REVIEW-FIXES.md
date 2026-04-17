# The Trash Panda — Adversarial Review Fix Spec

> Generated from code review on 2026-04-17. Priority order: fix top-down.

## CRITICAL FIXES (Must complete all)

### 1. Wire All Mutations to Supabase (Provider Persistence)

**Problem:** `components/providers/harvestlink-provider.tsx` stores all user actions (follow, unfollow, mark listing gone, repost, schedule update) in localStorage ONLY. Nothing persists to Supabase. Other users never see changes.

**Fix:**
- `toggleProducerFollow()` → call `toggleFollow()` from `lib/supabase/queries.ts` with the authenticated user's ID
- `toggleCategoryFollow()` → same, using category follow type  
- `markListingGone()` → call `markListingGone()` from queries.ts
- `repostListing()` → call `createListing()` from queries.ts (generate proper UUID, not `listing-${Date.now()}`)
- On mount: fetch follows, notifications from Supabase for the authenticated user (not just listings)
- Keep localStorage as offline cache/optimistic UI, but Supabase is source of truth
- When user is not authenticated, mutations should prompt login (not silently write to localStorage)

**Files to modify:**
- `components/providers/harvestlink-provider.tsx` — main changes
- `lib/supabase/queries.ts` — may need additional query helpers
- `lib/auth/auth-provider.tsx` — reference for getting current user ID

### 2. Fix XSS in Map Popups

**Problem:** `components/map/harvestlink-map.tsx` builds popup HTML via string interpolation with unescaped user data (producer names, listing titles). A producer with `<script>` in their name can XSS all visitors.

**Fix:**
- Create an `escapeHtml()` utility function that escapes `& < > " '` 
- Apply it to ALL interpolated values in the `.setHTML()` call: `producerName`, `title`, `quantityLabel`, `distanceLabel`, `href`
- Place the utility in `lib/utils/escape-html.ts`

### 3. Validate WKT Input in createListing()

**Problem:** `lib/supabase/queries.ts` `createListing()` builds WKT via string interpolation: `SRID=4326;POINT(${input.lng} ${input.lat})`. No validation that lng/lat are actually numbers.

**Fix:**
- Before constructing WKT, validate: `typeof input.lng === 'number' && isFinite(input.lng) && typeof input.lat === 'number' && isFinite(input.lat)`
- Validate ranges: lng between -180 and 180, lat between -90 and 90
- Throw descriptive error if validation fails

### 4. Make Onboarding Persist

**Problem:** `app/onboarding/page.tsx` collects intent, location, categories, and bio — then does absolutely nothing with the data. It just shows a preview.

**Fix:**
- On final step, if user is authenticated:
  - Update their profile in Supabase (set `is_producer`, `categories`, `bio`, `location`, `location_label`)
  - Use `createServiceSupabaseClient()` or the authenticated client to update the profile
- If user is NOT authenticated, redirect to login with `?next=/onboarding` and preserve form state (localStorage is fine here as temp storage)
- Show a loading state during profile save
- Handle errors with user-visible feedback

## HIGH PRIORITY FIXES

### 5. Restrict Events Table RLS

**Problem:** Events table allows INSERT from both `authenticated` AND `anon` roles with `WITH CHECK (true)`. Any anonymous visitor can spam millions of rows.

**Fix in `supabase/migrations/` (new migration file `003_fix_events_rls.sql`):**
```sql
DROP POLICY IF EXISTS "events authenticated insert" ON public.events;
CREATE POLICY "events authenticated insert"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### 6. Add Auth Guards to API Routes  

**Problem:** API routes have no authentication checks. `/api/notifications/test` is publicly accessible.

**Fix:**
- `app/api/notifications/test/route.ts` — check for authenticated session via `createServerSupabaseClient().auth.getUser()`, return 401 if not authenticated
- `app/api/follows/route.ts` — same auth check, plus actually wire to Supabase `toggleFollow()`
- `app/api/notifications/subscribe/route.ts` — auth check, store subscription in a new table or Supabase field

### 7. Add Input Validation for Listings

**Problem:** `createListing()` accepts arbitrary strings with no length limits or sanitization.

**Fix:**
- Title: required, max 200 chars, trim whitespace
- Description: optional, max 2000 chars
- Category: must be one of the known categories from `categoryPalette`
- Price label: optional, max 100 chars
- Validate in `createListing()` before the Supabase insert
- Return descriptive validation errors

### 8. Handle toggleFollow Race Condition

**Problem:** `toggleFollow()` does SELECT then conditional INSERT/DELETE — not atomic. Rapid clicks can cause duplicates or errors.

**Fix:**
- Wrap in try/catch, handle unique constraint violation gracefully (treat as "already following")
- Or use Supabase RPC with a PostgreSQL function that does `INSERT ... ON CONFLICT DO NOTHING`
- Add debouncing in the UI follow button (disable button during request)

### 9. Add Error Boundary and Demo Data Banner

**Problem:** Silent fallback to mock data with no user indication. Users think they're seeing real data when they're seeing fake data.

**Fix:**
- Add a visible banner component when `isSupabaseConfigured()` returns false or when a Supabase fetch fails and falls back to mock
- Banner text: "🦝 Showing demo data — sign in to see the real stuff"  
- Add React error boundary in `app/error.tsx` (already exists) — verify it catches render errors in all routes
- In `bridge.ts` and `client-bridge.ts`, log errors to console in development: `if (process.env.NODE_ENV === 'development') console.error(err)`

### 10. Security Headers via next.config.js

**Problem:** No `next.config.js` means no security headers.

**Fix — create `next.config.js`:**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
      ],
    }];
  },
};
module.exports = nextConfig;
```

## MEDIUM PRIORITY (Post-Launch)

### 11. Basic Offline Support in Service Worker
- Add cache-first strategy for static assets (CSS, JS, images)
- Add offline fallback page
- Add network-first for API/data routes

### 12. PWA Icons
- Generate 192x192 and 512x512 PNG icons from Bandit art
- Update manifest.ts with proper icon entries
- Add apple-touch-icon link in layout

### 13. Geo Query Optimization
- Create Supabase RPC function using ST_DWithin for server-side geo filtering
- Replace the "fetch all then filter in JS" pattern in `getListings()` when `near` is specified

### 14. Accessibility Quick Wins
- Add skip-to-main-content link in layout
- Add `aria-label` to map container
- Verify color contrast ratios for badge tones
- Add visible focus indicators to all interactive elements

---

## Build Instructions

1. Create a new branch: `git checkout -b fix/review-fixes`
2. Fix items 1-10 in order
3. Run `npm run build` after each fix to verify no regressions
4. Run `npm run typecheck` to ensure TS is clean
5. Commit after each numbered fix with message: `fix: [N] description`
6. After all fixes, run final `npm run build` and confirm 0 errors

## Context Files You'll Need
- `components/providers/harvestlink-provider.tsx` — God provider (fix #1)
- `components/map/harvestlink-map.tsx` — Map XSS (fix #2)
- `lib/supabase/queries.ts` — WKT injection, race condition (fixes #3, 8)
- `app/onboarding/page.tsx` — Onboarding persistence (fix #4)
- `supabase/migrations/001_initial_schema.sql` — Reference for RLS (fix #5)
- `app/api/*/route.ts` — API auth guards (fix #6)
- `lib/data/bridge.ts` + `lib/data/client-bridge.ts` — Error banner (fix #9)
- `lib/auth/auth-provider.tsx` — Auth context reference

## Environment
- Node 22, Next.js 14.2, TypeScript 5.7
- Supabase with PostGIS, @supabase/ssr
- Branch from `v2-nextjs`
