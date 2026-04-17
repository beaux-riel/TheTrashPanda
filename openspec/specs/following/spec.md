# Following & Notifications

## Purpose
The glue that turns casual browsers into regulars. Following lets consumers build their own personal food network — the producers, products, and areas they care about. Notifications are the nudge that brings people back.

## Requirements

### Requirement: Follow producers
The system SHALL allow authenticated users to follow producers. Following SHALL trigger notifications when that producer posts a new listing.

#### Scenario: Follow a producer
- GIVEN a consumer is viewing a producer's profile
- WHEN they tap "Follow"
- THEN the producer is added to their following list
- AND they receive notifications for that producer's new listings
- AND the button changes to "Following ✓"

#### Scenario: Unfollow a producer
- GIVEN a consumer follows a producer
- WHEN they tap "Following ✓"
- THEN a confirmation asks "Stop following [name]? You won't get notified about their posts."
- AND upon confirmation, notifications stop

### Requirement: Follow categories
The system SHALL allow users to follow product categories. Following a category SHALL trigger notifications when anyone posts a listing in that category within the user's configured radius.

#### Scenario: Follow "Eggs" category
- GIVEN a consumer frequently searches for eggs
- WHEN they tap "Follow this category" on the Eggs filter
- THEN they receive notifications when any producer lists eggs within their radius
- AND the notification reads: "[Producer] just posted eggs — [distance] away"

### Requirement: Follow areas
The system SHOULD allow users to follow geographic areas. Following an area SHALL trigger notifications for any new listing within that area.

#### Scenario: Follow neighbourhood
- GIVEN a consumer wants to know about anything near Willingdon Beach
- WHEN they draw or select a radius on the map and tap "Watch this area"
- THEN they receive notifications for all new listings within that area
- AND the watched area appears as a subtle highlight on their map

### Requirement: Web push notifications
The system SHALL support web push notifications (PWA). The system SHALL request notification permission at an appropriate moment, not on first visit.

#### Scenario: Notification permission request
- GIVEN a user has just followed their first producer
- WHEN the follow action completes
- THEN the app asks "Want to know when [producer] posts? Enable notifications?"
- AND the browser notification permission dialog appears
- AND if denied, the app gracefully falls back to in-app notifications only

#### Scenario: Push notification received
- GIVEN a user follows a producer who just posted eggs
- WHEN the push notification arrives
- THEN it reads: "🦝 [Producer] just listed Farm Fresh Eggs — 400m from you"
- AND tapping the notification opens the listing directly

### Requirement: Notification preferences
The system SHALL allow users to configure notification frequency: immediate, daily digest, or off. This SHALL be configurable per follow (producer, category, or area).

#### Scenario: Daily digest preference
- GIVEN a user prefers daily digests
- WHEN they set notification frequency to "Daily digest"
- THEN they receive one notification per day summarizing new listings from their follows
- AND the digest arrives at their preferred time (default: 8am local)

#### Scenario: Mute specific producer temporarily
- GIVEN a user follows 10 producers but one posts very frequently
- WHEN they mute that producer's notifications
- THEN they stop receiving push notifications from that producer
- AND the follow remains active (they still see listings in their feed)
- AND a "Muted" badge appears on that follow

### Requirement: In-app notification centre
The system SHALL provide an in-app notification centre showing all recent activity from followed producers, categories, and areas.

#### Scenario: View notification centre
- GIVEN a user taps the notification bell icon
- WHEN the notification centre opens
- THEN recent notifications are listed chronologically
- AND unread notifications are visually distinct
- AND each notification links to the relevant listing or producer

#### Scenario: Empty notification centre
- GIVEN a new user has no follows yet
- WHEN they open the notification centre
- THEN Bandit appears holding a megaphone
- AND the message reads "Nothing here yet. Follow some producers and we'll keep you in the loop."

### Requirement: Email notifications (optional)
The system MAY provide email notification digests. Email notifications SHALL be off by default and opt-in only.

#### Scenario: Enable email digest
- GIVEN a user wants email notifications
- WHEN they enable email digest in settings
- THEN they receive a weekly email summarizing activity from their follows
- AND the email has the HarvestLink brand personality (Bandit illustrations, warm copy)
- AND every email has a one-click unsubscribe
