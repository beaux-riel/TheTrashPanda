import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    title: "🦝 Test ping from HarvestLink",
    body: "Bandit shook the bell. If you saw this, the notification path is awake."
  });
}
