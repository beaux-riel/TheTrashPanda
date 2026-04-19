/**
 * Centralized event emitter for the Le-WM event pipeline.
 *
 * All contribution / freshness / claim / listing lifecycle events go through
 * this module so there's one place to add batching, retries, or shipping to an
 * external analytics sink later. Fire-and-forget: errors are logged in dev but
 * never thrown — events must not break the request path.
 *
 * In addition to the Supabase analytics insert, mapped events are pushed to
 * DripCtl for drip-sequence triggering. DripCtl delivery is best-effort and
 * guarded — a missing client (unconfigured env) or a failed API call will
 * never propagate to the caller.
 */

import { getDripCtl } from "@/lib/dripctl/client";
import { mapToDripCtlEvent } from "@/lib/dripctl/event-map";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { EventInsert, EventType, Json } from "@/lib/supabase/types";

export type EmitEventInput = {
  userId?: string | null;
  areaHash?: string | null;
  category?: string | null;
  metadata?: Json;
};

export async function emitEvent(
  type: EventType,
  input: EmitEventInput = {}
): Promise<void> {
  try {
    const supabase = createServiceSupabaseClient();
    if (supabase) {
      const row: EventInsert = {
        event_type: type,
        area_hash: input.areaHash ?? null,
        category: input.category ?? null,
        metadata: input.metadata ?? {}
      };
      const { error } = await supabase.from("events").insert(row as never);
      if (error && process.env.NODE_ENV === "development") {
        console.warn("[events] emitEvent failed", type, error.message);
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[events] emitEvent threw", type, err);
    }
  }

  try {
    const dripctl = getDripCtl();
    if (!dripctl) return;
    const mapped = mapToDripCtlEvent(type, {
      userId: input.userId,
      areaHash: input.areaHash,
      category: input.category,
      metadata: input.metadata
    });
    if (!mapped) return;
    await dripctl.events.create(mapped);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[events] dripctl push failed", type, err);
    }
  }
}
