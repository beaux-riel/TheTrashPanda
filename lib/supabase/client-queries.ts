"use client";

/**
 * Client-only Supabase mutations + reads.
 * Mirrors the subset of lib/supabase/queries.ts that the browser can call directly,
 * but avoids the transitive next/headers import via server.ts.
 */

import { createBrowserSupabaseClient } from "./client";
import type {
  FollowRow,
  ListingRow,
  NotificationFrequency,
  NotificationRow,
  Quantity
} from "./types";

function client() {
  return createBrowserSupabaseClient();
}

// ---------------------------------------------------------------------------
// listings
// ---------------------------------------------------------------------------

export type ClientCreateListingInput = {
  producer_id: string;
  title: string;
  description?: string | null;
  category: string;
  quantity: Quantity;
  price_label?: string | null;
  location_label?: string | null;
  photos?: string[];
  available_until?: string | null;
  lng?: number;
  lat?: number;
};

const KNOWN_CATEGORIES = new Set([
  "Eggs",
  "Produce",
  "Baked Goods",
  "Preserved",
  "Dairy",
  "Meat & Fish",
  "Honey",
  "Plants",
  "Prepared Food",
  "Other"
]);

function validateListingInput(input: ClientCreateListingInput) {
  const title = (input.title ?? "").trim();
  if (!title) throw new Error("Listing title is required.");
  if (title.length > 200) throw new Error("Listing title must be 200 characters or fewer.");

  const description = input.description?.trim() ?? null;
  if (description && description.length > 2000) {
    throw new Error("Listing description must be 2000 characters or fewer.");
  }

  if (!KNOWN_CATEGORIES.has(input.category)) {
    throw new Error(`Unknown listing category: ${input.category}`);
  }

  const priceLabel = input.price_label?.trim() ?? null;
  if (priceLabel && priceLabel.length > 100) {
    throw new Error("Price label must be 100 characters or fewer.");
  }

  if (input.lng != null || input.lat != null) {
    if (
      typeof input.lng !== "number" ||
      !Number.isFinite(input.lng) ||
      typeof input.lat !== "number" ||
      !Number.isFinite(input.lat)
    ) {
      throw new Error("Listing coordinates must be finite numbers.");
    }
    if (input.lng < -180 || input.lng > 180) {
      throw new Error("Listing longitude must be between -180 and 180.");
    }
    if (input.lat < -90 || input.lat > 90) {
      throw new Error("Listing latitude must be between -90 and 90.");
    }
  }

  return { title, description, priceLabel };
}

export async function createListingClient(
  input: ClientCreateListingInput
): Promise<ListingRow | null> {
  const supabase = client();
  if (!supabase) return null;

  const { title, description, priceLabel } = validateListingInput(input);

  const row: Record<string, unknown> = {
    producer_id: input.producer_id,
    title,
    description,
    category: input.category,
    quantity: input.quantity,
    price_label: priceLabel,
    location_label: input.location_label?.trim() || null,
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
  return data as unknown as ListingRow;
}

export async function markListingGoneClient(id: string): Promise<ListingRow | null> {
  const supabase = client();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("listings")
    .update({ status: "gone" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as ListingRow;
}

// ---------------------------------------------------------------------------
// follows
// ---------------------------------------------------------------------------

export type ClientToggleFollowTarget =
  | { type: "producer"; producerId: string; frequency?: NotificationFrequency }
  | { type: "category"; category: string; frequency?: NotificationFrequency }
  | {
      type: "area";
      areaLng: number;
      areaLat: number;
      radiusKm: number;
      frequency?: NotificationFrequency;
    };

function validateArea(target: Extract<ClientToggleFollowTarget, { type: "area" }>) {
  if (
    typeof target.areaLng !== "number" ||
    !Number.isFinite(target.areaLng) ||
    typeof target.areaLat !== "number" ||
    !Number.isFinite(target.areaLat)
  ) {
    throw new Error("Follow area coordinates must be finite numbers.");
  }
  if (target.areaLng < -180 || target.areaLng > 180) {
    throw new Error("Follow area longitude must be between -180 and 180.");
  }
  if (target.areaLat < -90 || target.areaLat > 90) {
    throw new Error("Follow area latitude must be between -90 and 90.");
  }
  if (typeof target.radiusKm !== "number" || !Number.isFinite(target.radiusKm) || target.radiusKm <= 0) {
    throw new Error("Follow area radius must be a positive number.");
  }
}

export async function toggleFollowClient(
  userId: string,
  target: ClientToggleFollowTarget
): Promise<{ action: "added" | "removed"; row: FollowRow | null }> {
  const supabase = client();
  if (!supabase) return { action: "removed", row: null };

  let matchQuery = supabase
    .from("follows")
    .select("*")
    .eq("follower_id", userId)
    .eq("follow_type", target.type)
    .limit(1);

  if (target.type === "producer") matchQuery = matchQuery.eq("producer_id", target.producerId);
  if (target.type === "category") matchQuery = matchQuery.eq("category", target.category);

  const { data: existing } = await matchQuery.maybeSingle();

  if (existing) {
    await supabase.from("follows").delete().eq("id", (existing as FollowRow).id);
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
    validateArea(target);
    insert.area_center = `SRID=4326;POINT(${target.areaLng} ${target.areaLat})`;
    insert.area_radius_km = target.radiusKm;
  }

  const { data, error } = await supabase
    .from("follows")
    .insert(insert as never)
    .select("*")
    .single();

  if (error) {
    // Race: unique constraint — treat as "already following" success.
    if ((error as { code?: string }).code === "23505") {
      return { action: "added", row: null };
    }
    throw error;
  }

  return { action: "added", row: data as FollowRow };
}

export async function getFollowsClient(userId: string): Promise<FollowRow[]> {
  const supabase = client();
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

export async function getNotificationsClient(userId: string): Promise<NotificationRow[]> {
  const supabase = client();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data as NotificationRow[]) ?? [];
}

export async function markNotificationReadClient(id: string): Promise<void> {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("notifications").update({ unread: false }).eq("id", id);
}
