"use client";

/**
 * Client-safe data bridge — uses the browser Supabase client only.
 * Import this in client components instead of bridge.ts (which pulls in server.ts).
 */

import { createBrowserSupabaseClient } from "../supabase/client";
import type { Listing, Producer } from "./mock";
import {
  listings as mockListings,
  producers as mockProducers
} from "./mock";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export async function fetchListingsClient(): Promise<Listing[]> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) return [...mockListings];

  try {
    const { data, error } = await supabase
      .from("listings")
      .select(
        `*, producer:profiles!listings_producer_id_fkey (id, display_name, avatar_url, location_label)`
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) return [...mockListings];

    return data.map((row: any) => {
      const coords = row.location as { coordinates?: [number, number] } | null;
      return {
        id: row.id,
        producerId: row.producer_id,
        title: row.title,
        category: row.category,
        quantity: row.quantity,
        priceLabel: row.price_label ?? "Ask",
        distanceLabel: "",
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
    });
  } catch {
    return [...mockListings];
  }
}

export async function fetchProducersClient(): Promise<Producer[]> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) return [...mockProducers];

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_producer", true)
      .order("display_name");

    if (error || !data || data.length === 0) return [...mockProducers];

    return data.map((row: any) => {
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
  } catch {
    return [...mockProducers];
  }
}
