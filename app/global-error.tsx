"use client";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[#F5F0E8] px-6">
        <div className="max-w-xl space-y-5 text-center">
          <div className="mx-auto max-w-[220px]">
            <BanditIllustration variant="error" priority />
          </div>
          <h1 className="font-display text-5xl text-[#2D2A26]">Everything fell out of the basket.</h1>
          <p className="text-lg leading-8 text-[#5F564D]">
            Real all-hands-on-deck energy here. Hit reset and we&apos;ll try to get Bandit back out of the wiring.
          </p>
          <Button onClick={reset}>Reset the page</Button>
        </div>
      </body>
    </html>
  );
}
