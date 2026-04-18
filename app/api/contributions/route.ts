import { NextResponse } from "next/server";

import {
  applyContributionPayload,
  emitContributionEvent,
  getTrustTier,
  promoteTrustTier,
  validateContributionPayload
} from "@/lib/supabase/contribution-queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ContributionRow,
  ContributionStatus,
  ContributionType,
  Json
} from "@/lib/supabase/types";
import {
  isAvailabilityUpdate,
  isConfirmFresh,
  isFlagStale,
  isListingCreate,
  isListingEdit,
  isProfileCreate,
  isProfileEdit,
  type ContributionPayload
} from "@/lib/types/contributions";

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

  // Run the type guards to narrow — the validator uses the narrowed shape.
  const p = record as unknown as ContributionPayload;
  if (
    isProfileCreate(p) ||
    isProfileEdit(p) ||
    isListingCreate(p) ||
    isListingEdit(p) ||
    isAvailabilityUpdate(p) ||
    isFlagStale(p) ||
    isConfirmFresh(p)
  ) {
    return p;
  }
  return null;
}

function extractLinks(payload: ContributionPayload): {
  producerId: string | null;
  listingId: string | null;
} {
  const producerId =
    "producer_id" in payload && typeof payload.producer_id === "string"
      ? payload.producer_id
      : null;
  const listingId =
    "listing_id" in payload && typeof payload.listing_id === "string"
      ? payload.listing_id
      : null;
  return { producerId, listingId };
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

  const validationError = validateContributionPayload(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const trustTier = await getTrustTier(supabase, user.id);
  const autoApprove = trustTier === "trusted" || trustTier === "verified";
  const status: ContributionStatus = autoApprove ? "auto_approved" : "pending";

  const { producerId, listingId } = extractLinks(payload);

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
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create contribution." },
      { status: 400 }
    );
  }

  const contribution = data as ContributionRow;

  // Auto-approved contributions apply their payload immediately. Any failure
  // here is best-effort: the contribution row is already committed, so we
  // surface the error but leave the audit log intact.
  let applyError: string | null = null;
  if (autoApprove) {
    const result = await applyContributionPayload(payload, user.id);
    if (!result.ok) {
      applyError = result.error;
    }
  }

  await promoteTrustTier(user.id);

  await emitContributionEvent("contribution.created", {
    metadata: {
      contributionId: contribution.id,
      contributorId: user.id,
      type: contribution.type,
      status: contribution.status,
      producerId,
      listingId
    }
  });

  if (autoApprove && !applyError) {
    await emitContributionEvent("contribution.approved", {
      metadata: {
        contributionId: contribution.id,
        type: contribution.type,
        auto: true
      }
    });
  }

  return NextResponse.json({
    ok: true,
    contribution: {
      id: contribution.id,
      status: contribution.status,
      type: contribution.type,
      created_at: contribution.created_at
    },
    ...(applyError ? { applyError } : {})
  });
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
  const producerIdFilter = searchParams.get("producer_id");

  const trustTier = await getTrustTier(supabase, user.id);
  const isReviewer = trustTier === "trusted" || trustTier === "verified";

  // Producers querying their own claimed-profile's queue don't need Trusted
  // tier — they just need a verified claim on that producer_id. Everyone else
  // needs Trusted+ to see pending contributions.
  if (!isReviewer) {
    if (!producerIdFilter) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data: claim } = await supabase
      .from("producer_claims")
      .select("id")
      .eq("producer_id", producerIdFilter)
      .eq("claimed_by", user.id)
      .maybeSingle();
    if (!claim) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let query = supabase
    .from("contributions")
    .select("*")
    .eq("status", statusFilter)
    .order("created_at", { ascending: false })
    .limit(50);

  if (producerIdFilter) {
    query = query.eq("producer_id", producerIdFilter);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ contributions: data ?? [] });
}
