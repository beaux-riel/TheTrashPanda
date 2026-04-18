import { NextResponse } from "next/server";

import { getCommunityStats } from "@/lib/events/community-stats";

export async function GET() {
  const stats = await getCommunityStats(7);
  return NextResponse.json({ stats });
}
