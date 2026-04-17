import type { SupabaseClient } from "@supabase/supabase-js";

import { createBrowserSupabaseClient } from "./client";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient
} from "./server";
import type {
  Database,
  EventInsert,
  EventType,
  FollowRow,
  FollowType,
  Json,
  ListingRow,
  ListingStatus,
  NotificationFrequency,
  NotificationKind,
  ProfileRow,
  Quantity
} from "./types";

type HL = SupabaseClient<Database>;

// ---------------------------------------------------------------------------
// client resolution
// Prefer whichever context the caller is in — server components / route handlers
// hit createServerSupabaseClient, the browser hits createBrowserSupabaseClient.
// ---------------------------------------------------------------------------
function resolveClient(explicit?: HL | null): HL | null {
  if (explicit) return explicit;
  if (typeof window === "undefined") {
    return createServerSupabaseClient();
  }
  return createBrowserSupabaseClient();
}

// ---------------------------------------------------------------------------
// listings
// ---------------------------------------------------------------------------

export type ListingFilters = {
  category?: string;
  status?: ListingStatus | ListingStatus[];
  producerId?: string;
  limit?: number;
  // Geo filter — if provided, restricts to listings within radiusKm of [lng, lat].
  near?: { lng: number; lat: number; radiusKm: number };
  orderBy?: "created_at" | "distance";
};

export type ListingWithProducer = ListingRow & {
  producer: Pick<ProfileRow, "id" | "display_name" | "avatar_url" | "location_label"> | null;
  distance_m?: number | null;
};

export async function getListings(
  filters: ListingFilters = {},
  client?: HL | null
): Promise<ListingWithProducer[]> {
  const supabase = resolveClient(client);
  if (!supabase) return [];

  // PostGIS distance: when `near` is set we use a SQL RPC-free trick via
  // Supabase's PostgREST filters. ST_DWithin + ST_Distance need raw SQL, so
  // we do the geo slice as a Postgres function call. Fall back to a plain
  // select when no geo filter is requested.
  if (filters.near) {
    const { lng, lat, radiusKm } = filters.near;
    const radiusMeters = radiusKm * 1000;
    // Use rpc-like raw via the PostgREST `rpc` fallback: listings filtered in
    // SQL through a `listings_near` view would be cleaner, but to keep this
    // self-contained we do it as two steps: candidate listings, then in-memory
    // distance ordering. This keeps RLS intact.
    const { data, error } = await supabase
      .from("listings")
      .select(
        `*,
         producer:profiles!listings_producer_id_fkey (id, display_name, avatar_url, location_label)`
      )
      .limit(filters.limit ?? 100);
    if (error) throw error;
    const enriched = (data ?? [])
      .map((row) => {
        const listing = row as unknown as ListingWithProducer;
        const coords = listing.location?.coordinates;
        if (!coords) return { ...listing, distance_m: null };
        const distance = haversineMeters(lng, lat, coords[0], coords[1]);
        return { ...listing, distance_m: distance };
      })
      .filter(
        (listing) =>
          listing.distance_m != null && (listing.distance_m as number) <= radiusMeters
      );

    enriched.sort((a, b) => (a.distance_m ?? Infinity) - (b.distance_m ?? Infinity));
    return applyNonGeoFilters(enriched, filters);
  }

  let query = supabase
    .from("listings")
    .select(
      `*,
       producer:profiles!listings_producer_id_fkey (id, display_name, avatar_url, location_label)`
    )
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 50);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.producerId) query = query.eq("producer_id", filters.producerId);
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      query = query.in("status", filters.status);
    } else {
      query = query.eq("status", filters.status);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ListingWithProducer[]) ?? [];
}

function applyNonGeoFilters(rows: ListingWithProducer[], filters: ListingFilters) {
  return rows.filter((row) => {
    if (filters.category && row.category !== filters.category) return false;
    if (filters.producerId && row.producer_id !== filters.producerId) return false;
    if (filters.status) {
      const wanted = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (!wanted.includes(row.status)) return false;
    }
    return true;
  });
}

export async function getListingById(
  id: string,
  client?: HL | null
): Promise<ListingWithProducer | null> {
  const supabase = resolveClient(client);
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("listings")
    .select(
      `*,
       producer:profiles!listings_producer_id_fkey (id, display_name, avatar_url, location_label)`
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ListingWithProducer | null) ?? null;
}

export type CreateListingInput = {
  producer_id: string;
  title: string;
  description?: string | null;
  category: string;
  quantity: Quantity;
  price_label?: string | null;
  location_label?: string | null;
  photos?: string[];
  available_until?: string | null;
  // Optional lng/lat — we translate to a geography point via ST_MakePoint.
  lng?: number;
  lat?: number;
};

export async function createListing(
  input: CreateListingInput,
  client?: HL | null
): Promise<ListingRow | null> {
  const supabase = resolveClient(client);
  if (!supabase) return null;

  // Build the insert payload; the location geography is only settable via SQL
  // string (PostgREST accepts WKT for geography columns).
  const row: Record<string, unknown> = {
    producer_id: input.producer_id,
    title: input.title,
    description: input.description ?? null,
    category: input.category,
    quantity: input.quantity,
    price_label: input.price_label ?? null,
    location_label: input.location_label ?? null,
    photos: input.photos ?? [],
    available_until: input.available_until ?? null
  };
  if (input.lng != null && input.lat != null) {
    row.location = `SRID=4326;POINT(${input.lng} ${input.lat})`;
  }

  const { data, error } = await supabase
    .from("listings")
    .insert(row as never)
    .select("*")
    .single();
  if (error) throw error;

  const listing = data as unknown as ListingRow;
  void logEvent("listing.created", {
    category: listing.category,
    metadata: { listingId: listing.id, quantity: listing.quantity }
  });
  return listing;
}

export async function markListingGone(
  id: string,
  client?: HL | null
): Promise<ListingRow | null> {
  const supabase = resolveClient(client);
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("listings")
    .update({ status: "gone" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;

  const listing = data as unknown as ListingRow;
  void logEvent("listing.gone", {
    category: listing.category,
    metadata: { listingId: listing.id }
  });
  return listing;
}

// ---------------------------------------------------------------------------
// producers / profiles
// ---------------------------------------------------------------------------

export async function getProducer(
  idOrSlug: string,
  client?: HL | null
): Promise<ProfileRow | null> {
  const supabase = resolveClient(client);
  if (!supabase) return null;

  // We don't have a slug column yet; treat the input as a profile id first,
  // then fall back to a display_name match so the existing scaffold's
  // "cedar-bloom" style routes have a path to real data once profiles land.
  const { data: byId } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", idOrSlug)
    .maybeSingle();
  if (byId) return byId as ProfileRow;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("display_name", idOrSlug.replace(/-/g, " "))
    .maybeSingle();
  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
}

// ---------------------------------------------------------------------------
// follows
// ---------------------------------------------------------------------------

export type ToggleFollowTarget =
  | { type: "producer"; producerId: string; frequency?: NotificationFrequency }
  | { type: "category"; category: string; frequency?: NotificationFrequency }
  | {
      type: "area";
      areaLng: number;
      areaLat: number;
      radiusKm: number;
      frequency?: NotificationFrequency;
    };

export async function toggleFollow(
  userId: string,
  target: ToggleFollowTarget,
  client?: HL | null
): Promise<{ action: "added" | "removed"; row: FollowRow | null }> {
  const supabase = resolveClient(client);
  if (!supabase) return { action: "removed", row: null };

  const matchQuery = supabase
    .from("follows")
    .select("*")
    .eq("follower_id", userId)
    .eq("follow_type", target.type)
    .limit(1);

  if (target.type === "producer") matchQuery.eq("producer_id", target.producerId);
  if (target.type === "category") matchQuery.eq("category", target.category);

  const { data: existing } = await matchQuery.maybeSingle();

  if (existing) {
    await supabase.from("follows").delete().eq("id", existing.id);
    void logEvent("follow.removed", {
      category: (existing as FollowRow).category,
      metadata: { followType: (existing as FollowRow).follow_type }
    });
    return { action: "removed", row: null };
  }

  const insert: Record<string, unknown> = {
    follower_id: userId,
    follow_type: target.type,
    frequency: target.frequency ?? "immediate"
  };
  if (target.type === "producer") insert.producer_id = target.producerId;
  if (target.type === "category") insert.category = target.category;
  if (target.type === "area") {
    insert.area_center = `SRID=4326;POINT(${target.areaLng} ${target.areaLat})`;
    insert.area_radius_km = target.radiusKm;
  }

  const { data, error } = await supabase
    .from("follows")
    .insert(insert as never)
    .select("*")
    .single();
  if (error) throw error;

  const row = data as FollowRow;
  void logEvent("follow.created", {
    category: row.category,
    metadata: { followType: row.follow_type }
  });
  return { action: "added", row };
}

export async function getFollows(
  userId: string,
  client?: HL | null
): Promise<FollowRow[]> {
  const supabase = resolveClient(client);
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as FollowRow[]) ?? [];
}

// ---------------------------------------------------------------------------
// notifications
// ---------------------------------------------------------------------------

export async function getNotifications(userId: string, client?: HL | null) {
  const supabase = resolveClient(client);
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string, client?: HL | null) {
  const supabase = resolveClient(client);
  if (!supabase) return;
  await supabase.from("notifications").update({ unread: false }).eq("id", id);
}

// Server-only helper — service role bypasses RLS for the notifications insert.
export async function createNotification(params: {
  userId: string;
  title: string;
  body?: string | null;
  href?: string | null;
  kind: NotificationKind;
}) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return;
  await supabase.from("notifications").insert({
    user_id: params.userId,
    title: params.title,
    body: params.body ?? null,
    href: params.href ?? null,
    kind: params.kind
  });
}

// ---------------------------------------------------------------------------
// Le-WM events
// ---------------------------------------------------------------------------

export type LogEventInput = {
  areaHash?: string | null;
  category?: string | null;
  metadata?: Json;
};

/**
 * Append a Le-WM event. Fires and forgets — never throws so analytics can't
 * break the UI. Uses whichever auth context the caller is in; the RLS policy
 * allows insert for both anon and authenticated, and select is blocked.
 */
export async function logEvent(type: EventType, input: LogEventInput = {}): Promise<void> {
  try {
    const supabase = resolveClient();
    if (!supabase) return;
    const row: EventInsert = {
      event_type: type,
      area_hash: input.areaHash ?? null,
      category: input.category ?? null,
      metadata: input.metadata ?? {}
    };
    await supabase.from("events").insert(row as never);
  } catch {
    // Swallow. Le-WM must never crash a request.
  }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

// Haversine distance in meters. Sufficient for within-Powell-River filtering;
// swap for ST_Distance in a SQL view if you need strict accuracy or volume.
function haversineMeters(lng1: number, lat1: number, lng2: number, lat2: number): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

// ---------------------------------------------------------------------------
// external signals
// ---------------------------------------------------------------------------

import type { ExternalSignalRow, SignalType } from "./types";

export async function getSignals(
  params: {
    type?: SignalType;
    areaLabel?: string;
    since?: string;
    limit?: number;
  },
  client?: HL | null
): Promise<ExternalSignalRow[]> {
  const supabase = resolveClient(client);
  if (!supabase) return [];

  let query = supabase
    .from("external_signals")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(params.limit ?? 100);

  if (params.type) query = query.eq("signal_type", params.type);
  if (params.areaLabel) query = query.eq("area_label", params.areaLabel);
  if (params.since) query = query.gte("recorded_at", params.since);

  const { data, error } = await query;
  if (error) throw error;
  return (data as ExternalSignalRow[]) ?? [];
}

export async function recordSignal(input: {
  signalType: SignalType;
  source?: string;
  areaLabel?: string;
  valueNumeric?: number;
  valueText?: string;
  unit?: string;
  metadata?: Json;
  recordedAt?: string;
}): Promise<void> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return;
  await supabase.from("external_signals").insert({
    signal_type: input.signalType,
    source: input.source ?? null,
    area_label: input.areaLabel ?? null,
    value_numeric: input.valueNumeric ?? null,
    value_text: input.valueText ?? null,
    unit: input.unit ?? null,
    metadata: input.metadata ?? {},
    recorded_at: input.recordedAt ?? new Date().toISOString()
  } as never);
}

// Re-export common types so consumers don't need to import from /types.
export type { FollowType, Quantity, ListingStatus, NotificationFrequency, EventType, SignalType };
