# Community Contributions v1 — Wikipedia Model for Food Networks

## What
Implement a community contribution system where any authenticated user can propose producer profiles and post listings on behalf of producers. Includes a three-tier trust model (New → Trusted → Verified), revision history, profile claiming, and freshness voting.

## Why
The Trash Panda's core users — retirees with fruit trees, families with garden surplus, hobby bakers — will never sign up for an app and maintain their own profiles. But their neighbours already know what they have. By enabling community contributions, we solve the cold start problem and create a network effect: every contribution makes the platform more valuable for everyone.

This is the single most important feature for early growth. Without it, the platform requires producers to self-serve, which creates a barrier that eliminates 80%+ of the local food network.

## Scope

### In scope
- Database schema: `contributions`, `producer_claims`, trust tier tracking
- Contribution API: create profiles, post listings, update availability on behalf of producers
- Trust tier system: New (queued), Trusted (auto-approve), Verified (full control)
- Revision history: append-only edit log for all profiles and listings
- Profile claiming: producers can claim community-created profiles
- Freshness voting: "Still accurate?" lightweight crowdsourced signals
- Contributor attribution: "Spotted by [name]" on community-posted listings
- Review queue UI for Trusted users to approve/reject pending contributions
- Abuse prevention: rate limiting, privacy warnings, report system
- RLS policies for contribution access control

### Out of scope (Phase 2)
- POS integration sync (Stripe/Square) — separate change
- Contributor leaderboards or gamification
- Automated trust scoring based on ML
- Community moderation dashboard (admin panel)
- Verification via government ID or business license

## Success criteria
- Any authenticated user can create a producer profile for a neighbour
- Any authenticated user can post a listing on behalf of a producer
- New contributors' submissions go into a review queue
- Trusted contributors' edits go live immediately
- Producers can claim profiles and get Verified status
- Full revision history is viewable for any profile or listing
- Freshness voting works on all listings
- RLS prevents unauthorized access to contribution data
- No PII exposure in community-maintained profiles (neighbourhood-level location only)

## Specs referenced
- community-contributions
