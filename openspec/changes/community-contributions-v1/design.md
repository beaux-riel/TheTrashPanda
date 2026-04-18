# Community Contributions v1 — Technical Design

## Database Schema

### New Tables

#### `contributions`
The central audit log for all community contributions. Every proposed change — whether a new profile, a listing, an edit, or a freshness vote — is recorded here.

```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID NOT NULL REFERENCES profiles(id),
  producer_id UUID REFERENCES producers(id),        -- null for new producer proposals
  listing_id UUID REFERENCES listings(id),           -- null for profile-level contributions
  type TEXT NOT NULL CHECK (type IN (
    'profile_create', 'profile_edit',
    'listing_create', 'listing_edit',
    'availability_update', 'flag_stale', 'confirm_fresh'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'auto_approved', 'reverted'
  )),
  payload JSONB NOT NULL,                             -- the proposed data changes
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  reverted_by UUID REFERENCES profiles(id),
  reverted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contributions_producer ON contributions(producer_id);
CREATE INDEX idx_contributions_contributor ON contributions(contributor_id);
CREATE INDEX idx_contributions_status ON contributions(status) WHERE status = 'pending';
CREATE INDEX idx_contributions_type ON contributions(type);
```

#### `producer_claims`
Tracks profile ownership claims. A claimed profile grants Verified status.

```sql
CREATE TABLE producer_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID NOT NULL REFERENCES producers(id) UNIQUE,
  claimed_by UUID NOT NULL REFERENCES profiles(id),
  verification_method TEXT NOT NULL CHECK (verification_method IN (
    'email', 'phone', 'admin', 'in_person'
  )),
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `freshness_votes`
Lightweight crowdsourced accuracy signals on listings.

```sql
CREATE TABLE freshness_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES profiles(id),
  is_fresh BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id, voter_id)                        -- one vote per user per listing
);

CREATE INDEX idx_freshness_listing ON freshness_votes(listing_id);
```

### Modified Tables

#### `profiles` — add trust tier tracking
```sql
ALTER TABLE profiles
  ADD COLUMN trust_tier TEXT NOT NULL DEFAULT 'new'
    CHECK (trust_tier IN ('new', 'trusted', 'verified')),
  ADD COLUMN contribution_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN first_contribution_at TIMESTAMPTZ;
```

#### `producers` — add community-maintained flag and claimed status
```sql
ALTER TABLE producers
  ADD COLUMN is_community_maintained BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN contributed_by UUID REFERENCES profiles(id);
```

#### `listings` — add contributor attribution
```sql
ALTER TABLE listings
  ADD COLUMN contributed_by UUID REFERENCES profiles(id),
  ADD COLUMN freshness_confirmed_at TIMESTAMPTZ,
  ADD COLUMN stale_flag_count INTEGER NOT NULL DEFAULT 0;
```

## Trust Tier Logic

### Promotion Rules
- **New → Trusted**: `contribution_count >= 5` AND `first_contribution_at <= now() - interval '30 days'`
- **Any → Verified**: User claims a producer profile and verification succeeds
- Trust tier is checked on every contribution submission to determine auto-approve vs. queue

### Auto-Approve Logic
```
IF contributor.trust_tier = 'trusted' OR contributor.trust_tier = 'verified':
  contribution.status = 'auto_approved'
  apply changes immediately
ELSE:
  contribution.status = 'pending'
  notify reviewers
```

### Verified Producer Override
When a Verified producer exists for a profile:
- Community edits to their profile → status = 'pending', producer notified
- Community listings on their behalf → status = 'pending', producer notified
- Producer's own edits → always auto-approved, no contribution record needed

## API Endpoints

### Contributions
- `POST /api/contributions` — submit a contribution (profile create/edit, listing create/edit, availability update)
- `GET /api/contributions?status=pending` — list pending contributions (Trusted+ only)
- `POST /api/contributions/:id/approve` — approve a pending contribution (Trusted+ or profile owner)
- `POST /api/contributions/:id/reject` — reject a pending contribution
- `POST /api/contributions/:id/revert` — revert an approved contribution

### Claims
- `POST /api/claims` — submit a profile claim
- `POST /api/claims/:id/verify` — verify a claim (with code)

### Freshness
- `POST /api/freshness` — vote on listing freshness
- `GET /api/freshness/:listingId` — get freshness summary for a listing

## RLS Policies

```sql
-- Anyone can read approved contributions
CREATE POLICY contributions_read ON contributions
  FOR SELECT USING (status IN ('approved', 'auto_approved'));

-- Authenticated users can create contributions
CREATE POLICY contributions_create ON contributions
  FOR INSERT WITH CHECK (auth.uid() = contributor_id);

-- Trusted+ users can review contributions
CREATE POLICY contributions_review ON contributions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND trust_tier IN ('trusted', 'verified')
    )
  );

-- Verified producers can review contributions to their profile
CREATE POLICY contributions_producer_review ON contributions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM producer_claims
      WHERE producer_id = contributions.producer_id
      AND claimed_by = auth.uid()
    )
  );

-- Anyone authenticated can vote on freshness
CREATE POLICY freshness_create ON freshness_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- One vote per user per listing (enforced by unique constraint)
```

## UI Components Needed

1. **"Add a neighbour" button** — on the Neighbours page, triggers profile creation form
2. **"Post what they've got" button** — on producer profile, triggers listing form with producer pre-selected
3. **"Update availability" button** — on listing cards, quick status change
4. **"Still accurate?" widget** — on every listing, thumbs up/down freshness vote
5. **"This is me" claim button** — on community-maintained profiles
6. **Review queue page** — `/dashboard/reviews` for Trusted+ users
7. **Revision history drawer** — slide-out panel showing edit history
8. **Contributor badge** — "Spotted by [name]" on community-posted listings
9. **Community-maintained badge** — on unclaimed profiles
10. **Trust tier indicator** — on contributor profiles

## Event Pipeline Integration
All contributions emit events to the existing community-data event pipeline:
- `contribution.created`, `contribution.approved`, `contribution.rejected`
- `profile.claimed`, `freshness.voted`
- These feed into the Le-WM world model for community health metrics
