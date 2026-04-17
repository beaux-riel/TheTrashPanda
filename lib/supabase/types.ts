// Database types for HarvestLink v2 — mirrors supabase/migrations/001_initial_schema.sql.
// Hand-written to stay in sync with the schema; regenerate with
// `supabase gen types typescript` once the project is linked.

export type Quantity = "plenty" | "some" | "last_few";
export type ListingStatus = "active" | "gone" | "expired";
export type FollowType = "producer" | "category" | "area";
export type NotificationFrequency = "immediate" | "daily" | "off";
export type NotificationKind = "producer" | "category" | "area" | "system";

export type EventType =
  | "listing.created"
  | "listing.updated"
  | "listing.gone"
  | "listing.expired"
  | "demand.search"
  | "demand.filter"
  | "demand.view"
  | "demand.follow"
  | "follow.created"
  | "follow.removed";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// PostGIS geography(Point, 4326) is returned as GeoJSON when selected through
// an ST_AsGeoJSON view or converted client-side. Writes go in as WKT strings.
export type GeoPoint = {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

export type Database = {
  // Tells postgrest-js which feature flags to enable.
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          location: GeoPoint | null;
          location_label: string | null;
          is_producer: boolean;
          categories: string[];
          pickup_details: string | null;
          schedule_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          location?: GeoPoint | string | null;
          location_label?: string | null;
          is_producer?: boolean;
          categories?: string[];
          pickup_details?: string | null;
          schedule_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };

      listings: {
        Row: {
          id: string;
          producer_id: string;
          title: string;
          description: string | null;
          category: string;
          quantity: Quantity;
          price_label: string | null;
          location: GeoPoint | null;
          location_label: string | null;
          photos: string[];
          status: ListingStatus;
          available_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          producer_id: string;
          title: string;
          description?: string | null;
          category: string;
          quantity: Quantity;
          price_label?: string | null;
          location?: GeoPoint | string | null;
          location_label?: string | null;
          photos?: string[];
          status?: ListingStatus;
          available_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "listings_producer_id_fkey";
            columns: ["producer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      follows: {
        Row: {
          id: string;
          follower_id: string;
          follow_type: FollowType;
          producer_id: string | null;
          category: string | null;
          area_center: GeoPoint | null;
          area_radius_km: number | null;
          frequency: NotificationFrequency;
          muted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          follow_type: FollowType;
          producer_id?: string | null;
          category?: string | null;
          area_center?: GeoPoint | string | null;
          area_radius_km?: number | null;
          frequency?: NotificationFrequency;
          muted?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["follows"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          href: string | null;
          kind: NotificationKind;
          unread: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          href?: string | null;
          kind: NotificationKind;
          unread?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };

      events: {
        Row: {
          id: string;
          event_type: EventType;
          area_hash: string | null;
          category: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: EventType;
          area_hash?: string | null;
          category?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        // Append-only per RLS; typed as an empty shape so the chained builder
        // still resolves, even though no client should ever call update().
        Update: Record<string, never>;
        Relationships: [];
      };

      external_signals: {
        Row: {
          id: string;
          signal_type: SignalType;
          source: string | null;
          area_label: string | null;
          value_numeric: number | null;
          value_text: string | null;
          unit: string | null;
          metadata: Json;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          signal_type: SignalType;
          source?: string | null;
          area_label?: string | null;
          value_numeric?: number | null;
          value_text?: string | null;
          unit?: string | null;
          metadata?: Json;
          recorded_at?: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SignalType =
  | "fuel_price"
  | "ferry_status"
  | "weather"
  | "grocery_price"
  | "supply_alert"
  | "seasonal_marker";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type FollowRow = Database["public"]["Tables"]["follows"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type ExternalSignalRow = Database["public"]["Tables"]["external_signals"]["Row"];
export type ExternalSignalInsert = Database["public"]["Tables"]["external_signals"]["Insert"];
