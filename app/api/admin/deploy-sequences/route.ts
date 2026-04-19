import { NextResponse } from "next/server";

import { getDripCtl } from "@/lib/dripctl/client";
import { sequences } from "@/lib/dripctl/sequences";

type DeployResult =
  | { name: string; ok: true; id: string }
  | { name: string; ok: false; error: string };

export async function POST(request: Request) {
  const adminSecret = process.env.DRIPCTL_ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { error: "DRIPCTL_ADMIN_SECRET is not configured." },
      { status: 503 }
    );
  }

  const provided = request.headers.get("x-admin-secret");
  if (!provided || provided !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dripctl = getDripCtl();
  if (!dripctl) {
    return NextResponse.json(
      { error: "DripCtl is not configured." },
      { status: 503 }
    );
  }

  const results: DeployResult[] = [];
  for (const definition of sequences) {
    try {
      const created = await dripctl.sequences.create({
        name: definition.name,
        trigger: definition.trigger,
        definition: { steps: definition.steps },
        optimize: definition.optimize
      });
      results.push({ name: definition.name, ok: true, id: created.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ name: definition.name, ok: false, error: message });
    }
  }

  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.length - succeeded;

  return NextResponse.json({
    ok: failed === 0,
    succeeded,
    failed,
    results
  });
}
