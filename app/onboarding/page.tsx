"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryPalette, listings, producers } from "@/lib/data/mock";
import {
  LOCATION_SUGGESTIONS,
  filterListings,
  getListingDistanceLabel,
  type UserLocation
} from "@/lib/discovery";

type OnboardingIntent = "consumer" | "producer" | "both";

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
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<OnboardingIntent | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [producerCategories, setProducerCategories] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [locating, setLocating] = useState(false);

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

  const nextStep = () => {
    if (step === 1 && intent) {
      setStep(2);
      return;
    }

    if (step === 2 && (!isProducerFlow || location || manualLocation.trim())) {
      setStep(isProducerFlow ? 3 : 4);
      return;
    }

    if (step === 3) {
      setStep(4);
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
                {step === 1 && "What brings you to HarvestLink?"}
                {step === 2 && "Tell us roughly where you are"}
                {step === 3 && "What do you grow, make, or sell?"}
                {step === 4 && "You&apos;re in!"}
              </h2>
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                {step === 1 && "If you want local food, have local food, or contain multitudes, there&apos;s a button for that."}
                {step === 2 && "Location keeps the map useful. We only need enough precision to stop sending you across town for one loaf."}
                {step === 3 && "Pick the stuff you tend, bake, bottle, or otherwise convince into being edible."}
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
                  body="Keep it simple: browse nearby eggs, bread, honey, and whatever your neighbours just remembered to post."
                  onClick={() => setIntent("consumer")}
                />
                <IntentButton
                  active={intent === "producer"}
                  title="I have food to share"
                  body="Perfect. Post what you&apos;ve got before your tomatoes start judging you from the counter."
                  onClick={() => setIntent("producer")}
                />
                <IntentButton
                  active={intent === "both"}
                  title="Both!"
                  body="Excellent. Double agent energy. You can buy a loaf and list seedlings in the same afternoon."
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
                      Let HarvestLink start around your actual corner of Powell River. No creepy precision. Just enough to keep the route sensible.
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
                    placeholder="A few warm details. What you grow, what you bake, what your pickup setup looks like, whether the dog is friendly..."
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
              <div className="flex flex-wrap justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={(step === 1 && !intent) || (step === 2 && !location && !manualLocation.trim()) || (step === 3 && !producerCategories.length)}
                >
                  {isLastSetupStep ? "You&apos;re in" : "Next"}
                </Button>
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
