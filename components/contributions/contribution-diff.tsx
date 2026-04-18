import type {
  AvailabilityUpdatePayload,
  ConfirmFreshPayload,
  ContributionPayload,
  FlagStalePayload,
  ListingCreatePayload,
  ListingEditPayload,
  ProfileCreatePayload,
  ProfileEditPayload
} from "@/lib/types/contributions";
import { cn } from "@/lib/utils/cn";

type ContributionDiffProps = {
  payload: ContributionPayload;
  className?: string;
};

export function ContributionDiff({ payload, className }: ContributionDiffProps) {
  return (
    <div className={cn("space-y-2 text-sm", className)}>
      {renderPayload(payload)}
    </div>
  );
}

function renderPayload(payload: ContributionPayload): React.ReactNode {
  switch (payload.type) {
    case "profile_create":
      return <ProfileCreateDiff payload={payload} />;
    case "profile_edit":
      return <ProfileEditDiff payload={payload} />;
    case "listing_create":
      return <ListingCreateDiff payload={payload} />;
    case "listing_edit":
      return <ListingEditDiff payload={payload} />;
    case "availability_update":
      return <AvailabilityDiff payload={payload} />;
    case "confirm_fresh":
      return <FreshnessDiff payload={payload} kind="confirm" />;
    case "flag_stale":
      return <FreshnessDiff payload={payload} kind="stale" />;
  }
}

// ---------------------------------------------------------------------------
// create-type diffs: every field shown as an "addition"
// ---------------------------------------------------------------------------

function ProfileCreateDiff({ payload }: { payload: ProfileCreatePayload }) {
  const rows: [string, string | null | undefined][] = [
    ["Display name", payload.display_name],
    ["Bio", payload.bio ?? null],
    ["Categories", payload.categories?.join(", ") ?? null],
    ["Neighbourhood", payload.location_label ?? null],
    ["Pickup details", payload.pickup_details ?? null],
    ["Schedule", payload.schedule_summary ?? null]
  ];
  return <AddedRows rows={rows} emptyLabel="No fields provided." />;
}

function ListingCreateDiff({ payload }: { payload: ListingCreatePayload }) {
  const rows: [string, string | null | undefined][] = [
    ["Title", payload.title],
    ["Description", payload.description ?? null],
    ["Category", payload.category],
    ["Quantity", formatQuantity(payload.quantity)],
    ["Price", payload.price_label ?? null],
    ["Pickup", payload.location_label ?? null],
    ["Available until", payload.available_until ?? null]
  ];
  return <AddedRows rows={rows} emptyLabel="No listing fields provided." />;
}

// ---------------------------------------------------------------------------
// edit-type diffs: show field names with change markers
// ---------------------------------------------------------------------------

function ProfileEditDiff({ payload }: { payload: ProfileEditPayload }) {
  const entries = Object.entries(payload.changes ?? {}) as [string, unknown][];
  if (entries.length === 0) {
    return <EmptyNote>No changes recorded.</EmptyNote>;
  }
  return <ChangedRows entries={entries} />;
}

function ListingEditDiff({ payload }: { payload: ListingEditPayload }) {
  const entries = Object.entries(payload.changes ?? {}) as [string, unknown][];
  if (entries.length === 0) {
    return <EmptyNote>No changes recorded.</EmptyNote>;
  }
  return <ChangedRows entries={entries} />;
}

// ---------------------------------------------------------------------------
// availability + freshness diffs: single-line summaries
// ---------------------------------------------------------------------------

function AvailabilityDiff({ payload }: { payload: AvailabilityUpdatePayload }) {
  return (
    <div className="space-y-2">
      <Line tone="added">
        <Label>Status</Label>
        <Value>{payload.status}</Value>
      </Line>
      {payload.quantity ? (
        <Line tone="added">
          <Label>Quantity</Label>
          <Value>{formatQuantity(payload.quantity)}</Value>
        </Line>
      ) : null}
      {payload.note ? (
        <Line tone="neutral">
          <Label>Note</Label>
          <Value>{payload.note}</Value>
        </Line>
      ) : null}
    </div>
  );
}

function FreshnessDiff({
  payload,
  kind
}: {
  payload: ConfirmFreshPayload | FlagStalePayload;
  kind: "confirm" | "stale";
}) {
  const description =
    kind === "confirm"
      ? "Confirmed this listing is still fresh."
      : "Flagged this listing as possibly stale.";
  const reason = kind === "stale" ? (payload as FlagStalePayload).reason : null;
  return (
    <div className="space-y-2">
      <Line tone={kind === "confirm" ? "added" : "removed"}>
        <Value>{description}</Value>
      </Line>
      {reason ? (
        <Line tone="neutral">
          <Label>Reason</Label>
          <Value>{reason}</Value>
        </Line>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// shared row helpers
// ---------------------------------------------------------------------------

function AddedRows({
  rows,
  emptyLabel
}: {
  rows: [string, string | null | undefined][];
  emptyLabel: string;
}) {
  const filled = rows.filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (filled.length === 0) {
    return <EmptyNote>{emptyLabel}</EmptyNote>;
  }
  return (
    <div className="space-y-2">
      {filled.map(([label, value]) => (
        <Line key={label} tone="added">
          <Label>{label}</Label>
          <Value>{value}</Value>
        </Line>
      ))}
    </div>
  );
}

function ChangedRows({ entries }: { entries: [string, unknown][] }) {
  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => (
        <Line key={key} tone="added">
          <Label>{humanizeKey(key)}</Label>
          <Value>{stringifyValue(value)}</Value>
        </Line>
      ))}
      <p className="pt-1 text-xs italic text-[var(--ink-soft)]">
        Showing proposed values. Prior values aren&apos;t snapshotted in this view.
      </p>
    </div>
  );
}

function Line({
  tone,
  children
}: {
  tone: "added" | "removed" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border px-3 py-2",
        tone === "added" && "border-[#bbf7d0] bg-[#dcfce7] text-[var(--ink)]",
        tone === "removed" && "border-[#fecaca] bg-[#fee2e2] text-[var(--ink)]",
        tone === "neutral" && "border-[color:var(--border)] bg-[var(--surface-strong)] text-[var(--ink)]"
      )}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
      {children}
    </span>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium leading-5">{children}</span>;
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-[color:var(--border)] px-3 py-2 text-xs italic text-[var(--ink-soft)]">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// formatting helpers
// ---------------------------------------------------------------------------

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\blabel\b/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function formatQuantity(q: string): string {
  switch (q) {
    case "plenty":
      return "Plenty";
    case "some":
      return "Some";
    case "last_few":
      return "Last few";
    default:
      return q;
  }
}
