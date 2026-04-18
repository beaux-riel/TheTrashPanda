import Link from "next/link";
import { notFound } from "next/navigation";

import { TrustBadge } from "@/components/contributions/trust-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ContributionRow,
  ContributionType,
  TrustTier
} from "@/lib/supabase/types";

type ProfileData = {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  trust_tier: TrustTier;
  contribution_count: number;
  first_contribution_at: string | null;
  created_at: string;
  location_label: string | null;
};

type RecentContribution = Pick<
  ContributionRow,
  "id" | "type" | "status" | "created_at" | "producer_id" | "listing_id"
>;

const TYPE_LABELS: Record<ContributionType, string> = {
  profile_create: "Added a neighbour",
  profile_edit: "Edited a profile",
  listing_create: "Posted a listing",
  listing_edit: "Edited a listing",
  availability_update: "Updated availability",
  flag_stale: "Flagged a listing",
  confirm_fresh: "Confirmed fresh"
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function firstLetter(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim();
  return trimmed.length > 0 ? trimmed[0]!.toUpperCase() : "🦝";
}

async function fetchProfileData(id: string): Promise<{
  profile: ProfileData;
  stats: {
    profilesAdded: number;
    listingsPosted: number;
    freshnessVotes: number;
    edits: number;
    total: number;
  };
  recent: RecentContribution[];
} | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, display_name, bio, avatar_url, trust_tier, contribution_count, first_contribution_at, created_at, location_label"
    )
    .eq("id", id)
    .maybeSingle();

  if (!profile) return null;

  const { data: contributions } = await supabase
    .from("contributions")
    .select("id, type, status, created_at, producer_id, listing_id")
    .eq("contributor_id", id)
    .in("status", ["approved", "auto_approved"])
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (contributions ?? []) as RecentContribution[];
  const countBy = (type: ContributionType) => rows.filter((r) => r.type === type).length;

  return {
    profile: profile as ProfileData,
    stats: {
      profilesAdded: countBy("profile_create"),
      listingsPosted: countBy("listing_create"),
      freshnessVotes: countBy("confirm_fresh") + countBy("flag_stale"),
      edits: countBy("profile_edit") + countBy("listing_edit") + countBy("availability_update"),
      total: rows.length
    },
    recent: rows.slice(0, 10)
  };
}

export default async function ContributorProfilePage({ params }: { params: { id: string } }) {
  const data = await fetchProfileData(params.id);

  if (!data) {
    notFound();
  }

  const { profile, stats, recent } = data;
  const displayName = profile.display_name?.trim() || "A neighbour";
  const memberSince = formatDate(profile.created_at);

  return (
    <div className="space-y-6 py-4">
      <Card className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface-strong)] font-display text-5xl text-[var(--forest)] md:h-32 md:w-32 md:text-6xl">
          {firstLetter(profile.display_name)}
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TrustBadge tier={profile.trust_tier} />
            {profile.location_label ? (
              <Badge tone="forest">{profile.location_label}</Badge>
            ) : null}
          </div>
          <h1 className="font-display text-4xl text-[var(--ink)] md:text-5xl">{displayName}</h1>
          {profile.bio ? (
            <p className="max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">{profile.bio}</p>
          ) : null}
          <p className="text-xs text-[var(--ink-soft)]">
            Neighbour since {memberSince}
            {profile.first_contribution_at
              ? ` · first contribution ${formatDate(profile.first_contribution_at)}`
              : ""}
          </p>
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-[var(--ink)]">What they&apos;ve been up to</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Profiles added" value={stats.profilesAdded} />
          <StatCard label="Listings posted" value={stats.listingsPosted} />
          <StatCard label="Freshness votes" value={stats.freshnessVotes} />
          <StatCard label="Edits" value={stats.edits} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-[var(--ink)]">Recent contributions</h2>
        {recent.length === 0 ? (
          <Card>
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              Nothing yet — but every neighbour has to start somewhere.
            </p>
          </Card>
        ) : (
          <Card className="divide-y divide-[color:var(--border)] p-0">
            {recent.map((row) => (
              <RecentRow key={row.id} row={row} />
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{label}</p>
      <p className="mt-2 font-display text-3xl text-[var(--ink)]">{value}</p>
    </div>
  );
}

function RecentRow({ row }: { row: RecentContribution }) {
  const label = TYPE_LABELS[row.type] ?? row.type;
  const when = formatDate(row.created_at);
  const href = row.listing_id
    ? `/listing/${row.listing_id}`
    : row.producer_id
      ? `/producer/${row.producer_id}`
      : null;

  const body = (
    <div className="flex flex-wrap items-center justify-between gap-2 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
        <Badge tone="neutral">{row.status.replace("_", " ")}</Badge>
      </div>
      <span className="text-xs text-[var(--ink-soft)]">{when}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition hover:bg-[var(--surface-strong)]">
        {body}
      </Link>
    );
  }
  return <div>{body}</div>;
}
