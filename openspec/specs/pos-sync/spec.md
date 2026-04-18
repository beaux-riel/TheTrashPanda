# POS Integration Sync

## Purpose
For the subset of producers who already maintain a product catalog in a point-of-sale system (Square, Stripe, Shopify), The Trash Panda can auto-sync their listings. This eliminates double-entry — when they update a product in Square, the listing updates here. This is a Phase 2 feature targeting semi-commercial producers (bakeries, farm stands, market vendors) who already have digital infrastructure.

## Requirements

### Requirement: Square catalog sync
The system SHALL allow producers to connect their Square account and automatically sync catalog items as listings.

#### Scenario: Producer connects Square
- GIVEN a Verified producer has a Square account with catalog items
- WHEN they tap "Connect Square" in their dashboard settings
- THEN an OAuth flow redirects them to Square to authorize read access
- AND upon successful auth, the system pulls their catalog items
- AND the producer selects which items/categories to sync to The Trash Panda

#### Scenario: Catalog item becomes listing
- GIVEN a producer has synced their Square account with 8 catalog items
- WHEN the initial sync completes
- THEN each selected catalog item creates a listing with: title from item name, price from item price, category auto-mapped from Square category
- AND the listing shows a badge: "Synced from Square"
- AND the producer can edit the listing title, description, and category mapping

#### Scenario: Price update syncs
- GIVEN a synced listing exists for "Sourdough Loaf - $8"
- WHEN the producer updates the price to $9 in Square
- THEN the Square webhook triggers an update
- AND the listing price updates to $9 within 5 minutes
- AND the revision history records: "Price updated via Square sync"

#### Scenario: Inventory drives availability
- GIVEN Square tracks inventory for a synced item
- WHEN inventory drops to 0 in Square
- THEN the listing is automatically marked as "Gone"
- AND when inventory is restocked, the listing reactivates with "Plenty"

### Requirement: Stripe product sync
The system SHALL allow producers to connect their Stripe account and sync products as listings.

#### Scenario: Producer connects Stripe
- GIVEN a Verified producer sells online via Stripe
- WHEN they tap "Connect Stripe" in their dashboard settings
- THEN a Stripe Connect OAuth flow authorizes read access to products and prices
- AND the system pulls their active products
- AND the producer selects which products to sync

#### Scenario: Product and price sync
- GIVEN a producer has synced 5 Stripe products
- WHEN a product name or price is updated in Stripe
- THEN the `product.updated` or `price.updated` webhook fires
- AND the corresponding listing updates within 5 minutes
- AND revision history records the source of the change

### Requirement: Sync configuration
The system SHALL allow producers to configure how synced items map to Trash Panda listings.

#### Scenario: Category mapping
- GIVEN a producer's Square catalog has items in "Bread" and "Pastries"
- WHEN they configure sync settings
- THEN they can map Square categories to Trash Panda categories: "Bread" → "Baked Goods", "Pastries" → "Baked Goods"
- AND new items in those Square categories auto-create listings with the mapped category

#### Scenario: Selective sync
- GIVEN a producer has 30 items in Square but only sells 10 locally
- WHEN they configure sync settings
- THEN they can select specific items or categories to sync
- AND unselected items are ignored
- AND they can add/remove items from sync at any time

#### Scenario: Sync pause
- GIVEN a producer is going on vacation
- WHEN they toggle "Pause sync" in their dashboard
- THEN all synced listings are temporarily hidden
- AND no new webhook updates create or modify listings
- AND resuming sync restores all previously active listings

### Requirement: Conflict resolution
The system SHALL handle conflicts between community-contributed edits and POS sync updates.

#### Scenario: Community edit vs. sync update
- GIVEN a synced listing has been edited by a community contributor (e.g., added a description)
- WHEN a POS sync update arrives for the same listing
- THEN POS-sourced fields (price, name, availability) are updated from the sync
- AND community-contributed fields (description, photos) are preserved
- AND the revision history shows both sources

#### Scenario: Producer override
- GIVEN a producer manually edits a synced listing in The Trash Panda
- WHEN the next POS sync arrives
- THEN manually-edited fields are NOT overwritten by the sync
- AND a notification asks: "Your Square price changed to $9 but you set $8 here. Which do you want?"

### Requirement: Disconnect and data retention
The system SHALL allow producers to disconnect their POS integration at any time.

#### Scenario: Producer disconnects Square
- GIVEN a producer has 8 synced listings from Square
- WHEN they tap "Disconnect Square"
- THEN the OAuth token is revoked and deleted
- AND existing listings remain but lose the "Synced from Square" badge
- AND listings become community-maintainable like any other listing
- AND no further sync updates occur
