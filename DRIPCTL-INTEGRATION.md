# DripCtl Integration Task

## Context
The Trash Panda is a community food network (Next.js 14 App Router). It already has a centralized event pipeline at `lib/events/emit.ts` that fires events to Supabase for analytics. We need to extend this to also push events to DripCtl — an API-first email sequence engine — for all notification/communication flows.

**DripCtl SDK**: `@dripctl/sdk@0.2.1` (already installed in package.json)
**DripCtl API**: `https://api.dripctl.dev` (live, running)
**SDK docs**: See `node_modules/@dripctl/sdk/dist/index.d.ts` for types

## What to Build

### 1. DripCtl Client Singleton (`lib/dripctl/client.ts`)
- Create a singleton DripCtl instance using env vars `DRIPCTL_API_KEY` and `DRIPCTL_TENANT_ID`
- Export a `getDripCtl()` function that returns null if env vars aren't set (graceful degradation like we do for Supabase)
- Server-side only (uses env vars without NEXT_PUBLIC_ prefix)

### 2. Event Map (`lib/dripctl/event-map.ts`)
- Map our Le-WM event types to DripCtl event types with payload transforms
- Our event types (from `lib/supabase/types.ts` EventType): `listing.created`, `listing.updated`, `listing.gone`, `listing.expired`, `demand.search`, `demand.filter`, `demand.view`, `demand.follow`, `follow.created`, `follow.removed`, `contribution.submitted`, `contribution.approved`, `contribution.rejected`, `freshness.voted`, `claim.submitted`, `claim.approved`
- Not all need to go to DripCtl — skip `demand.search`, `demand.filter`, `demand.view` (too noisy)
- The rest should map to DripCtl events. Include userId when available.

### 3. Extend `lib/events/emit.ts`
- Add an optional `userId` parameter to `EmitEventInput`
- After the Supabase insert, also fire the event to DripCtl (fire-and-forget, same pattern — never throw)
- Use the event map to transform the event type and payload
- Skip DripCtl if client is null (env not configured)

### 4. Sequence Definitions (`lib/dripctl/sequences.ts`)
- Use the SDK builder functions (`sequence`, `send`, `wait`, `condition`, `exit`)
- Define these sequences:

**a) Onboarding Drip** (`trash-panda-onboarding`)
- Trigger: `user.signup`
- Steps: send welcome → wait 3 days → send "what's near you" → wait 5 days → send "list your first item"

**b) New Listing Alert** (`new-listing-alert`)
- Trigger: `listing.created`
- Steps: send notification to followers

**c) Freshness Nudge** (`freshness-nudge`)
- Trigger: `listing.stale` (we'll need to emit this from a cron or check)
- Steps: send "is this still available?" → wait 3 days → condition (updated? yes→exit, no→send "listing expired soon")

**d) Re-engagement** (`producer-reengagement`)
- Trigger: `producer.inactive`
- Steps: send "your neighbours miss you" → wait 7 days → condition (posted? yes→exit, no→send "last chance" → exit)

**e) Weekly Digest** (`weekly-digest`)
- Trigger: `digest.weekly` (scheduled externally)
- Steps: send weekly summary

**f) Follow Confirmation** (`follow-confirmation`)
- Trigger: `follow.created`
- Steps: send "you're now following {producer}"

### 5. Sequence Deployment Route (`app/api/admin/deploy-sequences/route.ts`)
- POST endpoint that deploys all sequences to DripCtl
- Protected: only works if caller provides correct admin secret (use `DRIPCTL_ADMIN_SECRET` env var, check via header)
- Calls `dripctl.sequences.create()` for each sequence
- Returns results (which succeeded, which failed)

### 6. Update API Routes to Pass userId
- Update the existing API routes that call `emitEvent()` to also pass `userId` when available from the auth context
- Files to check: `app/api/contributions/route.ts`, `app/api/freshness/route.ts`, `app/api/claims/route.ts`, `app/api/listings/route.ts` (if exists)

### 7. Environment Variables
- Add to `.env.local`: `DRIPCTL_API_KEY` and `DRIPCTL_TENANT_ID` (use placeholder values like `dpct_xxx` and `tenant_xxx` since we need real ones from Beaux)
- Add `DRIPCTL_ADMIN_SECRET` for the deploy endpoint

## Constraints
- Fire-and-forget pattern for DripCtl — NEVER let DripCtl errors break the request path
- Server-side only — no NEXT_PUBLIC_ env vars for DripCtl
- Graceful degradation — everything works without DripCtl configured
- Keep the existing Supabase event pipeline intact (additive, not replacement)
- TypeScript strict, no `any` where avoidable
- Build must pass (`npm run build`) with zero errors

## Files to Create
- `lib/dripctl/client.ts`
- `lib/dripctl/event-map.ts`
- `lib/dripctl/sequences.ts`
- `app/api/admin/deploy-sequences/route.ts`

## Files to Modify
- `lib/events/emit.ts` (extend with DripCtl push)
- `app/api/contributions/route.ts` (pass userId)
- `app/api/freshness/route.ts` (pass userId)
- `app/api/claims/route.ts` (pass userId)
- `.env.local` (add DripCtl vars)
