"use client";

import { useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { categoryPalette } from "@/lib/data/mock";
import type { Quantity } from "@/lib/supabase/types";
import type { ListingCreatePayload } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

import { Modal } from "./modal";

type AddListingFormProps = {
  producerId: string;
  producerName: string;
  defaultCategory?: string;
  trustTier?: "new" | "trusted" | "verified";
  triggerClassName?: string;
  triggerLabel?: string;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  quantity: Quantity;
  priceLabel: string;
  availableUntil: string;
  locationLabel: string;
};

const QUANTITY_OPTIONS: { value: Quantity; label: string; hint: string }[] = [
  { value: "plenty", label: "Plenty", hint: "Plenty to go around" },
  { value: "some", label: "Some", hint: "Some left" },
  { value: "last_few", label: "Last few", hint: "Moving fast" }
];

export function AddListingForm({
  producerId,
  producerName,
  defaultCategory,
  trustTier = "new",
  triggerClassName,
  triggerLabel = "Post what they have got"
}: AddListingFormProps) {
  const allCategories = Object.keys(categoryPalette);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: defaultCategory ?? allCategories[0] ?? "Produce",
    quantity: "some",
    priceLabel: "",
    availableUntil: "",
    locationLabel: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const autoApproved = trustTier === "trusted" || trustTier === "verified";

  const close = () => {
    setOpen(false);
    window.setTimeout(() => {
      setForm({
        title: "",
        description: "",
        category: defaultCategory ?? allCategories[0] ?? "Produce",
        quantity: "some",
        priceLabel: "",
        availableUntil: "",
        locationLabel: ""
      });
      setError(null);
      setSuccess(null);
      setBusy(false);
    }, 200);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Tell us what they've got.");
      return;
    }

    setBusy(true);
    setError(null);

    const payload: ListingCreatePayload = {
      type: "listing_create",
      producer_id: producerId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      quantity: form.quantity,
      price_label: form.priceLabel.trim() || null,
      location_label: form.locationLabel.trim() || null,
      available_until: form.availableUntil.trim() || null
    };

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Couldn't post that one. Try again?");
      }
      setSuccess(
        autoApproved
          ? "Posted! It's live on the feed."
          : `Nice spot — we'll get this up on ${producerName}'s profile once a Trusted neighbour takes a look.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post that one.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonStyles("primary"), triggerClassName)}
      >
        {triggerLabel}
      </button>

      <Modal
        open={open}
        onClose={close}
        title={`Post what ${producerName} has got`}
        subtitle="Spotted fresh stock? Give the feed a heads-up on their behalf."
      >
        {success ? (
          <div className="space-y-4 text-center">
            <p className="font-display text-2xl text-[var(--ink)]">{success}</p>
            <Button onClick={close}>Back to the loop</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <Field label="What is it" htmlFor="listing-title">
              <input
                id="listing-title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Fresh brown eggs, sourdough loaves, a wall of zucchini…"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Tell people about it" htmlFor="listing-description">
              <textarea
                id="listing-description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={3}
                placeholder="Picked this morning, still warm from the oven, the kind of thing that makes Tuesdays worth it…"
                className={textareaClass}
              />
            </Field>

            <Field label="Category">
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => {
                  const selected = form.category === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setForm({ ...form, category })}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                        selected
                          ? "border-transparent bg-[var(--accent)] text-[var(--accent-ink)]"
                          : "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="How much is there">
              <div className="grid gap-2 sm:grid-cols-3">
                {QUANTITY_OPTIONS.map((option) => {
                  const selected = form.quantity === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm({ ...form, quantity: option.value })}
                      className={cn(
                        "rounded-[20px] border px-3 py-2.5 text-left transition",
                        selected
                          ? "border-transparent bg-[var(--forest)] text-white"
                          : "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                      )}
                    >
                      <p className="font-semibold">{option.label}</p>
                      <p
                        className={cn(
                          "text-xs",
                          selected ? "text-white/80" : "text-[var(--ink-soft)]"
                        )}
                      >
                        {option.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price hint" htmlFor="listing-price" hint="$5/dozen, by donation, free for neighbours…">
                <input
                  id="listing-price"
                  value={form.priceLabel}
                  onChange={(event) => setForm({ ...form, priceLabel: event.target.value })}
                  placeholder="$5/bag"
                  className={inputClass}
                />
              </Field>
              <Field label="Available until" htmlFor="listing-until" hint="Sunday, while they last, June 15…">
                <input
                  id="listing-until"
                  value={form.availableUntil}
                  onChange={(event) => setForm({ ...form, availableUntil: event.target.value })}
                  placeholder="Sunday"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Where to grab it"
              htmlFor="listing-location"
              hint="Porch cooler, farm store, at the market — stay neighbourhood-level."
            >
              <input
                id="listing-location"
                value={form.locationLabel}
                onChange={(event) => setForm({ ...form, locationLabel: event.target.value })}
                placeholder="Farmers' Market"
                className={inputClass}
              />
            </Field>

            {error ? (
              <p className="text-sm text-[color:rgba(217,79,48,0.95)]">{error}</p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-[var(--ink-soft)]">
                Posting on behalf of <span className="font-semibold text-[var(--ink)]">{producerName}</span>.
                {autoApproved ? " Live immediately." : " Queued for a quick review."}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={close} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? "Posting…" : "Post it"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

const inputClass =
  "w-full rounded-[20px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2.5 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] focus-visible:border-[var(--accent)]";

const textareaClass =
  "w-full rounded-[20px] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2.5 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] focus-visible:border-[var(--accent)]";

function Field({
  label,
  htmlFor,
  hint,
  children
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[var(--ink)]">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs leading-5 text-[var(--ink-soft)]">{hint}</p> : null}
    </div>
  );
}
