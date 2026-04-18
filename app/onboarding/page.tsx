"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-provider";
import { categoryPalette, listings, producers } from "@/lib/data/mock";
import {
  LOCATION_SUGGESTIONS,
  filterListings,
  getListingDistanceLabel,
  type UserLocation
} from "@/lib/discovery";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type OnboardingIntent = "consumer" | "producer" | "both";

const ONBOARDING_DRAFT_KEY = "thetrashpanda.onboardingDraft";

type OnboardingDraft = {
  intent: OnboardingIntent | null;
  location: UserLocation | null;
  manualLocation: string;
  producerCategories: string[];
  bio: string;
};

const categoryEmoji: Record<string, string> = {
  Eggs: "🥚",
  Produce: "🥬",
  "Baked Goods": "🍞",
  Preserved: "🫙",
  Dairy: "🥛",
  "Meat & Fish": "🐟",
  Honey: "🍯",
  Plants: "🪴",
  "Prepared Food": "🥘",
  Other: "🧺"
};

export default function OnboardingPage() {
  const allCategories = Object.keys(categoryPalette);
  const router = useRouter();
  const { user, isConfigured, status, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<OnboardingIntent | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [producerCategories, setProducerCategories] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Restore draft on mount (e.g., after the user signs in and comes back).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as OnboardingDraft;
      if (draft.intent) setIntent(draft.intent);
      if (draft.location) setLocation(draft.location);
      if (draft.manualLocation) setManualLocation(draft.manualLocation);
      if (draft.producerCategories?.length) setProducerCategories(draft.producerCategories);
      if (draft.bio) setBio(draft.bio);
    } catch {
      /* ignore corrupt draft */
    }
  }, []);

  // Keep the draft synced so a login round-trip doesn't lose the form.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft: OnboardingDraft = {
      intent,
      location,
      manualLocation,
      producerCategories,
      bio
    };
    window.localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
  }, [intent, location, manualLocation, producerCategories, bio]);

  const previewListings = useMemo(
    () =>
      filterListings(listings, producers, {
        query: "",
        categories: [],
        radiusKm: 10,
        availability: "available",
        price: "all",
        userLocation: location
      }).slice(0, 3),
    [location]
  );

  const isProducerFlow = intent === "producer" || intent === "both";
  const isLastSetupStep = isProducerFlow ? step === 3 : step === 2;

  const persistOnboarding = async (): Promise<boolean> => {
    // Unconfigured Supabase => demo mode; skip save and jump to preview.
    if (!isConfigured) return true;

    if (!user) {
      // Kick the user to login, preserving their place.
      router.push(`/auth/login?next=${encodeURIComponent("/onboarding")}`);
      return false;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) return true;

    setSaving(true);
    setSaveError(null);
    try {
      const update: Record<string, unknown> = {
        is_producer: isProducerFlow,
        bio: bio.trim() || null,
        categories: isProducerFlow ? producerCategories : [],
        location_label: location?.label ?? (manualLocation.trim() || null)
      };
      if (location && Number.isFinite(location.lng) && Number.isFinite(location.lat)) {
        update.location = `SRID=4326;POINT(${location.lng} ${location.lat})`;
      }
      const { error } = await supabase
        .from("profiles")
        .update(update as never)
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't save onboarding.";
      setSaveError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && intent) {
      setStep(2);
      return;
    }

    if (step === 2 && !isProducerFlow && (location || manualLocation.trim())) {
      // Consumer flow: step 2 is the last setup step — persist before the preview.
      void (async () => {
        if (status === "loading") return;
        const ok = await persistOnboarding();
        if (ok) setStep(4);
      })();
      return;
    }

    if (step === 2 && isProducerFlow && (location || manualLocation.trim())) {
      setStep(3);
      return;
    }

    if (step === 3) {
      void (async () => {
        if (status === "loading") return;
        const ok = await persistOnboarding();
        if (ok) setStep(4);
      })();
    }
  };

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your current spot"
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="gold">Onboarding</Badge>
          <h1 className="mt-3 font-display text-5xl text-[var(--ink)]">Let&apos;s get you into the loop</h1>
        </div>
        <p className="text-sm text-[var(--ink-soft)]">Step {step} of {isProducerFlow ? 4 : 3}</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(160deg,rgba(58,90,64,0.18),rgba(218,165,32,0.14),transparent)] p-6">
            <BanditIllustration variant="onboarding" priority className="mx-auto max-w-[240px]" />
            <div className="mt-4 space-y-2 text-center lg:text-left">
              <h2 className="font-display text-3xl text-[var(--ink)]">
                {step === 1 && "What brings you to The Trash Panda?"}
                {step === 2 && "Tell us roughly where you are"}
                {step === 3 && "What kind of stuff do you end up with too much of?"}
                {step === 4 && "You&apos;re in!"}
              </h2>
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                {step === 1 && "Whether you&apos;ve got a garden, a fruit tree, a bread habit, or just an appetite — there&apos;s a spot for you."}
                {step === 2 && "Location keeps the map useful. We only need enough precision to stop sending you across town for one loaf."}
                {step === 3 && "No wrong answers. A single apple tree counts. So does a whole market garden."}
                {step === 4 && "Bandit already peeked around your patch. Here&apos;s what&apos;s nearby."}
              </p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {step === 1 ? (
              <div className="grid gap-3">
                <IntentButton
                  active={intent === "consumer"}
                  title="I want to find local food"
                  body="Browse what your neighbours have — eggs from down the road, bread from around the corner, honey from that guy with all the boxes in his yard."
                  onClick={() => setIntent("consumer")}
                />
                <IntentButton
                  active={intent === "producer"}
                  title="I&apos;ve got more than I need"
                  body="Retirees with plum trees, families drowning in zucchini, anyone with a chest freezer full of salmon and not enough friends. If you&apos;ve got more than you need, you&apos;re already one of us."
                  onClick={() => setIntent("producer")}
                />
                <IntentButton
                  active={intent === "both"}
                  title="Both!"
                  body="Buy a neighbour&apos;s sourdough on Tuesday, list your extra garlic on Wednesday. The food loop works best when everyone&apos;s in it."
                  onClick={() => setIntent("both")}
                />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <Card className="space-y-4 bg-[rgba(255,255,255,0.74)]">
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl text-[var(--ink)]">Location</h3>
                    <p className="text-sm leading-6 text-[var(--ink-soft)]">
                      Let The Trash Panda start around your actual corner of Powell River. No creepy precision. Just enough to keep the route sensible.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={requestLocation}>{locating ? "Checking..." : "Use browser location"}</Button>
                    {location ? <Badge tone="forest">Using {location.label}</Badge> : null}
                  </div>
                </Card>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[var(--ink)]" htmlFor="manual-location">
                    Manual fallback
                  </label>
                  <input
                    id="manual-location"
                    value={manualLocation}
                    onChange={(event) => setManualLocation(event.target.value)}
                    placeholder="Search Powell River area..."
                    className="w-full rounded-[22px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
                  />
                  <div className="flex flex-wrap gap-2">
                    {LOCATION_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        type="button"
                        onClick={() => {
                          setLocation(suggestion);
                          setManualLocation(suggestion.label);
                        }}
                        className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)]"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="font-display text-2xl text-[var(--ink)]">Categories</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {allCategories.map((category) => {
                      const selected = producerCategories.includes(category);

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() =>
                            setProducerCategories((current) =>
                              current.includes(category)
                                ? current.filter((item) => item !== category)
                                : [...current, category]
                            )
                          }
                          className={`flex items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition ${
                            selected
                              ? "border-transparent bg-[var(--accent)] text-[var(--accent-ink)]"
                              : "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)]"
                          }`}
                        >
                          <span className="text-xl">{categoryEmoji[category] ?? "🧺"}</span>
                          <span className="font-semibold">{category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block font-display text-2xl text-[var(--ink)]" htmlFor="bio">
                    Tell us about yourself
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    rows={5}
                    placeholder="Tell people what you've got going on — a backyard garden, a few fruit trees, a sourdough situation that got out of hand. Mention how pickup works (porch cooler? text first?) and whether the dog is friendly..."
                    className="w-full rounded-[24px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
                  />
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Badge tone="accent">Bandit is celebrating</Badge>
                  <h3 className="font-display text-3xl text-[var(--ink)]">Nearby listings preview</h3>
                  <p className="text-sm leading-6 text-[var(--ink-soft)]">
                    Enough setup. Here&apos;s the good part.
                  </p>
                </div>
                <div className="grid gap-3">
                  {previewListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="rounded-[24px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[var(--forest)]">
                            {producers.find((producer) => producer.id === listing.producerId)?.name}
                          </p>
                          <p className="font-display text-2xl text-[var(--ink)]">{listing.title}</p>
                        </div>
                        <Badge tone="gold">{getListingDistanceLabel(listing, location)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/" className={buttonStyles()}>
                    Explore the map
                  </Link>
                  <Link href="/notifications" className={buttonStyles("secondary")}>
                    Set up the pings
                  </Link>
                </div>
              </div>
            ) : null}

            {step < 4 ? (
              <div className="space-y-2">
                {saveError ? (
                  <p className="text-sm text-[color:rgba(217,79,48,0.9)]">
                    {saveError}
                  </p>
                ) : null}
                <div className="flex flex-wrap justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || saving}>
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={saving || (step === 1 && !intent) || (step === 2 && !location && !manualLocation.trim()) || (step === 3 && !producerCategories.length)}
                  >
                    {saving ? "Saving…" : isLastSetupStep ? "You're in" : "Next"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}

function IntentButton({
  active,
  title,
  body,
  onClick
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[28px] border p-5 text-left transition ${
        active
          ? "border-transparent bg-[var(--accent)] text-[var(--accent-ink)] shadow-card"
          : "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)]"
      }`}
    >
      <h3 className="font-display text-2xl">{title}</h3>
      <p className={`mt-2 text-sm leading-6 ${active ? "text-[color:rgba(255,248,244,0.88)]" : "text-[var(--ink-soft)]"}`}>{body}</p>
    </button>
  );
}
