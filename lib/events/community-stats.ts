import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { EventType } from "@/lib/supabase/types";

export type CommunityStats = {
  contributions: number;
  profiles_added: number;
  freshness_votes: number;
  claims: number;
};

export const EMPTY_COMMUNITY_STATS: CommunityStats = {
  contributions: 0,
  profiles_added: 0,
  freshness_votes: 0,
  claims: 0
};

export async function getCommunityStats(
  windowDays = 7
): Promise<CommunityStats> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return EMPTY_COMMUNITY_STATS;

  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("event_type, metadata, created_at")
    .gte("created_at", since)
    .in("event_type", [
      "contribution.created",
      "contribution.approved",
      "freshness.voted",
      "profile.claimed"
    ] satisfies EventType[]);

  if (error || !data) return EMPTY_COMMUNITY_STATS;

  const stats: CommunityStats = { ...EMPTY_COMMUNITY_STATS };
  for (const row of data) {
    const eventType = row.event_type as EventType;
    const metadata = (row.metadata ?? {}) as Record<string, unknown>;

    if (eventType === "contribution.created") {
      stats.contributions += 1;
    } else if (eventType === "freshness.voted") {
      stats.freshness_votes += 1;
    } else if (eventType === "profile.claimed") {
      stats.claims += 1;
    } else if (eventType === "contribution.approved") {
      if (metadata.type === "profile_create") {
        stats.profiles_added += 1;
      }
    }
  }

  return stats;
}

export function isEmptyStats(stats: CommunityStats): boolean {
  return (
    stats.contributions === 0 &&
    stats.profiles_added === 0 &&
    stats.freshness_votes === 0 &&
    stats.claims === 0
  );
}
