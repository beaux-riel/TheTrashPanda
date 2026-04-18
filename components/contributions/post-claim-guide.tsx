import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

type PostClaimGuideProps = {
  producerId: string;
};

const CHECKLIST = [
  {
    title: "Update your bio",
    hint: "Tell folks who you are, what you grow, where you're at.",
    href: (producerId: string) => `/profile/edit?producerId=${producerId}`
  },
  {
    title: "Add your schedule",
    hint: "Pickup hours, market days, or \"text me anytime.\"",
    href: (producerId: string) => `/profile/edit?producerId=${producerId}#schedule`
  },
  {
    title: "Post what you've got right now",
    hint: "The fresher, the better — a listing today beats ten drafts.",
    href: () => `/listings/new`
  }
];

export function PostClaimGuide({ producerId }: PostClaimGuideProps) {
  return (
    <div className="space-y-5 rounded-[28px] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-card">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Quick start
        </p>
        <h3 className="font-display text-2xl text-[var(--ink)]">
          Your neighbours have been keeping your profile updated. Now it&apos;s your turn.
        </h3>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          A few small things to make the page feel like yours:
        </p>
      </div>

      <ol className="space-y-3">
        {CHECKLIST.map((item, index) => (
          <li
            key={item.title}
            className="flex items-start gap-3 rounded-[20px] bg-[var(--page)] p-4"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]"
            >
              {index + 1}
            </span>
            <div className="flex-1 space-y-1">
              <Link
                href={item.href(producerId)}
                className="block font-semibold text-[var(--ink)] hover:underline"
              >
                {item.title} →
              </Link>
              <p className="text-xs leading-5 text-[var(--ink-soft)]">{item.hint}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2 pt-1">
        <Link className={buttonStyles("primary")} href={`/producer/${producerId}`}>
          View my profile
        </Link>
        <Link className={buttonStyles("secondary")} href="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
