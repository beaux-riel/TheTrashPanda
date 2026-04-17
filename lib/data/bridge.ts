/**
 * Data bridge — tries Supabase first, falls back to mock data.
 *
 * Every component goes through this layer instead of importing mock data
 * directly. When Supabase env vars are set, real data flows. When they're
 * absent (local dev, demos), mock data keeps everything rendering.
 */

import {
  listings as mockListings,
  producers as mockProducers,
  initialFollows as mockFollows,
  initialNotifications as mockNotifications,
  type Listing,
  type Producer,
  type Follow,
  type NotificationItem
} from "./mock";
import {
  getListings as supaGetListings,
  getListingById as supaGetListingById,
  getProducer as supaGetProducer,
  getProducersList as supaGetProducers,
  type ListingWithProducer
} from "../supabase/queries";

// ---------------------------------------------------------------------------
// config check
// ---------------------------------------------------------------------------

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ---------------------------------------------------------------------------
// adapters: Supabase row → mock-compatible shape
// ---------------------------------------------------------------------------

function adaptListingRow(row: ListingWithProducer): Listing {
  const coords = row.location as { coordinates?: [number, number] } | null;
  return {
    id: row.id,
    producerId: row.producer_id,
    title: row.title,
    category: row.category,
    quantity: row.quantity,
    priceLabel: row.price_label ?? "Ask",
    distanceLabel: row.distance_m != null
      ? row.distance_m < 1000
        ? `${Math.round(row.distance_m)}m away`
        : `${(row.distance_m / 1000).toFixed(1)}km away`
      : "",
    postedLabel: `posted ${timeAgo(row.created_at)}`,
    postedAt: row.created_at,
    locationLabel: row.location_label ?? "",
    lat: coords?.coordinates?.[1] ?? 0,
    lng: coords?.coordinates?.[0] ?? 0,
    views: 0,
    status: row.status,
    description: row.description ?? "",
    availableUntil: row.available_until
      ? new Date(row.available_until).toLocaleString("en-CA", {
          weekday: "long",
          hour: "numeric",
          minute: "2-digit"
        })
      : "Until gone"
  };
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

// ---------------------------------------------------------------------------
// public API
// ---------------------------------------------------------------------------

export async function getListingsData(filters?: {
  category?: string;
  near?: { lat: number; lng: number; radiusKm: number };
}): Promise<Listing[]> {
  if (isSupabaseConfigured()) {
    try {
      const rows = await supaGetListings({
        category: filters?.category,
        status: "active",
        near: filters?.near
          ? {
              lng: filters.near.lng,
              lat: filters.near.lat,
              radiusKm: filters.near.radiusKm
            }
          : undefined
      });
      return rows.map(adaptListingRow);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[bridge] getListings failed, falling back to mock", err);
      }
    }
  }

  let result = [...mockListings];
  if (filters?.category) {
    result = result.filter((l) => l.category === filters.category);
  }
  return result;
}

export async function getListingData(id: string): Promise<Listing | null> {
  if (isSupabaseConfigured()) {
    try {
      const row = await supaGetListingById(id);
      if (row) return adaptListingRow(row);
      return null;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[bridge] Supabase read failed, falling back to mock", err);
      }
    }
  }

  return mockListings.find((l) => l.id === id) ?? null;
}

export async function getProducerData(
  idOrSlug: string
): Promise<Producer | null> {
  if (isSupabaseConfigured()) {
    try {
      const row = await supaGetProducer(idOrSlug);
      if (row) {
        const coords = row.location as { coordinates?: [number, number] } | null;
        return {
          id: row.id,
          slug: row.display_name?.toLowerCase().replace(/\s+/g, "-") ?? row.id,
          name: row.display_name ?? "Unknown",
          bio: row.bio ?? "",
          categories: row.categories,
          locationLabel: row.location_label ?? "",
          lat: coords?.coordinates?.[1] ?? 0,
          lng: coords?.coordinates?.[0] ?? 0,
          pickupDetails: row.pickup_details ?? "",
          scheduleSummary: row.schedule_summary ?? "",
          followerCount: 0,
          activeListingIds: []
        };
      }
      return null;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[bridge] Supabase read failed, falling back to mock", err);
      }
    }
  }

  return (
    mockProducers.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    ) ?? null
  );
}

export async function getProducersData(): Promise<Producer[]> {
  if (isSupabaseConfigured()) {
    try {
      const rows = await supaGetProducers();
      if (rows.length > 0) {
        return rows.map((row) => {
          const coords = row.location as { coordinates?: [number, number] } | null;
          return {
            id: row.id,
            slug: row.display_name?.toLowerCase().replace(/\s+/g, "-") ?? row.id,
            name: row.display_name ?? "Unknown",
            bio: row.bio ?? "",
            categories: row.categories ?? [],
            locationLabel: row.location_label ?? "",
            lat: coords?.coordinates?.[1] ?? 0,
            lng: coords?.coordinates?.[0] ?? 0,
            pickupDetails: row.pickup_details ?? "",
            scheduleSummary: row.schedule_summary ?? "",
            followerCount: 0,
            activeListingIds: []
          };
        });
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[bridge] getProducersList failed, falling back to mock", err);
      }
    }
  }
  return [...mockProducers];
}

export function getFollowsData(): Follow[] {
  // Follows require auth context — mock for now
  return [...mockFollows];
}

export function getNotificationsData(): NotificationItem[] {
  // Notifications require auth context — mock for now
  return [...mockNotifications];
}
