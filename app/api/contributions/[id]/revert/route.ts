import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/events/emit";
import {
  getContribution,
  getTrustTier,
  isClaimedOwner,
  revertContributionPayload
} from "@/lib/supabase/contribution-queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ContributionPayload } from "@/lib/types/contributions";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

  const contribution = await getContribution(supabase, params.id);
  if (!contribution) {
    return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
  }

  if (contribution.status !== "approved" && contribution.status !== "auto_approved") {
    return NextResponse.json(
      { error: `Only approved contributions can be reverted (current: ${contribution.status}).` },
      { status: 422 }
    );
  }

  // Revert is a Verified-tier action OR the claimed profile owner.
  const trustTier = await getTrustTier(supabase, user.id);
  const isVerified = trustTier === "verified";
  const isOwner = await isClaimedOwner(supabase, user.id, contribution.producer_id);
  if (!isVerified && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = contribution.payload as unknown as ContributionPayload;
  const result = await revertContributionPayload(payload, {
    producerId: contribution.producer_id,
    listingId: contribution.listing_id
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contributions")
    .update({
      status: "reverted",
      reverted_by: user.id,
      reverted_at: new Date().toISOString()
    })
    .eq("id", params.id)
    .in("status", ["approved", "auto_approved"])
    .select("id, status, type")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Contribution is no longer in a revertable state (race)." },
      { status: 409 }
    );
  }

  await emitEvent("contribution.reverted", {
    metadata: {
      contributionId: contribution.id,
      type: contribution.type,
      reverterId: user.id,
      note: result.note ?? null
    }
  });

  return NextResponse.json({ ok: true, contribution: data, note: result.note ?? null });
}
