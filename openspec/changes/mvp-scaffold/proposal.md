# MVP Scaffold — Project Foundation

## What
Scaffold the HarvestLink v2 application from scratch using Next.js (App Router), Supabase, and Mapbox GL JS as a Progressive Web App. This replaces the old React Native prototype with a modern web-first architecture.

## Why
The original HarvestLink was a React Native prototype from 2024. The new vision is a community food network — not a marketplace — that needs to work on any device without app store friction. A PWA with Next.js gives us server rendering (SEO for "Powell River eggs"), offline support, and instant deploys via Vercel.

## Scope

### In scope
- Next.js 14+ App Router project structure
- Supabase integration (auth, database with PostGIS, realtime, storage)
- Database schema for: profiles, listings, follows, categories
- Magic link authentication flow
- Producer and consumer profile creation
- Listing CRUD (create, read, update, mark as gone, auto-expire)
- Map view with Mapbox GL JS showing listing pins
- Feed view with listing cards
- Search and category filtering
- Follow producers with web push notifications
- Producer dashboard with quick post and listing management
- PWA manifest and service worker
- Responsive mobile-first design
- Brand personality layer (Bandit mascot placements, copy voice, seasonal theming)
- Onboarding flows for producers and consumers

### Out of scope (Phase 2)
- Community intelligence dashboard
- Le-WM integration
- Seasonal calendar
- Demand signal analytics
- Multi-community support
- Email notification digests
- QR code generation
- Advanced analytics for producers

## Success criteria
- A working PWA deployable on Vercel
- Guest users can browse map and feed without signup
- Producers can sign up, create profile, and post listings
- Consumers can sign up, follow producers, and receive push notifications
- Map shows real listing pins with category colours
- All brand personality requirements met (Bandit, voice, seasonal theming)
- Lighthouse performance score 90+
- WCAG 2.1 AA accessible

## Specs referenced
- auth, listings, discovery, following, producer-dashboard, onboarding, brand-personality, pwa
