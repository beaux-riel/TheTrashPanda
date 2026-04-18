import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { FreshnessSummary } from "@/lib/types/contributions";

export async function GET(
  _request: Request,
  { params }: { params: { listingId: string } }
) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: votes, error } = await supabase
    .from("freshness_votes")
    .select("voter_id, is_fresh, created_at")
    .eq("listing_id", params.listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("freshness_confirmed_at")
    .eq("id", params.listingId)
    .maybeSingle();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const rows = votes ?? [];
  const freshCount = rows.filter((v) => v.is_fresh).length;
  const staleCount = rows.filter((v) => !v.is_fresh).length;
  const viewerVote = user ? rows.find((v) => v.voter_id === user.id)?.is_fresh ?? null : null;

  const summary: FreshnessSummary = {
    listing_id: params.listingId,
    fresh_count: freshCount,
    stale_count: staleCount,
    last_confirmed_at: listing?.freshness_confirmed_at ?? null,
    viewer_vote: viewerVote
  };

  return NextResponse.json({ summary });
}
