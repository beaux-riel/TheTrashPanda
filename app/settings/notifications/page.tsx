import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { FollowPreferences } from "@/components/notifications/follow-preferences";
import { Card } from "@/components/ui/card";

export default function NotificationSettingsPage() {
  return (
    <div className="grid gap-6 py-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-4">
        <BanditIllustration variant="onboarding" />
        <h1 className="font-display text-4xl text-[var(--ink)]">Tune the pings so they help instead of heckle.</h1>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          Set each follow to immediate, daily digest, or off. Mute the noisy ones without breaking the follow. Email digests stay opt-in and future-facing.
        </p>
      </Card>
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Per-follow preferences</h2>
          <p className="text-sm text-[var(--ink-soft)]">Producer, category, and area follows each get their own rhythm.</p>
        </div>
        <FollowPreferences />
      </div>
    </div>
  );
}
