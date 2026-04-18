import { NextResponse } from "next/server";

import {
  emitContributionEvent,
  getContribution,
  getTrustTier,
  isClaimedOwner
} from "@/lib/supabase/contribution-queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  const { data, error } = await supabase
    .from("contributions")
    .update({
      status: "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", params.id)
    .eq("status", "pending")
    .select("id, status, type")
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

  await emitContributionEvent("contribution.rejected", {
    metadata: {
      contributionId: contribution.id,
      type: contribution.type,
      reviewerId: user.id
    }
  });

  return NextResponse.json({ ok: true, contribution: data });
}
