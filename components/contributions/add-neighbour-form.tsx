"use client";

import { useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { categoryPalette } from "@/lib/data/mock";
import type { ProfileCreatePayload } from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

import { Modal } from "./modal";

type AddNeighbourFormProps = {
  trustTier?: "new" | "trusted" | "verified";
  triggerClassName?: string;
  triggerLabel?: string;
};

type FormState = {
  name: string;
  bio: string;
  categories: string[];
  locationLabel: string;
  pickupDetails: string;
  scheduleSummary: string;
};

const EMPTY: FormState = {
  name: "",
  bio: "",
  categories: [],
  locationLabel: "",
  pickupDetails: "",
  scheduleSummary: ""
};

export function AddNeighbourForm({
  trustTier = "new",
  triggerClassName,
  triggerLabel = "Know someone who grows, makes, or shares food? Add them →"
}: AddNeighbourFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allCategories = Object.keys(categoryPalette);
  const autoApproved = trustTier === "trusted" || trustTier === "verified";

  const close = () => {
    setOpen(false);
    // Give the closing animation a moment before clearing state.
    window.setTimeout(() => {
      setForm(EMPTY);
      setError(null);
      setSuccess(null);
      setBusy(false);
    }, 200);
  };

  const toggleCategory = (category: string) => {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((c) => c !== category)
        : [...current.categories, category]
    }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("A name helps people find them.");
      return;
    }

    setBusy(true);
    setError(null);

    const payload: ProfileCreatePayload = {
      type: "profile_create",
      display_name: form.name.trim(),
      bio: form.bio.trim() || null,
      categories: form.categories,
      location_label: form.locationLabel.trim() || null,
      pickup_details: form.pickupDetails.trim() || null,
      schedule_summary: form.scheduleSummary.trim() || null
    };

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Couldn't save that one. Try again?");
      }
      setSuccess(
        autoApproved
          ? `Done! ${form.name.trim()} is live.`
          : `Nice! We'll get ${form.name.trim()} added to the map 🦝`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that one.");
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
        title="Add a neighbour"
        subtitle="Someone sharing food who isn't on the map yet? Tell us about them."
      >
        {success ? (
          <div className="space-y-4 text-center">
            <p className="font-display text-2xl text-[var(--ink)]">{success}</p>
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              {autoApproved
                ? "Thanks for spotting them — their profile is ready to go."
                : "A couple of Trusted neighbours will take a quick look before it goes live. Usually within a day."}
            </p>
            <Button onClick={close}>Back to the loop</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <Field label="Their name" htmlFor="neighbour-name">
              <input
                id="neighbour-name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Terra Nostra Farm, Aunt Jen's Bread, the guy with the plum tree…"
                className={inputClass}
                required
              />
            </Field>

            <Field label="What they share" htmlFor="neighbour-bio" hint="A sentence or two is plenty. Write like you're texting a friend.">
              <textarea
                id="neighbour-bio"
                value={form.bio}
                onChange={(event) => setForm({ ...form, bio: event.target.value })}
                rows={4}
                placeholder="Backyard eggs, sourdough on Saturdays, more zucchini than any one household should have…"
                className={textareaClass}
              />
            </Field>

            <Field label="Categories" hint="Pick any that fit.">
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => {
                  const selected = form.categories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
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

            <Field
              label="Neighbourhood"
              htmlFor="neighbour-location"
              hint="Keep it rough — Westview, Townsite, up Myrtle Point way. No exact addresses."
            >
              <input
                id="neighbour-location"
                value={form.locationLabel}
                onChange={(event) => setForm({ ...form, locationLabel: event.target.value })}
                placeholder="Westview, Powell River"
                className={inputClass}
              />
            </Field>

            <Field label="Pickup details" htmlFor="neighbour-pickup">
              <textarea
                id="neighbour-pickup"
                value={form.pickupDetails}
                onChange={(event) => setForm({ ...form, pickupDetails: event.target.value })}
                rows={2}
                placeholder="Porch cooler after 3pm, text first, find them at the Sunday market…"
                className={textareaClass}
              />
            </Field>

            <Field label="Schedule" htmlFor="neighbour-schedule">
              <input
                id="neighbour-schedule"
                value={form.scheduleSummary}
                onChange={(event) => setForm({ ...form, scheduleSummary: event.target.value })}
                placeholder="Sundays · Tuesdays & Thursdays · By arrangement"
                className={inputClass}
              />
            </Field>

            {error ? (
              <p className="text-sm text-[color:rgba(217,79,48,0.95)]">{error}</p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-[var(--ink-soft)]">
                {autoApproved
                  ? "You're Trusted — this goes live immediately."
                  : "New contributors wait for a quick review. Get to 5 approved posts and you skip the queue."}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={close} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? "Saving…" : "Add them"}
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
