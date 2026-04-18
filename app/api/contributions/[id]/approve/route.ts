import { NextResponse } from "next/server";

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

  const { data: reviewer } = await supabase
    .from("profiles")
    .select("trust_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (!reviewer || (reviewer.trust_tier !== "trusted" && reviewer.trust_tier !== "verified")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    .select("id, status, type")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Contribution not found or not pending." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, contribution: data });
}
