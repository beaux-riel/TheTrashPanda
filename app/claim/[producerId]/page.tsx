import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PostClaimGuide } from "@/components/contributions/post-claim-guide";
import { buttonStyles } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { ClaimWizard } from "./claim-wizard";

export const metadata = {
  title: "Claim your profile",
  description: "Take ownership of your profile on The Trash Panda."
};

export default async function ClaimPage({
  params
}: {
  params: { producerId: string };
}) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-xl space-y-3 py-10 text-center">
        <h1 className="font-display text-2xl text-[var(--ink)]">
          Claiming isn&apos;t available right now
        </h1>
        <p className="text-sm text-[var(--ink-soft)]">
          The database isn&apos;t configured in this environment.
        </p>
      </div>
    );
  }

  const redirectTarget = `/claim/${params.producerId}`;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(redirectTarget)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, is_producer, is_community_maintained")
    .eq("id", params.producerId)
    .maybeSingle();

  if (!profile || !profile.is_producer) {
    notFound();
  }

  // Already claimed? Check whether the current user is the claimant — show a
  // different state depending on who they are.
  const { data: existingClaim } = await supabase
    .from("producer_claims")
    .select("id, claimed_by, verified_at")
    .eq("producer_id", params.producerId)
    .maybeSingle();

  if (existingClaim) {
    const isClaimant = existingClaim.claimed_by === user.id;
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-8 sm:py-12">
        <section className="space-y-3 rounded-[28px] border border-[color:var(--border)] bg-[var(--surface)] p-6 text-center shadow-card sm:p-8">
          <p className="text-4xl" aria-hidden="true">
            {isClaimant ? "🦝" : "✅"}
          </p>
          <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
            {isClaimant ? "You already claimed this profile." : "This profile is already verified."}
          </h1>
          <p className="mx-auto max-w-lg text-base leading-7 text-[var(--ink-soft)]">
            {isClaimant
              ? "Pick up where you left off."
              : "Someone else has already claimed it — you can still follow along and post community updates."}
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Link
              className={buttonStyles("primary")}
              href={`/producer/${params.producerId}`}
            >
              View profile
            </Link>
            <Link className={buttonStyles("ghost")} href="/producers">
              See all neighbours
            </Link>
          </div>
        </section>
        {isClaimant ? <PostClaimGuide producerId={params.producerId} /> : null}
      </div>
    );
  }

  // Profile exists but isn't community-maintained — probably already owned in a
  // legacy (pre-contributions) way. Surface a friendly redirect.
  if (!profile.is_community_maintained) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-8 text-center sm:py-12">
        <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
          This profile isn&apos;t community-maintained.
        </h1>
        <p className="mx-auto max-w-lg text-base leading-7 text-[var(--ink-soft)]">
          Someone already runs it directly. If that&apos;s you and you&apos;re locked
          out, drop Bandit a line and we&apos;ll sort it.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link className={buttonStyles("primary")} href={`/producer/${params.producerId}`}>
            View profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <ClaimWizard
        producerId={params.producerId}
        producerName={profile.display_name ?? "this profile"}
      />
    </div>
  );
}
