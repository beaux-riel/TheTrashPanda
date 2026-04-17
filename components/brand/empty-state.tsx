import Link from "next/link";

import { BanditIllustration, type BanditVariant } from "@/components/brand/bandit-illustration";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  body,
  variant = "empty",
  actionHref,
  actionLabel
}: {
  title: string;
  body: string;
  variant?: BanditVariant;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-8 text-center">
      <BanditIllustration variant={variant} className="max-w-[180px]" />
      <div className="space-y-2">
        <h2 className="font-display text-2xl text-[var(--ink)]">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)]">{body}</p>
      </div>
      {actionHref && actionLabel ? <Link className={buttonStyles()} href={actionHref}>{actionLabel}</Link> : null}
    </Card>
  );
}
