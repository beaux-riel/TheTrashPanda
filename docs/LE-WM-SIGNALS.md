# Le-WM: World Model Signals Architecture

*How HarvestLink understands its community's food resilience.*

---

## Philosophy

HarvestLink captures two types of signals:

1. **Internal events** — what happens inside the app (listings, searches, follows, views)
2. **External signals** — what happens in the world that affects local food (weather, fuel, ferries, supply chains)

By correlating these over time, we build a **world model** of local food infrastructure. Not for surveillance — for resilience.

## Internal Events (app-generated)

Append-only `events` table. Anonymized area hashes, no PII.

| Event Type | What It Captures |
|---|---|
| `listing.created` | New food available |
| `listing.updated` | Quantity/price changes |
| `listing.gone` | Sold out or pulled |
| `listing.expired` | Auto-expired (time limit) |
| `demand.search` | What people are looking for |
| `demand.filter` | Category/distance preferences |
| `demand.view` | What gets attention |
| `demand.follow` | Persistent interest signals |
| `follow.created` | New producer/category/area follow |
| `follow.removed` | Lost interest |

## External Signals (world-generated)

`external_signals` table. Collected via cron jobs, APIs, and manual entry.

| Signal Type | Source Ideas | Why It Matters |
|---|---|---|
| `fuel_price` | GasBuddy API, manual entry | Transport cost → food price correlation |
| `ferry_status` | BC Ferries API, scraping | Ferry cancelled → does local listing activity spike? |
| `weather` | Environment Canada API (weather.gc.ca) | Rain/frost → seasonal supply patterns |
| `grocery_price` | Manual tracking, receipt scanning | Are grocery prices rising? Is local becoming competitive? |
| `supply_alert` | News APIs, manual flags | Global disruption → local impact tracking |
| `seasonal_marker` | Manual + weather data | First frost, growing season, harvest windows |

## Correlations We Want to Discover

Over time (months/years of data), we can answer:

- **Ferry cancellation → local spike**: When the ferry doesn't run, do egg/bread listings increase within 24h?
- **Fuel price → listing price**: As gas rises, do local food prices stay stable while grocery prices climb?
- **Seasonal patterns**: What's Powell River's true growing calendar? When do specific categories peak?
- **Supply gaps**: What categories have persistent demand (searches) but low supply (listings)?
- **Resilience score**: How self-sufficient is the community? What % of food demand could be met locally?
- **Weather impact**: Does a week of rain kill listing activity, or do greenhouse/preserved goods fill the gap?
- **Price advantage**: At what fuel price point does local food become cheaper than grocery store equivalents?

## Data Collection Strategy

### Phase 1 (MVP — manual + free APIs)
- Weather: Environment Canada RSS/API (free)
- Ferry: BC Ferries status page scraping or community reports
- Fuel: Manual entry or GasBuddy (if API accessible)
- Seasonal: Manual markers by producers ("first tomatoes!", "last frost")

### Phase 2 (automated)
- Cron jobs fetching weather daily
- Ferry status webhook or polling
- Fuel price tracking via scraping
- Grocery price tracking (receipt photo → OCR → price extraction)

### Phase 3 (community-driven)
- Producers mark seasonal events in-app
- Community members report fuel prices
- Collective grocery price tracking
- Ferry status crowdsourced (faster than official updates)

## Privacy

- Internal events are anonymized (area hashes, no user IDs)
- External signals are public data (weather, fuel prices, ferry status)
- No individual tracking — only aggregate patterns
- All data stays in the community's Supabase instance

## The Big Picture

This isn't just analytics. It's **proof that decentralised food networks work**.

When we can show that a small town's local food economy remained stable while grocery prices spiked 20% due to a shipping disruption — that's a story. That's data. That's what gets grants funded, what gets other towns interested, and what proves that the global supply chain's fragility isn't inevitable.

The town that can feed itself doesn't need to worry about what's happening in the Strait of Hormuz.

---

*Designed April 17, 2026. Powell River, BC.*
