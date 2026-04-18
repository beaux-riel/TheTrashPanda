import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ContributionStatus,
  ContributionType,
  Json
} from "@/lib/supabase/types";
import type { ContributionPayload } from "@/lib/types/contributions";

const CONTRIBUTION_TYPES: ContributionType[] = [
  "profile_create",
  "profile_edit",
  "listing_create",
  "listing_edit",
  "availability_update",
  "flag_stale",
  "confirm_fresh"
];

function parsePayload(body: unknown): ContributionPayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.type !== "string") return null;
  if (!CONTRIBUTION_TYPES.includes(record.type as ContributionType)) return null;
  return record as unknown as ContributionPayload;
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
  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Invalid contribution payload." }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("trust_tier")
    .eq("id", user.id)
    .maybeSingle();

  const trustTier = profile?.trust_tier ?? "new";
  const status: ContributionStatus =
    trustTier === "trusted" || trustTier === "verified" ? "auto_approved" : "pending";

  const producerId =
    "producer_id" in payload && typeof payload.producer_id === "string"
      ? payload.producer_id
      : null;
  const listingId =
    "listing_id" in payload && typeof payload.listing_id === "string"
      ? payload.listing_id
      : null;

  const { data, error } = await supabase
    .from("contributions")
    .insert({
      contributor_id: user.id,
      producer_id: producerId,
      listing_id: listingId,
      type: payload.type,
      status,
      payload: payload as unknown as Json
    })
    .select("id, status, type, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create contribution." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, contribution: data });
}

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const statusFilter = (searchParams.get("status") ?? "pending") as ContributionStatus;

  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("status", statusFilter)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ contributions: data ?? [] });
}
