import { getCommunityStats, isEmptyStats } from "@/lib/events/community-stats";

type StatCell = {
  icon: string;
  value: number;
  label: string;
};

export async function CommunityStats() {
  const stats = await getCommunityStats(7);
  if (isEmptyStats(stats)) return null;

  const cells: StatCell[] = [
    { icon: "✍️", value: stats.contributions, label: "contributions this week" },
    { icon: "🌱", value: stats.profiles_added, label: "neighbours added" },
    { icon: "🥬", value: stats.freshness_votes, label: "freshness votes" },
    { icon: "🦝", value: stats.claims, label: "profiles claimed" }
  ].filter((cell) => cell.value > 0);

  if (cells.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.55)] p-5 shadow-card sm:rounded-[28px] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--forest)]">
            Community activity
          </p>
          <h2 className="font-display text-xl text-[var(--ink)] sm:text-2xl">
            What your neighbours have been up to
          </h2>
        </div>
        <p className="text-xs text-[var(--ink-soft)]">Last 7 days</p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-4 sm:gap-4">
        {cells.map((cell) => (
          <StatCellView key={cell.label} {...cell} />
        ))}
      </dl>
    </section>
  );
}

function StatCellView({ icon, value, label }: StatCell) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface)] p-3 sm:rounded-[22px] sm:p-4">
      <span aria-hidden="true" className="text-2xl leading-none sm:text-3xl">
        {icon}
      </span>
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)] sm:text-xs">
          {label}
        </dt>
        <dd className="font-display text-xl text-[var(--ink)] sm:text-2xl">
          {value.toLocaleString()}
        </dd>
      </div>
    </div>
  );
}
