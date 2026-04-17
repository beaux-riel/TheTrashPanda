import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { FollowerRoster } from "@/components/dashboard/follower-roster";
import { ListingManager } from "@/components/dashboard/listing-manager";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ScheduleEditor } from "@/components/dashboard/schedule-editor";

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-4">
      <OverviewCards />
      <ListingManager />
      <FollowerRoster />
      <AnalyticsPanel />
      <ScheduleEditor />
    </div>
  );
}
