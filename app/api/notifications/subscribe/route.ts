import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    message: "Subscription noted. Wire this to Supabase when the real push table is ready.",
    received: Boolean(body?.subscription)
  });
}
