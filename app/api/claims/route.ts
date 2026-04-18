import { NextResponse } from "next/server";

import { emitContributionEvent } from "@/lib/supabase/contribution-queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ClaimVerificationMethod } from "@/lib/supabase/types";
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

  // Phase 1 stub: email/phone verification codes land in Phase 6. For now any
  // authenticated user can claim an unclaimed profile; the on_producer_claim
  // trigger promotes them to 'verified' and clears is_community_maintained.
  const { data, error } = await supabase
    .from("producer_claims")
    .insert({
      producer_id: claim.producer_id,
      claimed_by: user.id,
      verification_method: claim.verification_method
    })
    .select("id, producer_id, verification_method, verified_at")
    .single();

  if (error || !data) {
    // Unique violation on producer_id → already claimed.
    const pgCode = (error as { code?: string } | null)?.code;
    if (pgCode === "23505") {
      return NextResponse.json(
        { error: "This profile has already been claimed." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message ?? "Failed to record claim." },
      { status: 400 }
    );
  }

  await emitContributionEvent("profile.claimed", {
    metadata: {
      producerId: claim.producer_id,
      claimedBy: user.id,
      verificationMethod: claim.verification_method
    }
  });

  return NextResponse.json({ ok: true, claim: data });
}
