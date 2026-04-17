# Community Intelligence

## Purpose
The brain behind HarvestLink — and the foundation for Le-WM integration. Every listing, search, and interaction generates data that, when aggregated and anonymized, paints a picture of the community's food ecosystem. This is Phase 2 functionality, but the data collection begins from day one.

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

### Requirement: Le-WM integration readiness
The system SHALL store data in a format compatible with world model training. Event streams SHALL include temporal, spatial, and categorical dimensions.

#### Scenario: Data export for Le-WM
- GIVEN the Le-WM system needs training data
- WHEN a data export is requested
- THEN anonymized event streams are available in a structured format
- AND each event includes: timestamp, category, area hash, event type (listed/searched/gone), quantity signal
- AND the export covers configurable time ranges
