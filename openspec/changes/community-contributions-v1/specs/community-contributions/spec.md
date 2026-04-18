# Community Contributions — Delta

## ADDED Requirements

### Requirement: Community-proposed producer profiles
The system SHALL allow any authenticated user to propose a new producer profile on behalf of someone in the community.

#### Scenario: Neighbour adds a producer
- GIVEN a logged-in user knows that Margaret on Maple Street sells eggs from her porch
- WHEN they tap "Add a neighbour" and fill in name, approximate location, categories, and a short description
- THEN a producer profile is created with status "community-maintained"
- AND the profile shows a badge: "Community-maintained · Know them? Help keep this updated"

### Requirement: Community-posted listings
The system SHALL allow any authenticated user to post a listing on behalf of a producer.

#### Scenario: Contributor posts a listing for a producer
- GIVEN a user just visited Margaret's porch and saw eggs are available
- WHEN they navigate to Margaret's profile and tap "Post what they've got"
- THEN a listing form appears with producer pre-selected
- AND the listing shows attribution: "Spotted by [contributor name]"

### Requirement: Contribution trust tiers
The system SHALL implement a tiered trust model that determines whether contributions require review or go live immediately.

#### Scenario: New contributor — edits queued
- GIVEN a user has fewer than 5 approved contributions and been active for fewer than 30 days
- WHEN they submit a new profile or listing
- THEN the contribution enters a "pending review" queue

#### Scenario: Trusted contributor — edits go live
- GIVEN a user has 5+ approved contributions and has been active for 30+ days
- WHEN they submit or edit a profile or listing
- THEN the change goes live immediately

#### Scenario: Verified producer — full control
- GIVEN a producer has claimed and verified their profile
- WHEN a community member edits their profile or posts a listing on their behalf
- THEN the producer receives a notification and can approve, reject, or modify

### Requirement: Revision history
The system SHALL maintain a complete, append-only revision history for all profiles and listings.

#### Scenario: View edit history
- GIVEN a producer profile has been edited 6 times by 3 different contributors
- WHEN any user taps "History" on the profile
- THEN a chronological list of all revisions is displayed

### Requirement: Profile claiming
The system SHALL allow producers to claim community-created profiles as their own.

#### Scenario: Producer discovers their profile
- GIVEN Margaret's neighbour created a profile for her eggs
- WHEN Margaret signs up and sees her profile
- THEN a prominent "This is me — claim this profile" button is displayed
- AND claiming requires a simple verification step

### Requirement: Freshness voting
The system SHALL allow any user to indicate whether a listing appears accurate.

#### Scenario: Flag as stale
- GIVEN a listing has been up for 10 days with no updates
- WHEN a user taps "Still accurate?" → "Not anymore"
- THEN the listing is flagged for review
- AND after 3 stale flags, the listing is auto-hidden

### Requirement: Abuse prevention
The system SHALL prevent spam, incorrect information, and privacy violations in community contributions.

#### Scenario: Rate limiting
- GIVEN a user submits 10 profiles in 5 minutes
- WHEN the rate limit is exceeded
- THEN further submissions are blocked for 1 hour

### Requirement: Contributor attribution
The system SHALL credit contributors for their contributions.

#### Scenario: Attribution on listing
- GIVEN a Trusted contributor posted a listing on behalf of a producer
- WHEN any user views the listing
- THEN small attribution text shows: "Spotted by [display name]"
