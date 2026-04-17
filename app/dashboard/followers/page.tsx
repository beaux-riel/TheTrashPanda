import { followerPreview, producers } from "@/lib/data/mock";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function DashboardFollowersPage() {
  const producer = producers[0];

  return (
    <div className="space-y-4 py-4">
      <div>
        <h1 className="font-display text-4xl text-[var(--ink)]">Follower list</h1>
        <p className="text-sm text-[var(--ink-soft)]">
          {producer.followerCount} neighbours follow {producer.name}. Names only. No email addresses, no creepy stuff, no exceptions.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {followerPreview.map((follower) => (
          <Card key={follower.id} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-2xl text-[var(--ink)]">{follower.name}</h2>
              <Badge tone="neutral">Display name</Badge>
            </div>
            <p className="text-sm leading-6 text-[var(--ink-soft)]">{follower.note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
