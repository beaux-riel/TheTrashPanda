# Discovery & Map

## Purpose
The primary experience of The Trash Panda. Users open the app and immediately see what's available around them — on a map or in a feed. Discovery is designed to feel like walking through a farmers market: visual, spatial, and serendipitous.

## Requirements

### Requirement: Map view (primary)
The system SHALL display an interactive map as the default view, showing pins for all active listings within the user's visible area.

#### Scenario: First load — logged in user
- GIVEN a logged-in user opens The Trash Panda
- WHEN the map loads
- THEN it centres on the user's saved location
- AND active listing pins are displayed within the visible area
- AND pins are colour-coded by category

#### Scenario: First load — guest user
- GIVEN a guest user opens The Trash Panda for the first time
- WHEN the map loads
- THEN it centres on Powell River (default community)
- AND a gentle prompt asks "Want to see what's near you?" to request geolocation
- AND the map is fully functional even without location permission

#### Scenario: Location permission denied
- GIVEN a user denies browser geolocation
- WHEN they use the map
- THEN they can manually search for their area or drag the map
- AND a small banner says "Tap here to set your location for distance info"

### Requirement: Pin clustering
The system SHALL cluster pins at lower zoom levels to prevent visual clutter. Clusters SHALL show a count and break apart on zoom.

#### Scenario: Zoomed out view
- GIVEN there are 30 active listings in Powell River
- WHEN the user is zoomed out to see the whole town
- THEN listings are grouped into clusters showing count badges
- AND clusters use the dominant category colour

#### Scenario: Zooming into a cluster
- GIVEN a cluster shows "8 listings"
- WHEN the user zooms in or taps the cluster
- THEN individual pins are revealed
- AND a brief animation shows them spreading apart

### Requirement: Pin interaction
The system SHALL display a preview card when a user taps a listing pin on the map.

#### Scenario: Tap a pin
- GIVEN the user taps an egg listing pin
- WHEN the preview card appears
- THEN it shows: producer name, item title, quantity indicator, distance, thumbnail photo (if available)
- AND tapping the card opens the full listing detail

#### Scenario: Pin for listing with no photo
- GIVEN a listing has no photo
- WHEN its pin is tapped
- THEN the preview card shows a category-appropriate Bandit illustration instead

### Requirement: Category colour coding
The system SHALL assign distinct colours to each listing category for map pins and feed cards.

#### Scenario: Visual differentiation
- GIVEN multiple listing categories are visible on the map
- WHEN the user views the map
- THEN each category has a distinct pin colour/icon
- AND a legend/filter bar is accessible showing category colours

### Requirement: Feed view
The system SHALL provide a chronological feed view as an alternative to the map. The feed SHALL show listings as cards, newest first, with distance indicators.

#### Scenario: Switch to feed view
- GIVEN the user is on the map view
- WHEN they tap the "Feed" toggle
- THEN listings appear as vertical cards, newest first
- AND each card shows: title, producer, category badge, quantity, distance, time posted, thumbnail

#### Scenario: Empty feed
- GIVEN no listings exist in the user's area
- WHEN they view the feed
- THEN Bandit appears shrugging with empty paws
- AND the message reads "Nothing posted nearby yet. Either everyone's gardening or it's raining. (It's probably raining.)"
- AND a "Expand your range" button is offered

### Requirement: Search
The system SHALL allow users to search by product name, producer name, and category.

#### Scenario: Search for eggs
- GIVEN a consumer searches "eggs"
- WHEN results load
- THEN all active listings matching "eggs" are shown, sorted by distance
- AND the map view updates to show only matching pins
- AND the feed view filters to show only matching cards

#### Scenario: Search with no results
- GIVEN a consumer searches "goat cheese"
- WHEN no listings match
- THEN Bandit appears with a magnifying glass looking confused
- AND the message reads "Nobody's listed goat cheese yet. But someone might — we'll remember you searched for it."
- AND the search is logged as a demand signal (anonymized)

### Requirement: Filters
The system SHALL provide filters for: category, distance radius, availability (now vs upcoming), price type (free/paid/all).

#### Scenario: Filter by distance
- GIVEN a user sets the distance filter to 2km
- WHEN the filter is applied
- THEN only listings within 2km of their location are shown
- AND the map view draws a subtle radius circle
- AND the feed updates to show only matching listings

#### Scenario: Filter by "free only"
- GIVEN a user selects the "Free / Honour System" price filter
- WHEN the filter is applied
- THEN only listings with no price or marked as free are shown

### Requirement: Distance calculation
The system SHALL calculate and display approximate distance from the user to each listing. The system SHALL use "as the crow flies" distance with human-friendly labels.

#### Scenario: Distance display
- GIVEN a listing is 800m from the user
- WHEN it appears in the feed or preview card
- THEN it displays "800m away" (not "0.8km" or "0.497 miles")

#### Scenario: Distance without user location
- GIVEN the user has not shared their location
- WHEN listings are displayed
- THEN no distance is shown
- AND listings are sorted by recency instead of distance

### Requirement: Producer profile pages
The system SHALL provide a public profile page for each producer, accessible from map pins, feed cards, and direct links.

#### Scenario: View producer profile
- GIVEN a user taps a producer's name
- WHEN the profile page loads
- THEN it displays: name, bio, photo, location map, categories, active listings, operating schedule
- AND a "Follow" button is prominently displayed
- AND past listing history gives a sense of what they typically offer

### Requirement: Real-time updates
The system SHALL update the map and feed in real-time when new listings are posted, without requiring a page refresh.

#### Scenario: New listing appears
- GIVEN a user is viewing the map
- WHEN a producer posts a new listing within the visible area
- THEN a new pin appears on the map with a subtle animation
- AND a toast notification says "New listing nearby: [title]"
