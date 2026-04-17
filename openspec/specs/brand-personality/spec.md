# Brand & Personality Layer

## Purpose
HarvestLink's brand is not a coat of paint — it's structural. Every screen, state, error, and transition has personality baked in. This spec defines the requirements for the brand layer that makes HarvestLink feel like it was built by your neighbours, not a startup.

Reference: BRAND.md for full voice, colour, typography, and illustration guidelines.

## Requirements

### Requirement: Bandit mascot integration
The system SHALL include Bandit the raccoon as a recurring character throughout the application. Bandit SHALL appear in loading states, empty states, error pages, onboarding, notifications, and seasonal transitions.

#### Scenario: Loading state
- GIVEN the app is loading content
- WHEN a loading indicator is displayed
- THEN Bandit is shown rummaging through a garden basket (animated)
- AND the animation is lightweight (CSS/SVG, not heavy video)

#### Scenario: Empty state — no listings
- GIVEN a feed or map area has no listings
- WHEN the empty state is displayed
- THEN Bandit appears shrugging with empty paws in front of an empty market stall
- AND contextual copy explains the situation with personality

#### Scenario: Error page (500)
- GIVEN a server error occurs
- WHEN the error page is displayed
- THEN Bandit is shown caught in the act — trash can tipped over, guilty face
- AND the message reads "Something went sideways. Bandit probably broke it. We're fixing it."
- AND a "Try again" button is available

#### Scenario: 404 page
- GIVEN a user navigates to a non-existent page
- WHEN the 404 page is displayed
- THEN Bandit is peering into an empty basket looking confused
- AND the message reads "Nothing here. Kind of like the produce aisle at Save-On after a ferry cancellation."
- AND navigation back to the map is prominent

### Requirement: Seasonal theming
The system SHALL adapt its visual identity based on the current season. Theming SHALL affect colour accents, illustrations, and Bandit's appearance.

#### Scenario: Summer theme (June–August)
- GIVEN the current date is in summer
- WHEN any page loads
- THEN colour accents shift to warm berry reds and golden yellows
- AND Bandit wears sunglasses
- AND seasonal illustration elements reflect summer (berries, sunshine, garden abundance)

#### Scenario: Winter theme (December–February)
- GIVEN the current date is in winter
- WHEN any page loads
- THEN colour accents shift to cool blues and warm indoor tones
- AND Bandit wears a tiny toque
- AND illustrations reflect preservation season (jars, root vegetables, cozy vibes)

#### Scenario: Season transition
- GIVEN the season changes (e.g., August 31 → September 1)
- WHEN a user opens the app after the transition
- THEN the theme reflects the new season
- AND Bandit may have a transitional appearance (e.g., raking leaves in early fall)

### Requirement: Illustrated characters
The system SHALL include illustrated characters throughout the app as section art and easter eggs. Characters include the "naked gardeners" — figures gardening in various states of undress, always obscured by strategically placed plants and garden elements.

#### Scenario: Section illustration
- GIVEN a user scrolls through the about page
- WHEN they reach different sections
- THEN illustrated characters appear as section art
- AND the characters are charming, never explicit — Austin Powers-level strategic obscuring
- AND each character represents a community archetype (the chicken lady, the sourdough evangelist, the zucchini overachiever)

#### Scenario: Easter egg discovery
- GIVEN a user explores the app thoroughly
- WHEN they encounter less-visited pages or specific interactions
- THEN hidden illustrations or Bandit variations are revealed
- AND discovering them feels rewarding and shareable

### Requirement: Copy voice
The system SHALL use a consistent brand voice across all user-facing text. The voice SHALL be warm, irreverent, local, and never corporate.

#### Scenario: Form labels
- GIVEN a producer is filling out a listing
- WHEN form fields are displayed
- THEN labels use the brand voice: "What've you got?" (not "Product Title"), "How much is left?" (not "Quantity"), "Where can people get it?" (not "Pickup Location")

#### Scenario: Success messages
- GIVEN a producer successfully posts a listing
- WHEN the success message appears
- THEN it reads something like "Posted! Your neighbours can see it now. 🦝" (not "Listing created successfully")

#### Scenario: Error messages
- GIVEN a form validation error occurs
- WHEN the error message appears
- THEN it's helpful and human: "Oops — need at least a title so people know what you've got" (not "Title field is required")

### Requirement: No stock photography
The system SHALL NOT use stock photography anywhere. All photos SHALL be real community photos or custom illustrations.

#### Scenario: Marketing pages
- GIVEN a user views the landing page or about page
- WHEN images are displayed
- THEN they are either custom illustrations or real photos from Powell River producers
- AND photo credits are displayed where applicable

### Requirement: Micro-interactions
The system SHALL include brand-consistent micro-interactions and animations that reinforce personality.

#### Scenario: Follow button animation
- GIVEN a user taps "Follow" on a producer
- WHEN the action completes
- THEN a micro-animation plays (Bandit peeking over the button, quick confetti, etc.)
- AND the animation is subtle and fast (under 500ms)

#### Scenario: Listing posted celebration
- GIVEN a producer posts their first listing
- WHEN the listing is published
- THEN a celebratory animation plays (Bandit doing a little dance)
- AND the celebration is proportional — bigger for first listing, subtle for subsequent

### Requirement: Powell River identity
The system SHALL incorporate Powell River landmarks and local references in illustrations and copy.

#### Scenario: Local references
- GIVEN illustrative elements are displayed
- WHEN they include background details
- THEN they reference recognizable local features: the ferry, Willingdon Beach, the old mill, Texada Island in the distance
- AND locals recognise and connect with these details

### Requirement: Accessible personality
The system SHALL ensure all personality elements are accessible. Illustrations SHALL have alt text. Animations SHALL respect prefers-reduced-motion. Copy voice SHALL not compromise clarity.

#### Scenario: Screen reader experience
- GIVEN a screen reader user navigates the app
- WHEN Bandit illustrations are encountered
- THEN descriptive alt text is provided: "Bandit the raccoon looking confused, peering into an empty basket"
- AND the personality translates through text, not just visuals

#### Scenario: Reduced motion preference
- GIVEN a user has prefers-reduced-motion enabled
- WHEN animations would normally play
- THEN static illustrations are shown instead
- AND no functionality or personality is lost
