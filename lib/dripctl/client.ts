/**
 * DripCtl client singleton.
 *
 * Server-side only. Returns null when env vars aren't configured so local dev
 * and preview environments can run without a DripCtl account — the event
 * pipeline treats a null client as a no-op.
 */

import { DripCtl } from "@dripctl/sdk";

let cachedClient: DripCtl | null | undefined;

export function getDripCtl(): DripCtl | null {
  if (cachedClient !== undefined) return cachedClient;

  const apiKey = process.env.DRIPCTL_API_KEY;
  const tenantId = process.env.DRIPCTL_TENANT_ID;

  if (!apiKey || !tenantId) {
    cachedClient = null;
    return null;
  }

  cachedClient = new DripCtl({
    apiKey,
    tenantId,
    baseUrl: process.env.DRIPCTL_BASE_URL ?? "https://api.dripctl.dev"
  });
  return cachedClient;
}
