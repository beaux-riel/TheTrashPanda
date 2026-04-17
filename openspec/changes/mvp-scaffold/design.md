# MVP Scaffold — Technical Design

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Vercel                       │
│  ┌─────────────────────────────────────┐     │
│  │         Next.js App Router          │     │
│  │  ┌──────────┐  ┌────────────────┐   │     │
│  │  │  Pages/  │  │  API Routes    │   │     │
│  │  │  Layout  │  │  (server)      │   │     │
│  │  └──────────┘  └────────────────┘   │     │
│  │  ┌──────────┐  ┌────────────────┐   │     │
│  │  │Components│  │  Server        │   │     │
│  │  │(client)  │  │  Actions       │   │     │
│  │  └──────────┘  └────────────────┘   │     │
│  └─────────────────────────────────────┘     │
└──────────────────┬──────────────────────────┘
                   │
     ┌─────────────┼──────────────┐
     ▼             ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│Supabase │  │ Supabase │  │ Mapbox   │
│Auth     │  │ DB+      │  │ GL JS    │
│(magic   │  │ PostGIS  │  │          │
│ link)   │  │ Realtime │  │          │
│         │  │ Storage  │  │          │
└─────────┘  └──────────┘  └──────────┘
```

## Directory Structure

```
harvestlink/
├── app/
│   ├── layout.tsx              # Root layout, providers, nav
│   ├── page.tsx                # Landing/map (default view)
│   ├── (auth)/
│   │   ├── login/page.tsx      # Magic link login
│   │   ├── callback/route.ts   # Auth callback handler
│   │   └── onboarding/
│   │       ├── producer/page.tsx
│   │       └── consumer/page.tsx
│   ├── (app)/
│   │   ├── map/page.tsx        # Map view (primary)
│   │   ├── feed/page.tsx       # Feed view
│   │   ├── search/page.tsx     # Search results
│   │   ├── listing/[id]/page.tsx  # Listing detail
│   │   └── producer/[id]/page.tsx # Producer profile
│   ├── dashboard/
│   │   ├── page.tsx            # Producer dashboard
│   │   ├── listings/page.tsx   # Manage listings
│   │   ├── new/page.tsx        # Create listing
│   │   └── followers/page.tsx  # View followers
│   └── api/
│       ├── listings/route.ts
│       ├── notifications/route.ts
│       └── webhooks/route.ts
├── components/
│   ├── map/                    # Map components
│   ├── listings/               # Listing cards, forms
│   ├── brand/                  # Bandit, illustrations, seasonal
│   ├── navigation/             # Nav, bottom bar
│   └── ui/                     # Shared UI primitives
├── lib/
│   ├── supabase/               # Client, server, types
│   ├── mapbox/                 # Map utilities
│   ├── notifications/          # Push notification logic
│   └── utils/                  # Helpers, formatters
├── public/
│   ├── bandit/                 # Mascot SVGs/illustrations
│   ├── illustrations/          # Brand illustrations
│   └── manifest.json           # PWA manifest
├── styles/
│   └── globals.css             # Tailwind + brand tokens
├── supabase/
│   ├── migrations/             # Database migrations
│   └── seed.sql                # Powell River seed data
└── openspec/                   # Specs (already written)
```

## Database Schema

### profiles
- id (uuid, PK, references auth.users)
- display_name (text, required)
- bio (text, optional)
- avatar_url (text, optional)
- location (geography(Point, 4326), optional)
- location_label (text, optional — "Cranberry, Powell River")
- is_producer (boolean, default false)
- is_consumer (boolean, default true)
- categories (text[], for producers)
- operating_schedule (jsonb, optional)
- pickup_details (text, optional)
- notification_prefs (jsonb, default: {frequency: 'immediate'})
- created_at, updated_at

### listings
- id (uuid, PK)
- producer_id (uuid, FK → profiles)
- title (text, required)
- description (text, optional)
- category (text, required — enum-like)
- quantity (text — 'plenty', 'some', 'last_few')
- price_type (text — 'fixed', 'free', 'honour', 'ask')
- price_amount (numeric, optional)
- photos (text[], storage URLs)
- location (geography(Point, 4326), defaults to producer location)
- location_label (text, optional)
- available_until (timestamptz, default: now + 7 days)
- status (text — 'active', 'gone', 'expired')
- created_at, updated_at

### follows
- id (uuid, PK)
- follower_id (uuid, FK → profiles)
- follow_type (text — 'producer', 'category', 'area')
- target_producer_id (uuid, FK → profiles, nullable)
- target_category (text, nullable)
- target_area (geography(Polygon, 4326), nullable)
- target_radius_km (numeric, nullable)
- notification_frequency (text — 'immediate', 'daily', 'off')
- muted (boolean, default false)
- created_at

### push_subscriptions
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- subscription (jsonb — web push subscription object)
- created_at

### search_signals (for future community data)
- id (uuid, PK)
- query (text)
- category_match (text, nullable)
- area_hash (text — anonymized location)
- result_count (integer)
- created_at

## Key Decisions
- **Tailwind CSS** for styling — fast, responsive, customizable
- **PostGIS** for all geospatial queries — distance calc, radius filtering
- **Supabase Realtime** subscriptions for live feed/map updates
- **Server Components** by default, Client Components only for interactive pieces (map, forms)
- **Web Push API** for notifications (no third-party push service)
- **Supabase Storage** with image transforms for listing photos
- **RLS policies** on all tables — users can only modify their own data
