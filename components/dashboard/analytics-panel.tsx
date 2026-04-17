import { Card } from "@/components/ui/card";
import { engagementMoments, viewTrend } from "@/lib/data/mock";

export function AnalyticsPanel() {
  const peakDay = viewTrend.reduce((highest, point) => (point.value > highest.value ? point : highest), viewTrend[0]);
  const peakMoment = engagementMoments.reduce((highest, point) => (point.value > highest.value ? point : highest), engagementMoments[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Simple analytics, not MBA cosplay</h2>
          <p className="text-sm text-[var(--ink-soft)]">
            Your eggs are the local celebrity right now. Peak eyeballs hit on {peakDay.label} and spike around {peakMoment.label}.
          </p>
        </div>
        <div className="space-y-3">
          {viewTrend.map((point) => (
            <div key={point.label} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
              <span className="text-sm font-semibold text-[var(--ink-soft)]">{point.label}</span>
              <div className="h-3 rounded-full bg-[var(--surface-strong)]">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--honey))]"
                  style={{ width: `${Math.max(12, point.value)}%` }}
                />
              </div>
              <span className="text-right text-sm font-semibold text-[var(--ink)]">{point.value}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4">
        <h3 className="font-display text-2xl text-[var(--ink)]">Bandit&apos;s read on it</h3>
        <ul className="space-y-3 text-sm leading-6 text-[var(--ink-soft)]">
          <li>Post before 9am if you want the breakfast crowd to pounce.</li>
          <li>Seedlings get saved more than they get viewed. Gardeners are commitment-phobic until payday.</li>
          <li>If things feel slow, share your profile link instead of posting the same listing five times like a trash panda with a megaphone.</li>
        </ul>
      </Card>
    </div>
  );
}
