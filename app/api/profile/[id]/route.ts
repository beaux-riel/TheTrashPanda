import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ContributionRow, ContributionType, ProfileRow, TrustTier } from "@/lib/supabase/types";

export type ProfileApiResponse = {
  profile: {
    id: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    trust_tier: TrustTier;
    contribution_count: number;
    first_contribution_at: string | null;
    created_at: string;
    location_label: string | null;
  };
  stats: {
    profilesAdded: number;
    listingsPosted: number;
    freshnessVotes: number;
    edits: number;
    total: number;
  };
  recent: Array<Pick<ContributionRow, "id" | "type" | "status" | "created_at" | "producer_id" | "listing_id">>;
};

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, display_name, bio, avatar_url, trust_tier, contribution_count, first_contribution_at, created_at, location_label"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: contributions, error: contribError } = await supabase
    .from("contributions")
    .select("id, type, status, created_at, producer_id, listing_id")
    .eq("contributor_id", params.id)
    .in("status", ["approved", "auto_approved"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (contribError) {
    return NextResponse.json({ error: contribError.message }, { status: 400 });
  }

  const rows = (contributions ?? []) as Array<
    Pick<ContributionRow, "id" | "type" | "status" | "created_at" | "producer_id" | "listing_id">
  >;

  const countBy = (type: ContributionType) => rows.filter((r) => r.type === type).length;
  const stats = {
    profilesAdded: countBy("profile_create"),
    listingsPosted: countBy("listing_create"),
    freshnessVotes: countBy("confirm_fresh") + countBy("flag_stale"),
    edits: countBy("profile_edit") + countBy("listing_edit") + countBy("availability_update"),
    total: rows.length
  };

  const body: ProfileApiResponse = {
    profile: profile as ProfileApiResponse["profile"] & Partial<ProfileRow>,
    stats,
    recent: rows.slice(0, 10)
  };

  return NextResponse.json(body);
}
