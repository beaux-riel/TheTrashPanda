# PWA & Technical Foundation

## Purpose
HarvestLink is a Progressive Web App — no app store, no gatekeeping, works on any phone with a browser. This spec defines the technical foundation that everything else builds on. Performance, offline capability, and accessibility are not afterthoughts — they're requirements for an app that needs to work for a 70-year-old farmer checking their phone between chores.

## Requirements

### Requirement: Progressive Web App
The system SHALL be a Progressive Web App (PWA) installable on mobile and desktop. The system SHALL prompt users to "Add to Home Screen" at an appropriate moment.

#### Scenario: Install prompt
- GIVEN a user has visited HarvestLink 3+ times
- WHEN they next visit
- THEN a non-intrusive install banner appears: "Add HarvestLink to your home screen for quick access"
- AND the banner includes Bandit holding a phone
- AND dismissing the banner does not show it again for 30 days

#### Scenario: Installed PWA experience
- GIVEN a user has installed HarvestLink to their home screen
- WHEN they open it
- THEN it launches in standalone mode (no browser chrome)
- AND it feels like a native app with smooth transitions
- AND the splash screen shows Bandit and the HarvestLink logo

### Requirement: Offline support
The system SHALL provide basic offline functionality for cached content. The system SHALL clearly indicate when content may be stale.

#### Scenario: Offline — cached content available
- GIVEN a user has previously viewed the map and listings
- WHEN they open HarvestLink without internet
- THEN cached listings and map tiles are displayed
- AND a banner reads "You're offline — showing what we last saw. Connect to get fresh listings."

#### Scenario: Offline — no cached content
- GIVEN a user has never opened HarvestLink before
- WHEN they try to access it without internet
- THEN a friendly offline page is shown with Bandit sitting in the rain
- AND the message reads "We need internet to load the map. Try again when you're connected."

#### Scenario: Back online
- GIVEN a user was viewing cached content offline
- WHEN they regain internet connection
- THEN the app automatically refreshes with current data
- AND a subtle toast confirms "Back online — everything's fresh now"

### Requirement: Service worker
The system SHALL use a service worker to cache: static assets, map tiles for the user's area, recently viewed listings, and producer profiles.

#### Scenario: Map tile caching
- GIVEN a user frequently views the Powell River area
- WHEN map tiles for that area are loaded
- THEN they are cached for offline use
- AND cache is refreshed when online with a stale-while-revalidate strategy

#### Scenario: Cache management
- GIVEN the cache grows over time
- WHEN it exceeds 50MB
- THEN oldest cached items are evicted
- AND the user's home area and followed producers are prioritized for retention

### Requirement: Performance
The system SHALL achieve first meaningful paint under 2 seconds on a 3G connection. The system SHALL achieve a Lighthouse performance score of 90+.

#### Scenario: First load performance
- GIVEN a user on a slow connection visits HarvestLink
- WHEN the page loads
- THEN the map skeleton and navigation appear within 2 seconds
- AND listing data loads progressively (skeleton cards → real content)
- AND images lazy-load as they enter the viewport

#### Scenario: Subsequent loads
- GIVEN a user has visited HarvestLink before
- WHEN they return
- THEN cached assets make the load near-instant
- AND only new listing data is fetched from the network

### Requirement: Responsive design
The system SHALL be mobile-first responsive. The system SHALL provide a good experience on screens from 320px to 1920px wide.

#### Scenario: Mobile experience (primary)
- GIVEN a user is on a phone (320–480px)
- WHEN they use HarvestLink
- THEN the map fills most of the screen
- AND the feed is a single-column card layout
- AND all touch targets are at least 44px
- AND bottom navigation is used for primary actions

#### Scenario: Desktop experience
- GIVEN a user is on a desktop (1024px+)
- WHEN they use HarvestLink
- THEN the map takes 60% of the viewport with a sidebar feed
- AND producer profiles have a richer layout
- AND hover states provide additional context

#### Scenario: Tablet experience
- GIVEN a user is on a tablet (768–1024px)
- WHEN they use HarvestLink
- THEN the layout adapts to use available space
- AND the map and feed can be viewed side-by-side

### Requirement: Accessibility
The system SHALL comply with WCAG 2.1 AA standards. The system SHALL be fully navigable by keyboard and screen reader.

#### Scenario: Keyboard navigation
- GIVEN a user navigates with keyboard only
- WHEN they tab through the app
- THEN all interactive elements are reachable
- AND focus indicators are clearly visible
- AND the map is navigable with arrow keys

#### Scenario: Screen reader support
- GIVEN a screen reader user browses listings
- WHEN listings are read aloud
- THEN each listing conveys: title, producer, category, quantity, distance
- AND map pins have descriptive labels: "Egg listing from [producer], 400m away"

#### Scenario: Colour contrast
- GIVEN the brand colour palette is applied
- WHEN text is displayed over backgrounds
- THEN all text meets WCAG AA contrast ratios (4.5:1 for body, 3:1 for large text)
- AND category colours are distinguishable for colour-blind users (patterns/shapes supplement colour)

### Requirement: SEO
The system SHALL server-render listing pages and producer profiles for search engine indexing.

#### Scenario: Google search for local food
- GIVEN someone searches "eggs Powell River"
- WHEN Google results load
- THEN active HarvestLink listings for eggs in Powell River appear in results
- AND the result shows a rich snippet with producer name, item, and availability

#### Scenario: Shared listing link
- GIVEN a producer shares their listing link on Facebook
- WHEN the link preview generates
- THEN it shows: listing title, producer name, thumbnail photo, and description
- AND OpenGraph tags provide rich preview data

### Requirement: Privacy-respecting analytics
The system SHALL use privacy-respecting analytics with no third-party trackers. The system SHOULD use self-hosted analytics (e.g., Plausible or Umami).

#### Scenario: Analytics collection
- GIVEN a user browses HarvestLink
- WHEN page views and interactions occur
- THEN analytics are collected without cookies or personal identifiers
- AND no data is shared with third parties
- AND analytics comply with PIPEDA (Canadian privacy law)

### Requirement: Supabase Realtime
The system SHALL use Supabase Realtime for live updates to the map and feed when new listings are posted.

#### Scenario: Real-time listing appearance
- GIVEN a consumer is viewing the map
- WHEN a producer publishes a new listing in the visible area
- THEN the new pin appears on the map within 5 seconds
- AND a subtle animation draws attention to the new pin
- AND no page refresh is required

#### Scenario: Real-time quantity update
- GIVEN a consumer is viewing a listing
- WHEN the producer updates the quantity from "Plenty" to "Last few"
- THEN the listing updates in real-time
- AND the urgency indicator changes immediately

### Requirement: Tech stack
The system SHALL be built with: Next.js (App Router), Supabase (Auth, Database with PostGIS, Realtime, Storage), Mapbox GL JS, and deployed on Vercel.

#### Scenario: Database with PostGIS
- GIVEN listings have geographic coordinates
- WHEN distance queries are performed
- THEN PostGIS spatial queries handle radius filtering and distance calculation efficiently
- AND queries for "listings within X km" execute in under 100ms

#### Scenario: Image storage
- GIVEN producers upload listing photos
- WHEN photos are stored
- THEN Supabase Storage handles upload, transformation (resize/compress), and CDN delivery
- AND original photos are not served directly (privacy + performance)
