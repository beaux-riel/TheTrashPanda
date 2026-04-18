import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: "Invalid vote payload." }, { status: 400 });
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

  return NextResponse.json({ ok: true, vote: data });
}
