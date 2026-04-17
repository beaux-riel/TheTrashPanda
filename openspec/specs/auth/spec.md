# Authentication & Profiles

## Purpose
The Trash Panda uses passwordless authentication to minimize friction. Users can browse freely without an account, and sign up when they want to follow producers or post listings. Profiles support dual roles — the same person can be both a consumer and a producer.

## Requirements

### Requirement: Guest browsing
The system SHALL allow unauthenticated users to browse the map, feed, and producer profiles without creating an account.

#### Scenario: First-time visitor views map
- GIVEN a user visits The Trash Panda for the first time
- WHEN the app loads
- THEN the map view is displayed with all active listings visible
- AND no login prompt is shown

#### Scenario: Guest attempts to follow a producer
- GIVEN a guest user is viewing a producer profile
- WHEN they tap "Follow"
- THEN a signup prompt is displayed with the message "Tell us who you are so we can let you know when they post"
- AND after signup the follow action completes automatically

### Requirement: Passwordless authentication
The system SHALL authenticate users via email magic link. The system SHALL NOT use password-based authentication.

#### Scenario: New user signs up
- GIVEN a guest user taps "Sign up"
- WHEN they enter their email address
- THEN a magic link is sent to their email
- AND the app displays "Check your email — we sent you a link"

#### Scenario: Magic link login
- GIVEN a user has received a magic link email
- WHEN they click the link
- THEN they are authenticated and redirected to the app
- AND a session is created that persists for 30 days

#### Scenario: Returning user
- GIVEN a user has an active session
- WHEN they open the app
- THEN they are automatically logged in without re-authentication

### Requirement: Dual-role profiles
The system SHALL support users having both consumer and producer roles simultaneously. A user MAY activate producer capabilities at any time.

#### Scenario: Consumer becomes a producer
- GIVEN a user signed up as a consumer
- WHEN they tap "Start selling" or "I have something to share"
- THEN the producer onboarding flow begins
- AND their existing consumer profile is preserved

#### Scenario: User with both roles
- GIVEN a user is both a consumer and producer
- WHEN they use the app
- THEN they can switch between browsing (consumer) and managing listings (producer) seamlessly
- AND both capabilities are accessible from the main navigation

### Requirement: Producer profiles
The system SHALL collect the following for producer profiles: display name, bio (optional), location (map pin), product categories, photo (optional), operating schedule (optional), pickup details (optional). Producer profiles SHALL be publicly visible.

#### Scenario: Producer sets up profile
- GIVEN a user is completing producer onboarding
- WHEN they reach the profile setup step
- THEN they can set a map pin by tapping their location on a map
- AND select categories from a predefined list (eggs, produce, baked goods, preserved, dairy, meat, honey, plants, prepared food, other)
- AND add a free-text bio describing what they do

#### Scenario: Producer without a photo
- GIVEN a producer has not uploaded a profile photo
- WHEN their profile is displayed
- THEN a Bandit illustration placeholder is shown (trash panda holding a "photo coming soon" sign)

### Requirement: Consumer profiles
The system SHALL collect the following for consumer profiles: display name, location (for distance calculations), notification preferences. Consumer profiles SHALL be private by default.

#### Scenario: Consumer sets location
- GIVEN a consumer is setting up their profile
- WHEN they are asked for location
- THEN they can use browser geolocation OR manually search/pin their area
- AND the location is used for distance calculations only, never displayed publicly

### Requirement: Session management
The system SHALL maintain sessions for 30 days. The system SHALL support sign-out from all devices.

#### Scenario: Session expiry
- GIVEN a user's session is 30 days old
- WHEN they next open the app
- THEN they are prompted to re-authenticate via magic link
