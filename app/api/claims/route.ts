import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/events/emit";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";
import type { ClaimVerificationMethod, ProfileRow } from "@/lib/supabase/types";
import type { ClaimPayload } from "@/lib/types/contributions";

const METHODS: ClaimVerificationMethod[] = ["email", "phone", "admin", "in_person"];

function parseClaim(body: unknown): ClaimPayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.producer_id !== "string") return null;
  if (
    typeof record.verification_method !== "string" ||
    !METHODS.includes(record.verification_method as ClaimVerificationMethod)
  ) {
    return null;
  }
  return {
    producer_id: record.producer_id,
    verification_method: record.verification_method as ClaimVerificationMethod,
    contact: typeof record.contact === "string" ? record.contact : undefined
  };
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
  const claim = parseClaim(body);
  if (!claim) {
    return NextResponse.json({ error: "Invalid claim payload." }, { status: 422 });
  }

  // 1. Verify the producer profile exists and is community-maintained.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, is_producer, is_community_maintained")
    .eq("id", claim.producer_id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }
  if (!profile.is_producer) {
    return NextResponse.json(
      { error: "Only producer profiles can be claimed." },
      { status: 422 }
    );
  }
  if (!profile.is_community_maintained) {
    return NextResponse.json(
      { error: "This profile is not community-maintained." },
      { status: 409 }
    );
  }

  // 2. Check not already claimed (pre-insert check for a clearer error; the
  //    unique constraint on producer_id is the real guarantee).
  const { data: existing } = await supabase
    .from("producer_claims")
    .select("id")
    .eq("producer_id", claim.producer_id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "This profile has already been claimed." },
      { status: 409 }
    );
  }

  // 3. Insert the claim. The on_producer_claim_verified trigger promotes the
  //    claimant to trust_tier='verified' and clears is_community_maintained on
  //    the claimed profile. Phase 1 simplification: auto-verify immediately,
  //    no code sending.
  const { data: claimRow, error: claimError } = await supabase
    .from("producer_claims")
    .insert({
      producer_id: claim.producer_id,
      claimed_by: user.id,
      verification_method: claim.verification_method
    })
    .select("id, producer_id, verification_method, verified_at")
    .single();

  if (claimError || !claimRow) {
    const pgCode = (claimError as { code?: string } | null)?.code;
    if (pgCode === "23505") {
      return NextResponse.json(
        { error: "This profile has already been claimed." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: claimError?.message ?? "Failed to record claim." },
      { status: 400 }
    );
  }

  // 4. Defensively ensure is_community_maintained=false on the profile. The
  //    trigger should handle this, but RLS on profiles might block cross-user
  //    writes in edge cases — use the service client as a backstop.
  let updatedProfile: ProfileRow | null = null;
  const service = createServiceSupabaseClient();
  if (service) {
    const { data: updated } = await service
      .from("profiles")
      .update({ is_community_maintained: false })
      .eq("id", claim.producer_id)
      .select("*")
      .maybeSingle();
    updatedProfile = (updated as ProfileRow | null) ?? null;
  }

  // 5. Emit the profile.claimed event.
  await emitEvent("profile.claimed", {
    metadata: {
      producerId: claim.producer_id,
      claimedBy: user.id,
      verificationMethod: claim.verification_method
    }
  });

  return NextResponse.json({
    ok: true,
    claim: claimRow,
    profile: updatedProfile
  });
}
