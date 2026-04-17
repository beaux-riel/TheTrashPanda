# Producer Dashboard

## Purpose
Where producers manage their presence on The Trash Panda. Designed for speed and simplicity — a hobby farmer checking their phone between feeding chickens should be able to post a listing in 30 seconds. No dashboards that require a business degree.

## Requirements

### Requirement: Quick post
The system SHALL provide a minimal-friction posting flow accessible from the producer dashboard. Posting a listing SHOULD take under 60 seconds.

#### Scenario: One-tap post from dashboard
- GIVEN a producer opens their dashboard
- WHEN they tap the prominent "Post what you've got" button
- THEN the listing creation form opens with smart defaults (their location, most-used category)
- AND recent listing templates are available for one-tap repost

#### Scenario: Post from anywhere in the app
- GIVEN a producer is browsing the map or feed
- WHEN they tap the floating "+" button
- THEN the listing creation form opens
- AND their producer context is automatically applied

### Requirement: Dashboard overview
The system SHALL display a dashboard showing: active listings count, total followers, recent views/engagement.

#### Scenario: Producer views dashboard
- GIVEN a producer with 3 active listings and 24 followers
- WHEN they open the dashboard
- THEN they see: "3 active listings", "24 followers", and recent activity summary
- AND active listings are displayed as manageable cards with quick actions

#### Scenario: New producer with no data
- GIVEN a producer just completed onboarding
- WHEN they view the dashboard for the first time
- THEN Bandit appears giving a thumbs up: "Looking good! Post your first listing and let your neighbours know what you've got."
- AND a prominent "Create your first listing" button is displayed

### Requirement: Listing management
The system SHALL allow producers to view, edit, expire, and repost all their listings from the dashboard.

#### Scenario: Edit an active listing
- GIVEN a producer has an active listing
- WHEN they tap "Edit" on the listing card
- THEN the listing form opens with all fields editable
- AND changes are reflected immediately on the map and feed

#### Scenario: View listing history
- GIVEN a producer wants to see past listings
- WHEN they tap "History" or scroll past active listings
- THEN expired and completed listings are displayed
- AND each has a "Repost" button for quick re-listing

### Requirement: Follower visibility
The system SHALL show producers a count of their followers. The system SHOULD show a list of follower names (display names only).

#### Scenario: View followers
- GIVEN a producer taps "24 followers"
- WHEN the follower list opens
- THEN display names of followers are listed
- AND no private information (email, location) is exposed

### Requirement: Simple analytics
The system SHALL provide basic analytics: listing views, most popular items, and peak engagement times.

#### Scenario: View listing performance
- GIVEN a producer has had listings active for 2 weeks
- WHEN they view the analytics section
- THEN they see which listings got the most views
- AND which times of day their listings get the most engagement
- AND Bandit provides commentary: "Your eggs are a hit — 47 views this week! 🥚"

#### Scenario: Analytics for producer with minimal data
- GIVEN a producer has only 2 listings with few views
- WHEN they view analytics
- THEN helpful suggestions are shown instead of empty charts: "Share your profile link to get more eyeballs. Here are some ideas..."

### Requirement: QR code generator
The system SHALL generate a unique QR code for each producer's profile. Producers SHOULD be able to print this for physical display.

#### Scenario: Generate QR code
- GIVEN a producer wants to promote their The Trash Panda presence
- WHEN they tap "Get your QR code"
- THEN a printable QR code is generated linking to their public profile
- AND it includes the The Trash Panda branding and Bandit
- AND options are provided: "Save image", "Print", "Share link"

#### Scenario: QR code at a farm gate
- GIVEN a producer prints their QR code and posts it at their driveway
- WHEN a passerby scans it
- THEN they land on the producer's public profile
- AND can browse listings, follow the producer, or get directions — all without an account

### Requirement: Operating schedule
The system SHALL allow producers to set an operating schedule (days/hours they're available).

#### Scenario: Set schedule
- GIVEN a producer sells eggs Tuesday and Saturday mornings
- WHEN they set their schedule to "Tue & Sat, 8am-12pm"
- THEN their profile shows availability hours
- AND listings posted outside these hours show "Available during seller's hours"

#### Scenario: Producer currently available
- GIVEN a producer's schedule says they're available now
- WHEN their listings appear on the map
- THEN a "Open now" badge appears on their pins and cards
