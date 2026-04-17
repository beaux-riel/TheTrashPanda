# The Trash Panda Database Schema Diagram

This diagram illustrates the database schema for the The Trash Panda application, showing tables, relationships, and key fields.

```mermaid
erDiagram
    PROFILES {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        string username UK
        string full_name
        string avatar_url
        string phone
        string email
        string user_type
        boolean is_verified
    }
    
    FARMS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        uuid owner_id FK
        string name
        string description
        string logo_url
        string banner_url
        string address
        string city
        string state
        string zip_code
        string country
        decimal latitude
        decimal longitude
        string website
        string phone
        string email
        boolean is_verified
        boolean is_active
        string[] growing_practices
        decimal average_rating
    }
    
    FARM_IMAGES {
        uuid id PK
        timestamp created_at
        uuid farm_id FK
        string image_url
        string caption
        boolean is_primary
    }
    
    PRODUCTS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        uuid farm_id FK
        string name
        string description
        string category
        string subcategory
        decimal price
        string unit
        integer quantity_available
        boolean is_organic
        boolean is_featured
        boolean is_active
        date harvest_date
        date available_until
    }
    
    PRODUCT_IMAGES {
        uuid id PK
        timestamp created_at
        uuid product_id FK
        string image_url
        boolean is_primary
    }
    
    PICKUP_LOCATIONS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        uuid farm_id FK
        string name
        string address
        string city
        string state
        string zip_code
        decimal latitude
        decimal longitude
        boolean is_active
        string[] available_days
        jsonb available_hours
    }
    
    ORDERS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        uuid consumer_id FK
        uuid farm_id FK
        string status
        decimal total_amount
        timestamp pickup_date
        uuid pickup_location_id FK
        string notes
    }
    
    ORDER_ITEMS {
        uuid id PK
        timestamp created_at
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal unit_price
        decimal total_price
    }
    
    REVIEWS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        uuid consumer_id FK
        uuid farm_id FK
        uuid order_id FK
        integer rating
        string comment
        boolean is_verified
    }
    
    MESSAGES {
        uuid id PK
        timestamp created_at
        uuid sender_id FK
        uuid recipient_id FK
        string content
        boolean is_read
        uuid related_order_id FK
        uuid related_product_id FK
    }
    
    FAVORITES {
        uuid id PK
        timestamp created_at
        uuid consumer_id FK
        uuid farm_id FK
    }
    
    PROFILES ||--o{ FARMS : "owns"
    PROFILES ||--o{ ORDERS : "places"
    PROFILES ||--o{ REVIEWS : "writes"
    PROFILES ||--o{ MESSAGES : "sends"
    PROFILES ||--o{ MESSAGES : "receives"
    PROFILES ||--o{ FAVORITES : "has"
    
    FARMS ||--o{ FARM_IMAGES : "has"
    FARMS ||--o{ PRODUCTS : "offers"
    FARMS ||--o{ PICKUP_LOCATIONS : "has"
    FARMS ||--o{ ORDERS : "receives"
    FARMS ||--o{ REVIEWS : "receives"
    FARMS ||--o{ FAVORITES : "is_favorited_by"
    
    PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
    PRODUCTS ||--o{ ORDER_ITEMS : "included_in"
    PRODUCTS ||--o{ MESSAGES : "referenced_in"
    
    PICKUP_LOCATIONS ||--o{ ORDERS : "used_for"
    
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ REVIEWS : "receives"
    ORDERS ||--o{ MESSAGES : "referenced_in"
```

## Database Schema Details

### Core Tables

#### PROFILES
- Extends Supabase auth.users
- Stores user profile information
- Differentiates between consumer and producer users

#### FARMS
- Represents farm listings
- Owned by producer users
- Contains location and contact information
- Tracks verification status and active state

#### PRODUCTS
- Represents items for sale
- Belongs to a specific farm
- Tracks inventory, pricing, and availability

#### ORDERS
- Represents purchases made by consumers
- Links to specific farm and consumer
- Tracks status, payment, and pickup details

### Supporting Tables

#### FARM_IMAGES / PRODUCT_IMAGES
- Store image references for farms and products
- Support multiple images per entity
- Track primary images for display

#### PICKUP_LOCATIONS
- Defines where consumers can collect orders
- Belongs to a specific farm
- Includes address and availability information

#### ORDER_ITEMS
- Junction table for orders and products
- Tracks quantity and pricing at time of purchase

#### REVIEWS
- Stores consumer feedback on farms
- Links to specific orders for verified reviews
- Used to calculate farm ratings

#### MESSAGES
- Enables direct communication between users
- Can reference specific orders or products
- Tracks read status

#### FAVORITES
- Tracks consumer preferences for farms
- Enables quick access to preferred producers

## Key Relationships

- A user (PROFILE) can be either a consumer or producer
- Producers own FARMS, which offer PRODUCTS
- Consumers place ORDERS for PRODUCTS from FARMS
- ORDERS are fulfilled at PICKUP_LOCATIONS
- Consumers can leave REVIEWS for FARMS based on ORDERS
- Users can exchange MESSAGES about ORDERS or PRODUCTS
- Consumers can mark FARMS as FAVORITES

## Security Considerations

- Row-Level Security (RLS) policies control access to each table
- Producers can only manage their own farms and products
- Consumers can only view their own orders and messages
- Public data (farm listings, products) is readable by all users
- Sensitive data is protected by appropriate policies