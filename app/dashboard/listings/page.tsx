import { ListingManager } from "@/components/dashboard/listing-manager";

export default function DashboardListingsPage() {
  return (
    <div className="space-y-4 py-4">
      <div>
        <h1 className="font-display text-4xl text-[var(--ink)]">Listing management</h1>
        <p className="text-sm text-[var(--ink-soft)]">Edit, expire, repost, or give something the quick “gone!” it deserves.</p>
      </div>
      <ListingManager />
    </div>
  );
}
