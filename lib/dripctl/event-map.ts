/**
 * Maps Le-WM internal event types to DripCtl event types.
 *
 * Not every internal event is worth shipping — `demand.*` fires on routine
 * browsing and would just be noise to a drip-sequence engine. Everything that
 * represents a real lifecycle change (listings, contributions, follows,
 * freshness votes, profile claims) gets mapped.
 */

import type { EventType, Json } from "@/lib/supabase/types";
import type { CreateEventInput } from "@dripctl/sdk";

const EVENT_TYPE_MAP: Partial<Record<EventType, string>> = {
  "listing.created": "listing.created",
  "listing.updated": "listing.updated",
  "listing.gone": "listing.gone",
  "listing.expired": "listing.expired",
  "demand.follow": "demand.follow",
  "follow.created": "follow.created",
  "follow.removed": "follow.removed",
  "contribution.created": "contribution.submitted",
  "contribution.approved": "contribution.approved",
  "contribution.rejected": "contribution.rejected",
  "contribution.reverted": "contribution.reverted",
  "profile.claimed": "claim.approved",
  "freshness.voted": "freshness.voted",
  "freshness.stale_flagged": "freshness.stale_flagged"
};

export type MappedDripCtlEvent = CreateEventInput;

export function mapToDripCtlEvent(
  type: EventType,
  options: {
    userId?: string | null;
    areaHash?: string | null;
    category?: string | null;
    metadata?: Json;
  }
): MappedDripCtlEvent | null {
  const dripType = EVENT_TYPE_MAP[type];
  if (!dripType) return null;

  const payload: Record<string, unknown> = {};
  if (options.areaHash) payload.areaHash = options.areaHash;
  if (options.category) payload.category = options.category;
  if (options.metadata && typeof options.metadata === "object") {
    Object.assign(payload, options.metadata as Record<string, unknown>);
  }

  const input: MappedDripCtlEvent = {
    eventType: dripType,
    payload
  };
  if (options.userId) input.userId = options.userId;
  return input;
}
