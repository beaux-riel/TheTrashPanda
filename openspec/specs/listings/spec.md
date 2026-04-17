# Availability Listings

## Purpose
The core unit of HarvestLink. A listing is not a product page — it's a signal: "I have this thing, right now (or soon), come get it." Listings are intentionally ephemeral. They reflect the real-time state of what's available in the community.

## Requirements

### Requirement: Create a listing
The system SHALL allow producers to create availability listings with: title, description (optional), category, quantity indicator, price (optional), photos (optional), and available-until date.

#### Scenario: Producer posts availability
- GIVEN a producer is logged in
- WHEN they tap "Post what you've got"
- THEN a listing form is displayed with fields for title, category, quantity, and available-until
- AND optional fields for description, price, and photos are available but not required
- AND the form is completable in under 60 seconds

#### Scenario: Listing with no price
- GIVEN a producer is creating a listing
- WHEN they leave the price field empty
- THEN the listing displays "Ask" or "Free / Honour System" depending on their selection
- AND the listing is still fully visible in the feed and map

#### Scenario: Listing with photos
- GIVEN a producer is creating a listing
- WHEN they add photos
- THEN up to 4 photos can be uploaded
- AND photos are resized/compressed client-side before upload
- AND the first photo is used as the listing thumbnail

### Requirement: Categories
The system SHALL provide predefined categories: Eggs, Produce, Baked Goods, Preserved & Pickled, Dairy, Meat & Fish, Honey, Plants & Seeds, Prepared Food, Beverages, Other. A listing SHALL belong to at least one category.

#### Scenario: Producer selects category
- GIVEN a producer is creating a listing
- WHEN they reach the category field
- THEN they can select one or more categories from the predefined list
- AND an "Other" option with free text is available

### Requirement: Quantity indicators
The system SHALL use human-readable quantity indicators instead of exact counts: "Plenty", "Some left", "Last few". The system SHALL NOT require exact inventory counts.

#### Scenario: Quantity display
- GIVEN a listing has quantity set to "Last few"
- WHEN a consumer views the listing
- THEN a visual indicator (colour/icon) emphasises urgency
- AND Bandit appears looking nervous ("Better hurry!")

### Requirement: Auto-expiry
The system SHALL automatically expire listings after their available-until date. Default expiry SHALL be 7 days from posting. Producers MAY set custom expiry dates.

#### Scenario: Listing expires
- GIVEN a listing's available-until date has passed
- WHEN the expiry check runs
- THEN the listing is removed from the map and feed
- AND the producer is notified: "Your [item] listing expired. Got more? Repost it!"

#### Scenario: Producer sets custom expiry
- GIVEN a producer is creating a listing for Saturday market only
- WHEN they set available-until to Saturday 2pm
- THEN the listing auto-expires at that time
- AND shows "Available until Sat 2pm" on the listing card

### Requirement: Quick repost
The system SHALL allow producers to repost previous listings with one tap. The system SHOULD pre-fill all fields from the previous listing.

#### Scenario: Producer reposts eggs
- GIVEN a producer previously listed "Farm Fresh Eggs - $5/dozen"
- WHEN they tap "Post again" from their listing history
- THEN a new listing is created with all previous fields pre-filled
- AND the producer can modify any field before posting
- AND the available-until date resets to default (7 days)

### Requirement: Mark as gone
The system SHALL allow producers to instantly mark a listing as "Gone" (sold out). This SHALL immediately remove it from active listings.

#### Scenario: Producer sells out
- GIVEN a producer has an active listing for blueberries
- WHEN they tap the "Gone!" button
- THEN the listing is immediately removed from the map and feed
- AND followers who viewed it see "This one's gone — follow [producer] to catch the next batch"

### Requirement: Seasonal suggestions
The system SHALL suggest seasonal tags based on the current time of year.

#### Scenario: Summer posting
- GIVEN a producer is creating a listing in July
- WHEN they start typing the title
- THEN seasonal suggestions appear: "Berry season?", "Summer harvest", "Garden surplus"
- AND popular categories for the season are highlighted

### Requirement: Edit and delete
The system SHALL allow producers to edit active listings. The system SHALL allow producers to delete their own listings at any time.

#### Scenario: Producer updates quantity
- GIVEN a producer has a listing showing "Plenty"
- WHEN they update quantity to "Last few"
- THEN the listing updates in real-time for all viewers
- AND followers receive a notification: "[Producer]'s [item] — last few remaining!"

### Requirement: Listing location
Each listing SHALL inherit the producer's profile location by default. Producers MAY override the location for individual listings (e.g., selling at a different market stall).

#### Scenario: Producer at Saturday market
- GIVEN a producer normally sells from home
- WHEN they're at the Saturday farmers market
- THEN they can set a temporary location for that listing
- AND the listing pin appears at the market, not their home
