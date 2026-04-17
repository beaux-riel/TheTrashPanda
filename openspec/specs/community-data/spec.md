# Community Intelligence

## Purpose
The brain behind HarvestLink — and the foundation for Le-WM (LeCun World Model) integration. Every listing, search, follow, and interaction generates an event stream that, when aggregated, builds an internal model of how the community's food ecosystem actually works — predicting state changes before they happen. This is NOT Phase 2. The data collection and event architecture are DAY ONE infrastructure. The analytics dashboards come later, but the event pipeline ships with MVP.

## Requirements

### Requirement: Data collection from day one
The system SHALL collect anonymized, aggregated data from all listings and searches from the moment of launch. This data SHALL be stored in a format suitable for future analysis.

#### Scenario: Listing data captured
- GIVEN a producer posts a listing for blueberries in July
- WHEN the listing is created
- THEN the system records: category, date, season, area (anonymized), quantity level, time-to-gone (if marked sold)
- AND no personally identifiable data is included in the analytics store

#### Scenario: Search data captured
- GIVEN a consumer searches for "goat cheese" and finds no results
- WHEN the search completes
- THEN the system records: search term, category (if matched), area, date, result count (0)
- AND this contributes to demand signal analysis

### Requirement: Seasonal calendar
The system SHALL generate an auto-built seasonal calendar from historical listing data, showing what's typically available and when.

#### Scenario: View seasonal calendar
- GIVEN HarvestLink has 6 months of listing data
- WHEN a user views the community page
- THEN a visual calendar shows what's typically in season: "Blueberries: July–August", "Eggs: Year-round", "Squash: September–October"
- AND the calendar updates automatically as more data accumulates

#### Scenario: Seasonal predictions
- GIVEN it's late June and blueberry listings spiked in July last year
- WHEN a user follows "Produce" category
- THEN they receive a heads-up: "🦝 Blueberry season is coming! Based on last year, expect listings to pop up in the next 2 weeks."

### Requirement: Demand signals
The system SHALL track unmet demand — what people search for that nobody is listing.

#### Scenario: Demand gap identified
- GIVEN 15 users searched for "honey" in the past month
- WHEN only 1 honey listing existed
- THEN the community dashboard highlights: "Honey: High demand, low supply — 15 searches, 1 listing"
- AND this information is available on the public community page

#### Scenario: Demand signal notification to producers
- GIVEN a demand gap exists for "sourdough bread"
- WHEN a producer who lists baked goods views their dashboard
- THEN a suggestion appears: "People are searching for sourdough bread nearby. Got some?"

### Requirement: Supply coverage map
The system SHALL calculate and display what percentage of common food categories the community can supply locally.

#### Scenario: View coverage map
- GIVEN a community has active producers in eggs, produce, baked goods, and honey
- WHEN the community dashboard is viewed
- THEN a visual breakdown shows: "Powell River can locally source: Eggs ✅, Produce ✅, Baked Goods ✅, Dairy ❌, Meat ⚠️ (limited)"
- AND the coverage percentage is displayed: "Local food coverage: 45%"

### Requirement: Community resilience score
The system SHALL calculate a conceptual "resilience score" reflecting the community's food self-sufficiency.

#### Scenario: Resilience score display
- GIVEN sufficient data exists (6+ months)
- WHEN the community page is viewed
- THEN a resilience score is displayed: "Powell River Food Resilience: 42/100"
- AND a breakdown explains contributing factors: producer diversity, category coverage, seasonal consistency, active participation
- AND the score trends over time: "Up 8 points since last quarter"

### Requirement: Data anonymization
The system SHALL anonymize all community-level data. Individual producer or consumer behaviour SHALL NOT be identifiable from community analytics.

#### Scenario: Anonymization check
- GIVEN community data is displayed on the public dashboard
- WHEN any user views it
- THEN no individual producer names appear in aggregate stats
- AND location data is generalized to neighbourhood level, not exact addresses
- AND search terms are aggregated by category, not shown individually

### Requirement: Public community dashboard
The system SHALL provide a public community dashboard accessible without login, showing community food health at a glance.

#### Scenario: View community dashboard
- GIVEN a city councillor visits the HarvestLink community page
- WHEN the dashboard loads
- THEN they see: total active producers, total listings this month, category coverage, seasonal calendar, demand gaps, resilience trend
- AND the data tells a story: "Powell River has 34 active food producers serving 200+ regular users"
- AND Bandit provides seasonal commentary

### Requirement: Le-WM event pipeline (Day One)
The system SHALL emit structured events for every state change in the food network. Events SHALL be stored in an append-only event log from launch day. The event schema SHALL include temporal, spatial, categorical, and relational dimensions suitable for world model training.

#### Scenario: Listing lifecycle events
- GIVEN a producer creates, updates, marks gone, or lets a listing expire
- WHEN the state change occurs
- THEN an event is emitted: {type: 'listing.*', timestamp, category, area_hash, quantity_before, quantity_after, time_to_gone_ms, producer_hash, season}
- AND the event is written to the events table in real-time
- AND no personally identifiable information is included

#### Scenario: Demand signal events
- GIVEN a consumer searches, filters, views a listing, or follows a category
- WHEN the interaction occurs
- THEN an event is emitted: {type: 'demand.*', timestamp, query/category, area_hash, result_count, session_hash}
- AND zero-result searches are flagged as unmet demand signals

#### Scenario: Temporal pattern extraction
- GIVEN 30+ days of event data exist
- WHEN the Le-WM pipeline processes the event log
- THEN it can extract: weekly posting rhythms, seasonal availability curves, demand/supply correlation, producer reliability patterns
- AND the data is queryable by time range, category, and area

#### Scenario: Event log export
- GIVEN an external system or analysis tool needs the event data
- WHEN an export is requested via API
- THEN anonymized event streams are available in JSONL format
- AND each event includes all dimensions needed for world model training
- AND the export supports configurable time ranges and filters
