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
- [ ] Build follow/unfollow producer functionality
- [ ] Implement follow categories
- [ ] Set up Web Push API integration
- [ ] Create notification permission request flow
- [ ] Build in-app notification centre
- [ ] Implement notification preferences (immediate/daily/off)
- [ ] Create push notification content with brand voice

## Phase 6: Producer Dashboard
- [ ] Build dashboard overview (active listings, followers, views)
- [ ] Create quick post shortcut
- [ ] Build listing management view
- [ ] Implement follower list
- [ ] Add basic analytics (listing views, popular items)
- [ ] Create operating schedule editor

## Phase 7: Brand & Polish
- [ ] Create Bandit SVG illustrations (loading, empty, error, onboarding, seasonal)
- [ ] Implement seasonal theming (colour shifts based on month)
- [ ] Write all microcopy in brand voice
- [ ] Build custom 404 page
- [ ] Build custom error page
- [ ] Add micro-interactions (follow animation, listing posted celebration)
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add alt text to all illustrations
- [ ] Implement prefers-reduced-motion support
- [ ] SEO: OpenGraph tags, server-rendered listing pages
- [ ] Performance audit: target Lighthouse 90+
