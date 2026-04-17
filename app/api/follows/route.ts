import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toggleFollow, type ToggleFollowTarget } from "@/lib/supabase/queries";

function parseTarget(body: unknown): ToggleFollowTarget | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const type = record.type;
  if (type === "producer" && typeof record.producerId === "string") {
    return { type, producerId: record.producerId };
  }
  if (type === "category" && typeof record.category === "string") {
    return { type, category: record.category };
  }
  if (type === "area") {
    const { areaLng, areaLat, radiusKm } = record;
    if (
      typeof areaLng === "number" &&
      typeof areaLat === "number" &&
      typeof radiusKm === "number"
    ) {
      return { type, areaLng, areaLat, radiusKm };
    }
  }
  return null;
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
  const target = parseTarget(body);
  if (!target) {
    return NextResponse.json({ error: "Invalid follow target." }, { status: 400 });
  }

  try {
    const result = await toggleFollow(user.id, target, supabase);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to toggle follow.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
