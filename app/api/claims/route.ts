import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: "Invalid claim payload." }, { status: 400 });
  }

  // Phase 1 stub: record the claim immediately. Real verification flow
  // (email/phone codes) is wired up in Phase 6.
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
    return NextResponse.json(
      { error: error?.message ?? "Failed to record claim." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, claim: data });
}
