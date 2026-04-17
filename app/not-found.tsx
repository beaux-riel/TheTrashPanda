import Link from "next/link";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center py-12">
      <div className="max-w-xl space-y-5 text-center">
        <div className="mx-auto max-w-[280px]">
          <BanditIllustration variant="not-found" priority />
        </div>
        <h1 className="font-display text-5xl text-[var(--ink)]">Bandit looked everywhere.</h1>
        <p className="text-lg leading-8 text-[var(--ink-soft)]">
          This page is emptier than the produce aisle at Save-On after a ferry cancellation. Even raccoons know when to turn back.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className={buttonStyles()} href="/">
            Back to the map-ish home
          </Link>
          <Link className={buttonStyles("secondary")} href="/notifications">
            Open the bell instead
          </Link>
        </div>
      </div>
    </div>
  );
}
