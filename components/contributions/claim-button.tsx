"use client";

import { useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import type { ClaimVerificationMethod } from "@/lib/supabase/types";
import type { ClaimPayload } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

import { Modal } from "./modal";

type ClaimButtonProps = {
  producerId: string;
  producerName: string;
  triggerLabel?: string;
  triggerClassName?: string;
  variant?: "primary" | "secondary" | "ghost";
};

const METHOD_OPTIONS: { value: ClaimVerificationMethod; label: string; hint: string }[] = [
  {
    value: "email",
    label: "Email me a code",
    hint: "Quickest way — we'll send a code to the email on file."
  },
  {
    value: "phone",
    label: "Text me a code",
    hint: "Good if you check texts faster than email."
  },
  {
    value: "in_person",
    label: "Verify in person",
    hint: "A Trusted neighbour will say hi at the market or on your next pickup."
  }
];

export function ClaimButton({
  producerId,
  producerName,
  triggerLabel = "This is me",
  triggerClassName,
  variant = "primary"
}: ClaimButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonStyles(variant), triggerClassName)}
      >
        {triggerLabel}
      </button>
      <ClaimModal
        open={open}
        onClose={() => setOpen(false)}
        producerId={producerId}
        producerName={producerName}
      />
    </>
  );
}

type ClaimModalProps = {
  open: boolean;
  onClose: () => void;
  producerId: string;
  producerName: string;
};

export function ClaimModal({ open, onClose, producerId, producerName }: ClaimModalProps) {
  const [method, setMethod] = useState<ClaimVerificationMethod>("email");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const close = () => {
    onClose();
    window.setTimeout(() => {
      setMethod("email");
      setContact("");
      setError(null);
      setSuccess(false);
      setBusy(false);
    }, 200);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        throw new Error(body?.error ?? "Couldn't start the claim.");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start the claim.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={`Claim ${producerName}`}
      subtitle="Take over this profile so you can post updates yourself. We just need to make sure it's really you."
    >
      {success ? (
        <div className="space-y-4 text-center">
          <p className="font-display text-2xl text-[var(--ink)]">Welcome home! Your profile is now yours to manage. 🦝</p>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            We&apos;ll follow up on verification shortly. In the meantime, you can start managing the profile from your dashboard.
          </p>
          <Button onClick={close}>Back to profile</Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--ink)]">How should we verify?</p>
            <div className="grid gap-2">
              {METHOD_OPTIONS.map((option) => {
                const selected = method === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMethod(option.value)}
                    className={cn(
                      "rounded-[22px] border px-4 py-3 text-left transition",
                      selected
                        ? "border-transparent bg-[var(--accent)] text-[var(--accent-ink)] shadow-card"
                        : "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                    )}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs leading-5",
                        selected ? "text-[color:rgba(255,248,244,0.88)]" : "text-[var(--ink-soft)]"
                      )}
                    >
                      {option.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {method !== "in_person" ? (
            <div className="space-y-1.5">
              <label htmlFor="claim-contact" className="block text-sm font-semibold text-[var(--ink)]">
                {method === "email" ? "Email address" : "Phone number"}
              </label>
              <input
                id="claim-contact"
                type={method === "email" ? "email" : "tel"}
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder={method === "email" ? "you@example.com" : "(604) 555-0199"}
                className="w-full rounded-[20px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2.5 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] focus-visible:border-[var(--accent)]"
              />
              <p className="text-xs text-[var(--ink-soft)]">
                Optional for now — Phase 1 just notes your preferred channel.
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-[color:rgba(217,79,48,0.95)]">{error}</p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Start the claim"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
