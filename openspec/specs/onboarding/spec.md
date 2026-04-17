# Onboarding & First Experience

## Purpose
The first 30 seconds decide if someone stays or leaves. The Trash Panda's onboarding is designed around one principle: show value before asking for anything. The map works without signup. Signup is a natural step when you want to do more, not a gate.

## Requirements

### Requirement: Value before signup
The system SHALL show the full map and feed to unauthenticated users. The system SHALL NOT gate core discovery behind authentication.

#### Scenario: First visit experience
- GIVEN a person clicks a link to The Trash Panda
- WHEN the app loads
- THEN they immediately see the map with active listings
- AND they can browse, search, filter, and view producer profiles
- AND no signup wall, modal, or banner blocks the experience

#### Scenario: Signup triggers
- GIVEN a guest user is browsing
- WHEN they attempt to follow a producer, post a listing, or access notifications
- THEN a friendly signup prompt appears
- AND the prompt explains WHY signup helps: "Follow [name] to get notified when they post"
- AND after signup the original action completes seamlessly

### Requirement: Producer onboarding
The system SHALL guide new producers through a 3-step onboarding wizard: identity, offerings, and location. The wizard SHALL be completable in under 3 minutes.

#### Scenario: Step 1 — Who are you?
- GIVEN a user has tapped "Start selling"
- WHEN onboarding step 1 loads
- THEN they enter: display name, optional bio, optional photo
- AND Bandit appears: "Nice to meet you! Tell people a bit about yourself."
- AND they can skip bio and photo (add later)

#### Scenario: Step 2 — What do you sell?
- GIVEN the user completed step 1
- WHEN step 2 loads
- THEN they select categories that describe what they offer
- AND suggested categories based on season are highlighted
- AND Bandit: "Eggs? Bread? Questionable zucchinis? Whatever it is, we're into it."

#### Scenario: Step 3 — Where are you?
- GIVEN the user completed step 2
- WHEN step 3 loads
- THEN a map is displayed for them to pin their location
- AND browser geolocation pre-fills if available
- AND they can drag the pin to the exact spot
- AND Bandit: "Drop your pin. Don't worry — people will see the neighbourhood, not your exact address."

#### Scenario: Completed onboarding
- GIVEN the user finishes all 3 steps
- WHEN onboarding completes
- THEN they land on their producer dashboard
- AND a prompt encourages first listing: "You're in! Post your first listing and let your neighbours know."
- AND their profile is immediately live and visible

### Requirement: Consumer onboarding
The system SHALL provide lightweight consumer onboarding: location and optional notification preferences. Consumer onboarding SHOULD take under 30 seconds.

#### Scenario: Consumer signs up to follow someone
- GIVEN a guest tapped "Follow" on a producer
- WHEN they complete email magic link signup
- THEN they're asked for a display name and location (optional)
- AND notification preferences default to "immediate" for followed producers
- AND they're returned to the producer they wanted to follow, with the follow already active

### Requirement: Bandit guides onboarding
The system SHALL include Bandit the trash panda throughout onboarding as a guide character, providing personality and reducing the feeling of filling out forms.

#### Scenario: Bandit encouragement
- GIVEN a user is midway through producer onboarding
- WHEN they pause on any step
- THEN Bandit provides a contextual nudge (not a nagging popup — subtle, in-page)
- AND the tone is warm and funny, never corporate

### Requirement: Invite a neighbour
The system SHALL provide a shareable link that producers and consumers can send to others.

#### Scenario: Share invite link
- GIVEN a user wants to invite a neighbour
- WHEN they tap "Invite a neighbour" from settings or profile
- THEN a shareable link is generated with an optional personal message
- AND the link opens The Trash Panda centred on the inviter's area
- AND Bandit: "Spread the word. The more neighbours, the better the map."

### Requirement: Default community
The system SHALL default to Powell River as the initial community. The system SHOULD support expanding to additional communities in the future.

#### Scenario: First launch defaults
- GIVEN a user with no location data opens The Trash Panda
- WHEN the map loads
- THEN it centres on Powell River, BC
- AND the community name "Powell River" appears in the header
- AND future expansion points exist for adding new communities

#### Scenario: User outside Powell River
- GIVEN a user in Sechelt visits The Trash Panda
- WHEN they allow geolocation
- THEN the map centres on their location
- AND if no listings exist nearby, a message reads: "Nothing here yet — but you could be the first. The Trash Panda is growing, one town at a time."
- AND a "Bring The Trash Panda to your town" call-to-action is shown
