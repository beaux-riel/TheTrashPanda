# Community Contributions

## Purpose
The Trash Panda uses a Wikipedia-style contribution model where anyone in the community can propose and maintain producer profiles and listings. Most local food producers — retirees with fruit trees, families with garden surplus, hobby bakers — will never sign up for an app. Their neighbours already know what they have. This spec enables the community to collectively maintain the food network, lowering the barrier from "producer must self-serve" to "anyone who knows about it can share it."

## Requirements

### Requirement: Community-proposed producer profiles
The system SHALL allow any authenticated user to propose a new producer profile on behalf of someone in the community.

#### Scenario: Neighbour adds a producer
- GIVEN a logged-in user knows that Margaret on Maple Street sells eggs from her porch
- WHEN they tap "Add a neighbour" and fill in name, approximate location, categories, and a short description
- THEN a producer profile is created with status "community-maintained"
- AND the profile shows a badge: "Community-maintained · Know them? Help keep this updated"
- AND the contribution is recorded with the contributor's ID and timestamp

#### Scenario: Minimal information accepted
- GIVEN a contributor doesn't know all details about a producer
- WHEN they submit a profile with only a name, one category, and approximate area
- THEN the profile is created successfully with partial information
- AND missing fields show "Help fill this in" prompts for other community members

### Requirement: Community-posted listings
The system SHALL allow any authenticated user to post a listing on behalf of a producer.

#### Scenario: Contributor posts a listing for a producer
- GIVEN a user just visited Margaret's porch and saw eggs are available
- WHEN they navigate to Margaret's profile and tap "Post what they've got"
- THEN a listing form appears with producer pre-selected
- AND required fields are: title, category, quantity indicator
- AND optional fields are: price, description, available-until
- AND the listing shows attribution: "Spotted by [contributor name]"

#### Scenario: Contributor updates availability
- GIVEN a listing for Margaret's eggs shows "Plenty"
- WHEN a community member who just bought the last carton taps "Update availability"
- THEN they can mark it as "Last few" or "Gone"
- AND the update is applied based on the contributor's trust tier

### Requirement: Contribution trust tiers
The system SHALL implement a tiered trust model that determines whether contributions require review or go live immediately.

#### Scenario: New contributor — edits queued
- GIVEN a user has made fewer than 5 approved contributions and been active for fewer than 30 days
- WHEN they submit a new profile or listing
- THEN the contribution enters a "pending review" queue
- AND the contributor sees: "Thanks! A community member will review this shortly."
- AND existing Trusted or Verified users are notified of pending reviews

#### Scenario: Trusted contributor — edits go live
- GIVEN a user has 5+ approved contributions and has been active for 30+ days
- WHEN they submit or edit a profile or listing
- THEN the change goes live immediately
- AND a revision record is created for audit trail
- AND the contributor can also review and approve pending contributions from New tier users

#### Scenario: Verified producer — full control
- GIVEN a producer has claimed and verified their profile
- WHEN a community member edits their profile or posts a listing on their behalf
- THEN the producer receives a notification: "[Contributor] updated your profile / added a listing"
- AND the producer can approve, reject, or modify the contribution
- AND the producer can override any community-contributed content on their profile

#### Scenario: Trust tier promotion
- GIVEN a New tier contributor reaches 5 approved contributions and 30 days of activity
- WHEN the system evaluates their trust status
- THEN they are automatically promoted to Trusted tier
- AND they receive a notification: "You're now a trusted contributor! Your edits go live immediately."

### Requirement: Revision history
The system SHALL maintain a complete, append-only revision history for all profiles and listings. Every change — whether by the producer, a contributor, or the system — SHALL be recorded as a revision.

#### Scenario: View edit history
- GIVEN a producer profile has been edited 6 times by 3 different contributors
- WHEN any user taps "History" on the profile
- THEN a chronological list of all revisions is displayed
- AND each revision shows: who made it, when, what changed, and current status (approved/rejected/pending)

#### Scenario: Rollback a change
- GIVEN a Verified producer or admin sees an incorrect edit
- WHEN they tap "Revert" on a specific revision
- THEN the profile/listing returns to the previous approved state
- AND the reverted change is marked as "reverted" in the history
- AND the contributor is NOT penalized for a single reverted edit

### Requirement: Profile claiming
The system SHALL allow producers to claim community-created profiles as their own, granting them Verified status and full control.

#### Scenario: Producer discovers their profile
- GIVEN Margaret's neighbour created a profile for her eggs
- WHEN Margaret signs up and sees her profile
- THEN a prominent "This is me — claim this profile" button is displayed
- AND claiming requires a simple verification step (text/email to a provided contact, or admin approval)

#### Scenario: Claim verification
- GIVEN Margaret taps "Claim this profile"
- WHEN she provides her phone number or email
- THEN a verification code is sent
- AND upon entering the correct code, she becomes the Verified owner
- AND she retains all community-contributed content but can now edit everything directly
- AND future community edits to her profile require her approval

### Requirement: Freshness voting
The system SHALL allow any user to indicate whether a listing appears accurate, providing lightweight crowdsourced freshness signals.

#### Scenario: Confirm accuracy
- GIVEN a user visits Margaret's eggs listing
- WHEN they tap "Still accurate?" → "Yes"
- THEN the listing's freshness score increases
- AND a subtle indicator shows: "Confirmed 2 hours ago"

#### Scenario: Flag as stale
- GIVEN a listing has been up for 10 days with no updates
- WHEN a user taps "Still accurate?" → "Not anymore"
- THEN the listing is flagged for review
- AND after 3 "not accurate" flags, the listing is auto-hidden with notice: "This listing may be outdated"
- AND the producer (if verified) or original contributor is notified

### Requirement: Abuse prevention
The system SHALL prevent spam, incorrect information, and privacy violations in community contributions.

#### Scenario: Spam detection
- GIVEN a user submits 10 profiles in 5 minutes
- WHEN the rate limit is exceeded
- THEN further submissions are blocked for 1 hour
- AND existing submissions are queued for manual review regardless of trust tier

#### Scenario: Privacy flag
- GIVEN a contributor includes a specific street address in a producer profile
- WHEN the profile is submitted
- THEN the system warns: "Exact addresses aren't shown publicly — we'll use the approximate area instead"
- AND the address is stored but only the neighbourhood-level location is displayed

#### Scenario: Report inappropriate content
- GIVEN any user sees incorrect or inappropriate content on a profile or listing
- WHEN they tap "Report"
- THEN they can select a reason: inaccurate, spam, privacy concern, inappropriate
- AND the content is flagged for review
- AND 3+ reports auto-hide the content pending review

### Requirement: Contributor attribution
The system SHALL credit contributors for their contributions while maintaining appropriate privacy.

#### Scenario: Attribution on listing
- GIVEN a Trusted contributor posted a listing on behalf of a producer
- WHEN any user views the listing
- THEN small attribution text shows: "Spotted by [display name]"
- AND tapping the name shows the contributor's profile with their contribution count

#### Scenario: Contributor profile
- GIVEN a user has made 15 approved contributions
- WHEN their profile is viewed
- THEN it shows: contribution count, trust tier, date joined, categories they frequently contribute to
- AND a list of their recent contributions (profiles added, listings posted)
