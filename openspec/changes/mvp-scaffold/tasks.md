# MVP Scaffold — Tasks

## Phase 1: Foundation
- [ ] Initialize Next.js 14+ project with App Router and TypeScript
- [ ] Configure Tailwind CSS with brand colour tokens from BRAND.md
- [ ] Set up Supabase client (server + client helpers)
- [ ] Create database migrations (profiles, listings, follows, push_subscriptions, search_signals)
- [ ] Enable PostGIS extension
- [ ] Set up RLS policies for all tables
- [ ] Configure PWA manifest and service worker
- [ ] Create root layout with responsive navigation shell

## Phase 2: Authentication & Profiles
- [ ] Implement Supabase magic link auth flow
- [ ] Create login page with brand voice
- [ ] Handle auth callback and session management
- [ ] Build producer onboarding wizard (3 steps: identity, offerings, location)
- [ ] Build consumer onboarding (location + preferences)
- [ ] Create profile editing page
- [ ] Implement dual-role switching (consumer ↔ producer)

## Phase 3: Listings
- [ ] Create listing form with all fields (title, category, quantity, price, photos, expiry, location)
- [ ] Implement image upload with client-side compression
- [ ] Build listing detail page
- [ ] Implement "Gone!" quick action
- [ ] Implement quick repost from listing history
- [ ] Build listing management (edit, delete, expire)
- [ ] Set up auto-expiry cron/function for expired listings
- [ ] Add seasonal tag suggestions

## Phase 4: Discovery
- [ ] Integrate Mapbox GL JS with map component
- [ ] Create listing pins with category colour coding
- [ ] Implement pin clustering at zoom levels
- [ ] Build pin tap → preview card interaction
- [ ] Create feed view with listing cards
- [ ] Implement search (product, producer, category)
- [ ] Build filter bar (category, distance, availability, price type)
- [ ] Implement geolocation detection with manual fallback
- [ ] Set up Supabase Realtime for live listing updates
- [ ] Create empty states with Bandit illustrations

## Phase 5: Following & Notifications
- [x] Build follow/unfollow producer functionality
- [x] Implement follow categories
- [x] Set up Web Push API integration
- [x] Create notification permission request flow
- [x] Build in-app notification centre
- [x] Implement notification preferences (immediate/daily/off)
- [x] Create push notification content with brand voice

## Phase 6: Producer Dashboard
- [x] Build dashboard overview (active listings, followers, views)
- [x] Create quick post shortcut
- [x] Build listing management view
- [x] Implement follower list
- [x] Add basic analytics (listing views, popular items)
- [x] Create operating schedule editor

## Phase 7: Brand & Polish
- [x] Create Bandit SVG illustrations (loading, empty, error, onboarding, seasonal)
- [x] Implement seasonal theming (colour shifts based on month)
- [x] Write all microcopy in brand voice
- [x] Build custom 404 page
- [x] Build custom error page
- [x] Add micro-interactions (follow animation, listing posted celebration)
- [x] Ensure WCAG 2.1 AA compliance
- [x] Add alt text to all illustrations
- [x] Implement prefers-reduced-motion support
- [x] SEO: OpenGraph tags, server-rendered listing pages
- [x] Performance audit: target Lighthouse 90+
