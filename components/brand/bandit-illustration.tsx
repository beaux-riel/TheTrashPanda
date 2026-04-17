import Image from "next/image";

import { cn } from "@/lib/utils/cn";

export type BanditVariant =
  | "loading"
  | "empty"
  | "error"
  | "onboarding"
  | "not-found"
  | "spring"
  | "summer"
  | "fall"
  | "winter";

const altText: Record<BanditVariant, string> = {
  loading: "Bandit the raccoon rummaging through a harvest basket while the app loads",
  empty: "Bandit the raccoon shrugging beside an empty market stall",
  error: "Bandit the raccoon looking guilty beside a tipped trash can",
  onboarding: "Bandit the raccoon waving beside a Powell River garden map",
  "not-found": "Bandit the raccoon peering into an empty basket, confused",
  spring: "Bandit the raccoon in rain boots with seedlings for spring",
  summer: "Bandit the raccoon in sunglasses with summer berries",
  fall: "Bandit the raccoon holding a rake and autumn squash",
  winter: "Bandit the raccoon in a tiny toque with jars and root vegetables"
};

export function BanditIllustration({
  variant,
  className,
  priority = false
}: {
  variant: BanditVariant;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[240px]", className)}>
      <Image
        src={`/bandit/${variant}.svg`}
        alt={altText[variant]}
        fill
        priority={priority}
        sizes="(max-width: 768px) 40vw, 240px"
      />
    </div>
  );
}
