"use client";

import Link from "next/link";
import { useState } from "react";

import { PostClaimGuide } from "@/components/contributions/post-claim-guide";
import { buttonStyles } from "@/components/ui/button";
import type { ClaimVerificationMethod } from "@/lib/supabase/types";
import type { ClaimPayload } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

type Step = "welcome" | "method" | "contact" | "verify" | "success";

type MethodOption = {
  value: ClaimVerificationMethod;
  label: string;
  hint: string;
  icon: string;
};

const METHODS: MethodOption[] = [
  {
    value: "email",
    label: "Email me a code",
    hint: "Quickest way — we'll send a code to an email you control.",
    icon: "✉️"
  },
  {
    value: "phone",
    label: "Text me a code",
    hint: "Good if you check texts faster than email.",
    icon: "📱"
  },
  {
    value: "in_person",
    label: "Verify in person",
    hint: "A Trusted neighbour will say hi at the market or on pickup.",
    icon: "🤝"
  }
];

type ClaimWizardProps = {
  producerId: string;
  producerName: string;
};

export function ClaimWizard({ producerId, producerName }: ClaimWizardProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [method, setMethod] = useState<ClaimVerificationMethod>("email");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitClaim() {
    setBusy(true);
    setError(null);

    const payload: ClaimPayload = {
      producer_id: producerId,
      verification_method: method,
      contact: contact.trim() || undefined
    };

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "We couldn't complete the claim.");
      }
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't complete the claim.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <StepIndicator step={step} />

      {step === "welcome" ? (
        <WelcomeStep
          producerName={producerName}
          onNext={() => setStep("method")}
        />
      ) : null}

      {step === "method" ? (
        <MethodStep
          method={method}
          onPick={setMethod}
          onBack={() => setStep("welcome")}
          onNext={() => {
            if (method === "in_person") {
              void submitClaim();
              setStep("verify");
            } else {
              setStep("contact");
            }
          }}
        />
      ) : null}

      {step === "contact" ? (
        <ContactStep
          method={method}
          contact={contact}
          onContactChange={setContact}
          onBack={() => setStep("method")}
          busy={busy}
          error={error}
          onSubmit={() => {
            void submitClaim();
            setStep("verify");
          }}
        />
      ) : null}

      {step === "verify" ? (
        <VerifyStep
          method={method}
          contact={contact}
          busy={busy}
          error={error}
          onRetry={() => void submitClaim()}
          onBack={() => setStep(method === "in_person" ? "method" : "contact")}
        />
      ) : null}

      {step === "success" ? (
        <SuccessStep producerId={producerId} />
      ) : null}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "welcome", label: "Welcome" },
    { key: "method", label: "Method" },
    { key: "contact", label: "Contact" },
    { key: "verify", label: "Verify" }
  ];
  const activeIndex = steps.findIndex((s) => s.key === step);
  if (step === "success") {
    return null;
  }
  return (
    <ol className="flex items-center justify-center gap-2 text-xs text-[var(--ink-soft)]">
      {steps.map((s, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold",
                active && "border-transparent bg-[var(--accent)] text-[var(--accent-ink)]",
                done && "border-transparent bg-[var(--forest)] text-white",
                !active && !done && "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink-soft)]"
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            <span className={cn(active && "font-semibold text-[var(--ink)]")}>{s.label}</span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="text-[var(--ink-soft)]/50">
                →
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-[28px] border border-[color:var(--border)] bg-[var(--page)] p-6 shadow-card sm:p-8">
      {children}
    </section>
  );
}

function WelcomeStep({ producerName, onNext }: { producerName: string; onNext: () => void }) {
  return (
    <StepCard>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Claim this profile
        </p>
        <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
          Take ownership of your profile on The Trash Panda
        </h1>
        <p className="text-base leading-7 text-[var(--ink-soft)]">
          <span className="font-semibold text-[var(--ink)]">{producerName}</span> has been
          kept up-to-date by your neighbours. Claim it and the profile becomes yours —
          you&apos;ll be able to post your own listings, update the bio and schedule, and
          review any changes neighbours suggest.
        </p>
      </div>
      <ul className="space-y-2 text-sm leading-6 text-[var(--ink-soft)]">
        <li className="flex items-start gap-2">
          <span aria-hidden="true">🔒</span>
          <span>Verified status — a little badge that says this is really you.</span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden="true">✏️</span>
          <span>Full editing rights over the profile and every listing.</span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden="true">🦝</span>
          <span>Bandit will stop nagging about this being &ldquo;community-maintained.&rdquo;</span>
        </li>
      </ul>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonStyles("primary")} onClick={onNext}>
          Let&apos;s do it →
        </button>
        <Link className={buttonStyles("ghost")} href={`/producer/${producerName.toLowerCase().replace(/\s+/g, "-")}`}>
          Back to the profile
        </Link>
      </div>
    </StepCard>
  );
}

function MethodStep({
  method,
  onPick,
  onBack,
  onNext
}: {
  method: ClaimVerificationMethod;
  onPick: (m: ClaimVerificationMethod) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <StepCard>
      <div className="space-y-2">
        <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
          How should we verify?
        </h2>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          Pick the one that&apos;s easiest for you. We&apos;ll use it to make sure the
          profile really is yours.
        </p>
      </div>
      <div className="grid gap-3">
        {METHODS.map((option) => {
          const selected = option.value === method;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onPick(option.value)}
              className={cn(
                "flex items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition",
                selected
                  ? "border-transparent bg-[var(--accent)] text-[var(--accent-ink)] shadow-card"
                  : "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
              )}
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                {option.icon}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{option.label}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs leading-5",
                    selected ? "text-[color:rgba(255,248,244,0.88)]" : "text-[var(--ink-soft)]"
                  )}
                >
                  {option.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-between gap-2">
        <button type="button" className={buttonStyles("ghost")} onClick={onBack}>
          ← Back
        </button>
        <button type="button" className={buttonStyles("primary")} onClick={onNext}>
          Continue →
        </button>
      </div>
    </StepCard>
  );
}

function ContactStep({
  method,
  contact,
  onContactChange,
  onBack,
  onSubmit,
  busy,
  error
}: {
  method: ClaimVerificationMethod;
  contact: string;
  onContactChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  busy: boolean;
  error: string | null;
}) {
  const isEmail = method === "email";
  const label = isEmail ? "Email address" : "Phone number";
  const placeholder = isEmail ? "you@example.com" : "(604) 555-0199";
  const type = isEmail ? "email" : "tel";

  return (
    <StepCard>
      <div className="space-y-2">
        <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
          Where should we send the code?
        </h2>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          We&apos;ll send a one-time code to confirm it&apos;s you.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="claim-contact" className="block text-sm font-semibold text-[var(--ink)]">
            {label}
          </label>
          <input
            id="claim-contact"
            type={type}
            value={contact}
            onChange={(event) => onContactChange(event.target.value)}
            placeholder={placeholder}
            required
            className="w-full rounded-[20px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] focus-visible:border-[var(--accent)]"
          />
        </div>
        {error ? (
          <p className="text-sm text-[color:rgba(217,79,48,0.95)]">{error}</p>
        ) : null}
        <div className="flex flex-wrap justify-between gap-2">
          <button type="button" className={buttonStyles("ghost")} onClick={onBack} disabled={busy}>
            ← Back
          </button>
          <button type="submit" className={buttonStyles("primary")} disabled={busy || !contact.trim()}>
            {busy ? "Sending…" : "Send me a code →"}
          </button>
        </div>
      </form>
    </StepCard>
  );
}

function VerifyStep({
  method,
  contact,
  busy,
  error,
  onRetry,
  onBack
}: {
  method: ClaimVerificationMethod;
  contact: string;
  busy: boolean;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
}) {
  const destination = method === "email" ? "your email" : method === "phone" ? "your phone" : "a Trusted neighbour";
  return (
    <StepCard>
      <div className="space-y-2">
        <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
          {busy ? "Verifying…" : "Almost done"}
        </h2>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          {method === "in_person"
            ? "We've noted your request. A Trusted neighbour will confirm in person soon."
            : `We sent a code to ${contact || destination}. For this early phase we're auto-verifying right away — no code entry needed.`}
        </p>
      </div>
      {error ? (
        <div className="space-y-3 rounded-[20px] bg-[color:rgba(217,79,48,0.08)] p-4 text-sm text-[color:rgba(217,79,48,0.95)]">
          <p>{error}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonStyles("secondary")} onClick={onRetry}>
              Try again
            </button>
            <button type="button" className={buttonStyles("ghost")} onClick={onBack}>
              ← Back
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--ink-soft)]">
          <span aria-hidden="true" className="mr-2">
            🦝
          </span>
          Hang tight for a moment — Bandit&apos;s double-checking the records.
        </div>
      )}
    </StepCard>
  );
}

function SuccessStep({ producerId }: { producerId: string }) {
  return (
    <section className="space-y-6">
      <div className="space-y-3 rounded-[28px] border border-[color:var(--border)] bg-[var(--surface)] p-6 text-center shadow-card sm:p-8">
        <p className="text-4xl" aria-hidden="true">
          🦝
        </p>
        <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
          Welcome home! Your profile is yours now.
        </h1>
        <p className="mx-auto max-w-lg text-base leading-7 text-[var(--ink-soft)]">
          You&apos;re a Verified neighbour. The community-maintained badge is gone and
          you&apos;ve got full control over the profile and its listings.
        </p>
      </div>
      <PostClaimGuide producerId={producerId} />
    </section>
  );
}
