import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/events/emit";
import {
  applyContributionPayload,
  getContribution,
  getTrustTier,
  isClaimedOwner,
  promoteTrustTier
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
  if (contribution.status !== "pending") {
    return NextResponse.json(
      { error: `Contribution is ${contribution.status}, not pending.` },
      { status: 422 }
    );
  }

  const trustTier = await getTrustTier(supabase, user.id);
  const isReviewer = trustTier === "trusted" || trustTier === "verified";
  const isOwner = await isClaimedOwner(supabase, user.id, contribution.producer_id);
  if (!isReviewer && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = contribution.payload as unknown as ContributionPayload;
  const result = await applyContributionPayload(payload, contribution.contributor_id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contributions")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", params.id)
    .eq("status", "pending")
    .select("id, status, type, contributor_id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Contribution no longer pending (race)." },
      { status: 409 }
    );
  }

  await promoteTrustTier(contribution.contributor_id);

  await emitEvent("contribution.approved", {
    metadata: {
      contributionId: contribution.id,
      type: contribution.type,
      reviewerId: user.id,
      auto: false
    }
  });

  return NextResponse.json({ ok: true, contribution: data });
}
