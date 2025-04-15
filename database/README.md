# HarvestLink Database Schema

This directory contains the database schema for the HarvestLink application, including entity relationships, attributes, data types, and constraints.

## Files

- **schema.md**: Comprehensive documentation of the database schema with ER diagram and table definitions
- **schema.sql**: SQL script to create the complete database schema in PostgreSQL/Supabase
- **schema-viewer.html**: Interactive HTML viewer for the database schema diagram

## Viewing the Schema

### Option 1: View the Markdown Documentation

Open `schema.md` in a Markdown viewer or on GitHub to see the complete schema documentation.

### Option 2: Use the HTML Viewer

1. Open `schema-viewer.html` in a web browser
2. The interactive ER diagram will be rendered using Mermaid.js
3. Scroll down to see detailed table definitions

### Option 3: Run the Server

You can run a simple HTTP server to view the schema:

```bash
cd /workspace/HarvestLink
node server.js
```

Then open your browser to http://localhost:12000/database/schema-viewer.html

## Implementing the Schema

To implement this schema in your Supabase project:

1. Create a new Supabase project
2. Go to the SQL Editor in the Supabase dashboard
3. Copy the contents of `schema.sql`
4. Paste into the SQL Editor and run the script

## Schema Overview

The HarvestLink database schema includes the following main entities:

- **Users & Profiles**: Authentication and user information
- **Farms**: Producer profiles and farm details
- **Products & Categories**: Product listings with hierarchical categories
- **Inventory**: Product availability tracking
- **Orders & Order Items**: Order management
- **Pickup Locations**: Locations for order pickup
- **Reviews**: Customer feedback on farms
- **Messages**: Communication between users
- **Favorites**: User preferences for farms and products
- **Notifications**: System notifications for users

## Security

The schema includes comprehensive Row-Level Security (RLS) policies to ensure data protection:

- Users can only access their own data
- Producers can only manage their own farms and products
- Consumers can only view and manage their own orders
- Public data (farms, products) is accessible to all users

## Performance Optimization

The schema includes:

- Appropriate indexes for common query patterns
- Optimized data types for storage efficiency
- Triggers for maintaining data integrity
- Functions for common operations

## Schema Validation

The database schema has been validated against the following criteria:

- **Normalization**: Follows 1NF, 2NF, and 3NF principles
- **Relationship Integrity**: Proper foreign key constraints
- **Coverage of MVP Requirements**: All required entities and attributes
- **Performance Considerations**: Indexes and optimized data types
- **Security**: Row-level security policies for data protection