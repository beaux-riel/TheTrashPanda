import { NextResponse } from "next/server";

import { rateLimitResponse, reportLimiter } from "@/lib/middleware/rate-limit";
import { emitContributionEvent } from "@/lib/supabase/contribution-queries";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";
import type { ReportRow, ReportTargetType } from "@/lib/supabase/types";

const TARGET_TYPES: ReportTargetType[] = ["profile", "listing", "contribution"];
const MAX_REASON_LENGTH = 500;
const AUTO_HIDE_THRESHOLD = 3;

type ReportInput = {
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
};

function parseReport(body: unknown): ReportInput | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.target_type !== "string") return null;
  if (!TARGET_TYPES.includes(record.target_type as ReportTargetType)) return null;
  if (typeof record.target_id !== "string" || !record.target_id) return null;
  if (typeof record.reason !== "string" || !record.reason.trim()) return null;
  const reason = record.reason.trim().slice(0, MAX_REASON_LENGTH);
  return {
    target_type: record.target_type as ReportTargetType,
    target_id: record.target_id,
    reason
  };
}

async function targetExists(
  service: NonNullable<ReturnType<typeof createServiceSupabaseClient>>,
  target: ReportInput
): Promise<boolean> {
  switch (target.target_type) {
    case "profile": {
      const { data } = await service.from("profiles").select("id").eq("id", target.target_id).maybeSingle();
      return !!data;
    }
    case "listing": {
      const { data } = await service.from("listings").select("id").eq("id", target.target_id).maybeSingle();
      return !!data;
    }
    case "contribution": {
      const { data } = await service.from("contributions").select("id").eq("id", target.target_id).maybeSingle();
      return !!data;
    }
  }
}

async function autoHideIfNeeded(
  service: NonNullable<ReturnType<typeof createServiceSupabaseClient>>,
  target: ReportInput
): Promise<{ hidden: boolean; openCount: number }> {
  const { count } = await service
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("target_type", target.target_type)
    .eq("target_id", target.target_id)
    .eq("status", "open");

  const openCount = count ?? 0;
  if (openCount < AUTO_HIDE_THRESHOLD) {
    return { hidden: false, openCount };
  }

  if (target.target_type === "listing") {
    await service
      .from("listings")
      .update({ status: "gone" } as never)
      .eq("id", target.target_id);
    return { hidden: true, openCount };
  }

  if (target.target_type === "profile") {
    await service
      .from("profiles")
      .update({ is_producer: false } as never)
      .eq("id", target.target_id);
    return { hidden: true, openCount };
  }

  return { hidden: false, openCount };
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

  const limit = reportLimiter(user.id);
  if (limit.limited) {
    return rateLimitResponse(limit);
  }

  const body = await request.json().catch(() => null);
  const parsed = parseReport(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid report payload." }, { status: 422 });
  }

  const service = createServiceSupabaseClient();
  if (!service) {
    return NextResponse.json({ error: "Service client unavailable." }, { status: 503 });
  }

  const exists = await targetExists(service, parsed);
  if (!exists) {
    return NextResponse.json({ error: "That thing doesn't exist." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      target_type: parsed.target_type,
      target_id: parsed.target_id,
      reason: parsed.reason
    })
    .select("*")
    .single();

  if (error || !data) {
    const pgCode = (error as { code?: string } | null)?.code;
    if (pgCode === "23505") {
      return NextResponse.json(
        { ok: true, alreadyReported: true },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: error?.message ?? "Couldn't file that report." },
      { status: 400 }
    );
  }

  const report = data as ReportRow;
  const hide = await autoHideIfNeeded(service, parsed);

  await emitContributionEvent("contribution.reverted", {
    metadata: {
      kind: "report.created",
      reportId: report.id,
      reporterId: user.id,
      targetType: report.target_type,
      targetId: report.target_id,
      openCount: hide.openCount,
      autoHidden: hide.hidden
    }
  });

  return NextResponse.json({
    ok: true,
    report: {
      id: report.id,
      target_type: report.target_type,
      target_id: report.target_id,
      status: report.status,
      created_at: report.created_at
    },
    autoHidden: hide.hidden
  });
}
