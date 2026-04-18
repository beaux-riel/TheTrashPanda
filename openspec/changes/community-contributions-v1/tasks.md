# Community Contributions v1 — Implementation Tasks

## Phase 1: Database & Schema
- [ ] Create migration: `contributions` table with indexes
- [ ] Create migration: `producer_claims` table
- [ ] Create migration: `freshness_votes` table with unique constraint
- [ ] Create migration: Add `trust_tier`, `contribution_count`, `first_contribution_at` to `profiles`
- [ ] Create migration: Add `is_community_maintained`, `contributed_by` to `producers`
- [ ] Create migration: Add `contributed_by`, `freshness_confirmed_at`, `stale_flag_count` to `listings`
- [ ] Create RLS policies for `contributions` (read, create, review)
- [ ] Create RLS policies for `producer_claims`
- [ ] Create RLS policies for `freshness_votes`
- [ ] Update existing RLS on `producers` to allow community-maintained inserts
- [ ] Update existing RLS on `listings` to allow contributed listings
- [ ] Seed test data: sample contributions, a claimed profile, freshness votes

## Phase 2: API Routes
- [ ] `POST /api/contributions` — create contribution with trust-tier-based auto-approve
- [ ] `GET /api/contributions?status=pending` — list pending (Trusted+ auth check)
- [ ] `POST /api/contributions/:id/approve` — approve contribution, apply payload changes
- [ ] `POST /api/contributions/:id/reject` — reject contribution
- [ ] `POST /api/contributions/:id/revert` — revert approved contribution, rollback changes
- [ ] `POST /api/claims` — submit profile claim, send verification
- [ ] `POST /api/claims/:id/verify` — verify claim with code, promote to Verified
- [ ] `POST /api/freshness` — cast freshness vote (upsert, enforce one-per-user)
- [ ] `GET /api/freshness/:listingId` — aggregate freshness data
- [ ] Trust tier promotion check — run on contribution approval, auto-promote when threshold met
- [ ] Rate limiting middleware for contribution endpoints

## Phase 3: UI — Contribution Forms
- [ ] "Add a neighbour" button and form on `/producers` (Neighbours) page
- [ ] "Post what they've got" button and form on producer profile pages
- [ ] "Update availability" quick-action button on listing cards in feed
- [ ] Contribution form component (shared between profile create/edit and listing create/edit)
- [ ] Category selector reuse from existing onboarding
- [ ] Location picker reuse from existing onboarding (neighbourhood-level only)
- [ ] Contributor attribution badge component ("Spotted by [name]")
- [ ] "Community-maintained" badge on unclaimed producer profiles
- [ ] "This is me — claim this profile" CTA on community-maintained profiles

## Phase 4: UI — Review & History
- [ ] Review queue page at `/dashboard/reviews` (Trusted+ only)
- [ ] Pending contribution card with approve/reject actions
- [ ] Contribution diff view (what changed)
- [ ] Revision history drawer/panel on producer profiles
- [ ] Revision history drawer/panel on listings
- [ ] Revert action on individual revisions (Verified+ only)

## Phase 5: Freshness & Trust
- [ ] "Still accurate?" widget on listing detail page
- [ ] "Still accurate?" compact widget on listing cards in feed
- [ ] Freshness summary display ("Confirmed 2h ago" / "May be outdated")
- [ ] Auto-hide listings with 3+ stale flags
- [ ] Stale flag notification to producer/contributor
- [ ] Trust tier badge on user profiles
- [ ] Trust tier promotion notification
- [ ] Contributor profile page showing contribution history and stats

## Phase 6: Claim Flow
- [ ] Claim initiation UI ("This is me" button → verification form)
- [ ] Email/phone verification code sending (via Supabase or Resend)
- [ ] Verification code entry and validation
- [ ] Post-claim profile takeover (Verified status, notification preferences)
- [ ] Notification to community contributors when a profile is claimed

## Phase 7: Abuse Prevention
- [ ] Rate limiting: max 10 contributions per hour per user
- [ ] Privacy guard: warn on exact address entry, store but don't display
- [ ] Report button on profiles and listings
- [ ] Auto-hide on 3+ reports, queue for review
- [ ] Spam detection: flag rapid-fire submissions for manual review

## Phase 8: Integration & Events
- [ ] Emit contribution events to community-data event pipeline
- [ ] Update community dashboard seed data to include contribution metrics
- [ ] Add contribution count to producer profile cards
- [ ] Add "Recently updated by community" section to homepage (optional)
