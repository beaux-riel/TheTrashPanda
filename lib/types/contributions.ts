// Client-side types for contribution payloads.
// These describe the shapes the UI sends to /api/contributions; the server
// validates and stores them in the `contributions.payload` JSONB column.

import type {
  ClaimVerificationMethod,
  ContributionStatus,
  ContributionType,
  ListingStatus,
  Quantity,
  TrustTier
} from "@/lib/supabase/types";

export type {
  ClaimVerificationMethod,
  ContributionStatus,
  ContributionType,
  TrustTier
};

export type ProfileCreatePayload = {
  type: "profile_create";
  display_name: string;
  bio?: string | null;
  categories?: string[];
  location_label?: string | null;
  lat?: number | null;
  lng?: number | null;
  pickup_details?: string | null;
  schedule_summary?: string | null;
};

export type ProfileEditPayload = {
  type: "profile_edit";
  producer_id: string;
  changes: Partial<{
    display_name: string;
    bio: string | null;
    categories: string[];
    location_label: string | null;
    lat: number | null;
    lng: number | null;
    pickup_details: string | null;
    schedule_summary: string | null;
  }>;
};

export type ListingCreatePayload = {
  type: "listing_create";
  producer_id: string;
  title: string;
  description?: string | null;
  category: string;
  quantity: Quantity;
  price_label?: string | null;
  location_label?: string | null;
  lat?: number | null;
  lng?: number | null;
  photos?: string[];
  available_until?: string | null;
};

export type ListingEditPayload = {
  type: "listing_edit";
  listing_id: string;
  changes: Partial<{
    title: string;
    description: string | null;
    category: string;
    quantity: Quantity;
    price_label: string | null;
    location_label: string | null;
    lat: number | null;
    lng: number | null;
    photos: string[];
    available_until: string | null;
  }>;
};

export type AvailabilityUpdatePayload = {
  type: "availability_update";
  listing_id: string;
  status: ListingStatus;
  quantity?: Quantity;
  note?: string | null;
};

export type FlagStalePayload = {
  type: "flag_stale";
  listing_id: string;
  reason?: string | null;
};

export type ConfirmFreshPayload = {
  type: "confirm_fresh";
  listing_id: string;
};

export type ContributionPayload =
  | ProfileCreatePayload
  | ProfileEditPayload
  | ListingCreatePayload
  | ListingEditPayload
  | AvailabilityUpdatePayload
  | FlagStalePayload
  | ConfirmFreshPayload;

export type ContributionResponse = {
  id: string;
  status: ContributionStatus;
  type: ContributionType;
  created_at: string;
};

export type FreshnessVotePayload = {
  listing_id: string;
  is_fresh: boolean;
};

export type FreshnessSummary = {
  listing_id: string;
  fresh_count: number;
  stale_count: number;
  last_confirmed_at: string | null;
  viewer_vote: boolean | null;
};

export type ClaimPayload = {
  producer_id: string;
  verification_method: ClaimVerificationMethod;
  contact?: string;
};

// Type guards

export function isProfileCreate(p: ContributionPayload): p is ProfileCreatePayload {
  return p.type === "profile_create";
}

export function isProfileEdit(p: ContributionPayload): p is ProfileEditPayload {
  return p.type === "profile_edit";
}

export function isListingCreate(p: ContributionPayload): p is ListingCreatePayload {
  return p.type === "listing_create";
}

export function isListingEdit(p: ContributionPayload): p is ListingEditPayload {
  return p.type === "listing_edit";
}

export function isAvailabilityUpdate(
  p: ContributionPayload
): p is AvailabilityUpdatePayload {
  return p.type === "availability_update";
}

export function isFlagStale(p: ContributionPayload): p is FlagStalePayload {
  return p.type === "flag_stale";
}

export function isConfirmFresh(p: ContributionPayload): p is ConfirmFreshPayload {
  return p.type === "confirm_fresh";
}
