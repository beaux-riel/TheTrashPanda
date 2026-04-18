import { ReviewQueue } from "./review-queue";

export const metadata = {
  title: "Review queue · The Trash Panda",
  description: "Trusted neighbours approve or reject pending community contributions."
};

export default function ReviewQueuePage() {
  return (
    <div className="space-y-4 py-4">
      <header>
        <h1 className="font-display text-4xl text-[var(--ink)]">Review queue</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Pending community contributions. Trusted and Verified neighbours can approve or send
          things back.
        </p>
      </header>
      <ReviewQueue />
    </div>
  );
}
