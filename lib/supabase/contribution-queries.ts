/**
 * Server-side helpers for community contributions.
 *
 * All helpers take an auth-scoped Supabase client (`createServerSupabaseClient()`)
 * so RLS stays in effect. A few writes that cross RLS boundaries — applying a
 * contribution's payload to a listing or producer profile that the caller does
 * not own — fall back to the service-role client.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { logEvent } from "./queries";
import { createServiceSupabaseClient } from "./server";
import type {
  ContributionRow,
  ContributionStatus,
  Database,
  EventType,
  Json,
  ListingRow,
  ProfileRow,
  TrustTier
} from "./types";
import type {
  AvailabilityUpdatePayload,
  ContributionPayload,
  ListingCreatePayload,
  ListingEditPayload,
  ProfileCreatePayload,
  ProfileEditPayload
} from "@/lib/types/contributions";

type HL = SupabaseClient<Database>;

export const KNOWN_CATEGORIES = new Set([
  "Eggs",
  "Produce",
  "Baked Goods",
  "Preserved",
  "Dairy",
  "Meat & Fish",
  "Honey",
  "Plants",
  "Prepared Food",
  "Other"
]);

export const KNOWN_QUANTITIES = new Set(["plenty", "some", "last_few"]);
export const KNOWN_LISTING_STATUSES = new Set(["active", "gone", "expired"]);

// ---------------------------------------------------------------------------
// payload validation
// ---------------------------------------------------------------------------

/**
 * Shallow structural validation on top of the type guards in
 * lib/types/contributions.ts. Returns an error string on failure, or null on
 * success. Does not mutate the payload.
 */
export function validateContributionPayload(payload: ContributionPayload): string | null {
  switch (payload.type) {
    case "profile_create":
      if (!payload.display_name || typeof payload.display_name !== "string") {
        return "display_name is required";
      }
      if (payload.display_name.trim().length > 120) {
        return "display_name must be 120 characters or fewer";
      }
      return null;

    case "profile_edit":
      if (typeof payload.producer_id !== "string") return "producer_id is required";
      if (!payload.changes || typeof payload.changes !== "object") {
        return "changes is required";
      }
      return null;

    case "listing_create":
      if (typeof payload.producer_id !== "string") return "producer_id is required";
      if (!payload.title || typeof payload.title !== "string") return "title is required";
      if (!KNOWN_CATEGORIES.has(payload.category)) {
        return `Unknown category: ${payload.category}`;
      }
      if (!KNOWN_QUANTITIES.has(payload.quantity)) {
        return `Unknown quantity: ${payload.quantity}`;
      }
      return null;

    case "listing_edit":
      if (typeof payload.listing_id !== "string") return "listing_id is required";
      if (!payload.changes || typeof payload.changes !== "object") {
        return "changes is required";
      }
      if (payload.changes.category && !KNOWN_CATEGORIES.has(payload.changes.category)) {
        return `Unknown category: ${payload.changes.category}`;
      }
      if (payload.changes.quantity && !KNOWN_QUANTITIES.has(payload.changes.quantity)) {
        return `Unknown quantity: ${payload.changes.quantity}`;
      }
      return null;

    case "availability_update":
      if (typeof payload.listing_id !== "string") return "listing_id is required";
      if (!KNOWN_LISTING_STATUSES.has(payload.status)) {
        return `Unknown status: ${payload.status}`;
      }
      return null;

    case "flag_stale":
    case "confirm_fresh":
      if (typeof payload.listing_id !== "string") return "listing_id is required";
      return null;

    default:
      return "Unknown contribution type";
  }
}

// ---------------------------------------------------------------------------
// reads
// ---------------------------------------------------------------------------

export async function getContribution(
  supabase: HL,
  id: string
): Promise<ContributionRow | null> {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ContributionRow | null) ?? null;
}

export async function getTrustTier(supabase: HL, userId: string): Promise<TrustTier> {
  const { data } = await supabase
    .from("profiles")
    .select("trust_tier")
    .eq("id", userId)
    .maybeSingle();
  return (data?.trust_tier as TrustTier | undefined) ?? "new";
}

/**
 * True when the caller holds a verified claim on the producer_id.
 * Used to let a claimed-profile owner approve contributions to their own page.
 */
export async function isClaimedOwner(
  supabase: HL,
  userId: string,
  producerId: string | null
): Promise<boolean> {
  if (!producerId) return false;
  const { data } = await supabase
    .from("producer_claims")
    .select("id")
    .eq("producer_id", producerId)
    .eq("claimed_by", userId)
    .maybeSingle();
  return !!data;
}

// ---------------------------------------------------------------------------
// payload application — mutates real tables once a contribution is approved
// ---------------------------------------------------------------------------

type ApplyResult =
  | { ok: true; listing?: ListingRow | null; profile?: ProfileRow | null }
  | { ok: false; error: string };

/**
 * Apply a contribution's payload to the underlying profiles/listings rows.
 * Uses the service-role client so it succeeds regardless of RLS — the caller
 * is expected to have already authorized the write (auto-approve on trust tier,
 * or explicit approval by a Trusted+ reviewer / claimed-profile owner).
 */
export async function applyContributionPayload(
  payload: ContributionPayload,
  contributorId: string
): Promise<ApplyResult> {
  const service = createServiceSupabaseClient();
  if (!service) return { ok: false, error: "Service client unavailable" };

  switch (payload.type) {
    case "profile_create":
      return applyProfileCreate(service, payload, contributorId);
    case "profile_edit":
      return applyProfileEdit(service, payload);
    case "listing_create":
      return applyListingCreate(service, payload, contributorId);
    case "listing_edit":
      return applyListingEdit(service, payload);
    case "availability_update":
      return applyAvailabilityUpdate(service, payload);
    case "confirm_fresh":
      return applyConfirmFresh(service, payload.listing_id);
    case "flag_stale":
      // flag_stale is applied via the freshness-vote pipeline, not here.
      return { ok: true };
  }
}

async function applyProfileCreate(
  supabase: HL,
  payload: ProfileCreatePayload,
  contributorId: string
): Promise<ApplyResult> {
  // Community-maintained profile: the row id points at an auth user that does
  // not exist yet, so we instead leave the row unclaimed and let the producer
  // "claim" it when they sign up. For Phase 1 we only record the contribution;
  // a companion job (outside Phase 2 scope) creates the shell profile row.
  // Record is authoritative in the contributions audit log.
  void supabase;
  void payload;
  void contributorId;
  return { ok: true };
}

async function applyProfileEdit(
  supabase: HL,
  payload: ProfileEditPayload
): Promise<ApplyResult> {
  const update: Record<string, unknown> = { ...payload.changes };
  if (
    (payload.changes.lng != null && payload.changes.lat != null) ||
    (payload.changes.lat != null && payload.changes.lng != null)
  ) {
    update.location = `SRID=4326;POINT(${payload.changes.lng} ${payload.changes.lat})`;
    delete update.lng;
    delete update.lat;
  }
  // Only whitelist known columns to avoid writing unexpected fields.
  const writable: Record<string, unknown> = {};
  for (const key of [
    "display_name",
    "bio",
    "categories",
    "location_label",
    "location",
    "pickup_details",
    "schedule_summary"
  ]) {
    if (key in update) writable[key] = update[key];
  }
  if (Object.keys(writable).length === 0) return { ok: true, profile: null };

  const { data, error } = await supabase
    .from("profiles")
    .update(writable as never)
    .eq("id", payload.producer_id)
    .select("*")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, profile: (data as ProfileRow | null) ?? null };
}

async function applyListingCreate(
  supabase: HL,
  payload: ListingCreatePayload,
  contributorId: string
): Promise<ApplyResult> {
  const row: Record<string, unknown> = {
    producer_id: payload.producer_id,
    title: payload.title.trim(),
    description: payload.description?.trim() ?? null,
    category: payload.category,
    quantity: payload.quantity,
    price_label: payload.price_label?.trim() ?? null,
    location_label: payload.location_label?.trim() ?? null,
    photos: payload.photos ?? [],
    available_until: payload.available_until ?? null,
    contributed_by: contributorId
  };
  if (payload.lng != null && payload.lat != null) {
    row.location = `SRID=4326;POINT(${payload.lng} ${payload.lat})`;
  }

  const { data, error } = await supabase
    .from("listings")
    .insert(row as never)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, listing: data as ListingRow };
}

async function applyListingEdit(
  supabase: HL,
  payload: ListingEditPayload
): Promise<ApplyResult> {
  const update: Record<string, unknown> = { ...payload.changes };
  if (payload.changes.lng != null && payload.changes.lat != null) {
    update.location = `SRID=4326;POINT(${payload.changes.lng} ${payload.changes.lat})`;
    delete update.lng;
    delete update.lat;
  }
  const writable: Record<string, unknown> = {};
  for (const key of [
    "title",
    "description",
    "category",
    "quantity",
    "price_label",
    "location_label",
    "location",
    "photos",
    "available_until"
  ]) {
    if (key in update) writable[key] = update[key];
  }
  if (Object.keys(writable).length === 0) return { ok: true, listing: null };

  const { data, error } = await supabase
    .from("listings")
    .update(writable as never)
    .eq("id", payload.listing_id)
    .select("*")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, listing: (data as ListingRow | null) ?? null };
}

async function applyAvailabilityUpdate(
  supabase: HL,
  payload: AvailabilityUpdatePayload
): Promise<ApplyResult> {
  const update: Record<string, unknown> = { status: payload.status };
  if (payload.quantity) update.quantity = payload.quantity;
  const { data, error } = await supabase
    .from("listings")
    .update(update as never)
    .eq("id", payload.listing_id)
    .select("*")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, listing: (data as ListingRow | null) ?? null };
}

async function applyConfirmFresh(
  supabase: HL,
  listingId: string
): Promise<ApplyResult> {
  const { data, error } = await supabase
    .from("listings")
    .update({ freshness_confirmed_at: new Date().toISOString() })
    .eq("id", listingId)
    .select("*")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, listing: (data as ListingRow | null) ?? null };
}

// ---------------------------------------------------------------------------
// trust tier promotion — fire the SQL function, swallow errors
// ---------------------------------------------------------------------------

export async function promoteTrustTier(userId: string): Promise<void> {
  const service = createServiceSupabaseClient();
  if (!service) return;
  try {
    // The function is defined in migration 005 but not yet in the typed
    // Functions map; cast through unknown so tsc accepts the rpc call.
    const rpc = (service as unknown as { rpc: (name: string, args: Record<string, unknown>) => Promise<{ error: unknown }> }).rpc;
    await rpc.call(service, "promote_trust_tier", { target_user: userId });
  } catch {
    // Promotion failures must never break the request path.
  }
}

// ---------------------------------------------------------------------------
// event emission — thin wrapper so callers don't have to import queries.ts
// ---------------------------------------------------------------------------

export async function emitContributionEvent(
  type: EventType,
  input: { category?: string | null; metadata?: Json } = {}
): Promise<void> {
  await logEvent(type, {
    category: input.category ?? null,
    metadata: input.metadata ?? {}
  });
}

// ---------------------------------------------------------------------------
// Stale-flag application — run when a freshness vote marks a listing stale
// ---------------------------------------------------------------------------

export async function incrementStaleFlag(
  listingId: string
): Promise<{ staleFlagCount: number; markedGone: boolean } | null> {
  const service = createServiceSupabaseClient();
  if (!service) return null;

  const { data: listing } = await service
    .from("listings")
    .select("stale_flag_count, status")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing) return null;

  const nextCount = (listing.stale_flag_count ?? 0) + 1;
  const shouldMarkGone = nextCount >= 3 && listing.status === "active";

  const update: Record<string, unknown> = { stale_flag_count: nextCount };
  if (shouldMarkGone) update.status = "gone";

  const { error } = await service
    .from("listings")
    .update(update as never)
    .eq("id", listingId);
  if (error) return null;

  return { staleFlagCount: nextCount, markedGone: shouldMarkGone };
}

export async function stampFreshnessConfirmed(
  listingId: string,
  options: { resetStaleCount?: boolean } = {}
): Promise<void> {
  const service = createServiceSupabaseClient();
  if (!service) return;
  const update: Record<string, unknown> = {
    freshness_confirmed_at: new Date().toISOString()
  };
  if (options.resetStaleCount) {
    update.stale_flag_count = 0;
  }
  await service
    .from("listings")
    .update(update as never)
    .eq("id", listingId);
}

// Utility for API routes to narrow status strings safely.
export function isReviewableStatus(status: ContributionStatus): boolean {
  return status === "pending";
}

// ---------------------------------------------------------------------------
// revert — best-effort rollback of a previously approved contribution
// ---------------------------------------------------------------------------

type RevertResult =
  | { ok: true; note?: string }
  | { ok: false; error: string };

/**
 * Revert a contribution's effect on the live tables. For create types, the
 * created row is removed if it still exists. For edits and availability
 * updates, we can only reliably flag the audit entry — restoring the prior
 * value would require a pre-change snapshot we don't currently store. Callers
 * should present reverts on create-type contributions as hard rollbacks, and
 * revert on edits as "mark as reverted, follow up with an explicit edit".
 */
export async function revertContributionPayload(
  payload: ContributionPayload,
  links: { producerId: string | null; listingId: string | null }
): Promise<RevertResult> {
  const service = createServiceSupabaseClient();
  if (!service) return { ok: false, error: "Service client unavailable" };

  switch (payload.type) {
    case "listing_create": {
      // Prefer the concrete listing_id recorded on the contribution row, but
      // fall back to the payload's producer_id scope if the column is empty.
      const listingId = links.listingId;
      if (!listingId) {
        return { ok: true, note: "No listing_id recorded; nothing to delete." };
      }
      const { error } = await service.from("listings").delete().eq("id", listingId);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    case "profile_create":
      // Shell profiles are not written inline today; the audit entry alone is
      // authoritative. Marking reverted is sufficient.
      return { ok: true };
    case "profile_edit":
    case "listing_edit":
    case "availability_update":
      // Prior state isn't snapshotted; the UI should encourage an explicit
      // follow-up edit. Audit log will reflect the revert action.
      return { ok: true, note: "Marked as reverted. Field-level rollback requires a manual edit." };
    case "confirm_fresh":
    case "flag_stale":
      return { ok: true };
  }
}
