import { NextResponse } from "next/server";

import { getDripCtl } from "@/lib/dripctl/client";
import { sequences } from "@/lib/dripctl/sequences";

type DeployResult =
  | { name: string; ok: true; id: string }
  | { name: string; ok: false; error: string };

/**
 * Normalize SDK builder step shapes to match the DripCtl API contract.
 *
 * The SDK v0.2.1 builders produce:
 *   send → { type, name, options: { template, subject } }
 *   wait → { type, duration }
 *
 * But the API expects:
 *   send → { type, name, template, subject }
 *   wait → { type, delay }
 *
 * This shim bridges the gap until the SDK is patched.
 */
/* eslint-disable */
function normalizeStep(step: any): any {
  if (step.type === "send" && step.options) {
    const { options, ...rest } = step;
    return { ...rest, ...options };
  }
  if (step.type === "wait" && step.duration && !step.delay) {
    const { duration, ...rest } = step;
    const delay = (duration as string).replace(/^(\d+)d$/, "$1 days");
    return { ...rest, delay };
  }
  if (step.type === "condition" && step.branches) {
    const yes = Array.isArray(step.branches.yes)
      ? step.branches.yes.map(normalizeStep)
      : normalizeStep(step.branches.yes);
    const no = Array.isArray(step.branches.no)
      ? step.branches.no.map(normalizeStep)
      : normalizeStep(step.branches.no);
    return { ...step, branches: { yes, no } };
  }
  return step;
}
/* eslint-enable */

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
      const normalizedSteps = definition.steps.map(normalizeStep);
      const created = await dripctl.sequences.create({
        name: definition.name,
        trigger: definition.trigger,
        definition: { steps: normalizedSteps },
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
