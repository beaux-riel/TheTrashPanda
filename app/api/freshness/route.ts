import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/events/emit";
import {
  getTrustTier,
  incrementStaleFlag,
  stampFreshnessConfirmed
} from "@/lib/supabase/contribution-queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { FreshnessVotePayload } from "@/lib/types/contributions";

function parseVote(body: unknown): FreshnessVotePayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.listing_id !== "string" || typeof record.is_fresh !== "boolean") {
    return null;
  }
  return { listing_id: record.listing_id, is_fresh: record.is_fresh };
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const vote = parseVote(body);
  if (!vote) {
    return NextResponse.json({ error: "Invalid vote payload." }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("freshness_votes")
    .upsert(
      {
        listing_id: vote.listing_id,
        voter_id: user.id,
        is_fresh: vote.is_fresh
      },
      { onConflict: "listing_id,voter_id" }
    )
    .select("id, listing_id, is_fresh, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to record vote." },
      { status: 400 }
    );
  }

  // Trusted+ voters get elevated effects: a fresh vote resets the stale flag
  // count (clearing a misflagged listing), a stale vote from any user still
  // increments the count but Trusted+ reviewers pushing the count across 3
  // also trigger the listing.gone event.
  const trustTier = await getTrustTier(supabase, user.id);
  const isTrusted = trustTier === "trusted" || trustTier === "verified";

  let markedGone = false;
  let staleFlagCount: number | null = null;
  if (vote.is_fresh) {
    await stampFreshnessConfirmed(vote.listing_id, { resetStaleCount: isTrusted });
  } else {
    const result = await incrementStaleFlag(vote.listing_id);
    if (result) {
      staleFlagCount = result.staleFlagCount;
      markedGone = result.markedGone;
    }
  }

  await emitEvent("freshness.voted", {
    metadata: {
      listingId: vote.listing_id,
      voterId: user.id,
      isFresh: vote.is_fresh,
      staleFlagCount,
      trustTier
    }
  });

  if (markedGone) {
    await emitEvent("freshness.stale_flagged", {
      metadata: { listingId: vote.listing_id, staleFlagCount }
    });
    await emitEvent("listing.gone", {
      metadata: { listingId: vote.listing_id, reason: "stale_threshold", staleFlagCount }
    });
  }

  return NextResponse.json({
    ok: true,
    vote: data,
    markedGone,
    staleFlagCount,
    trustTier
  });
}
