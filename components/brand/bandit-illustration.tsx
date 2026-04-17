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

/** Map each variant to the actual WebP filename in /images/bandit/ */
const variantImage: Record<BanditVariant, string> = {
  loading: "hero-tomato.webp",
  empty: "night-prowl.webp",
  error: "street.webp",
  onboarding: "family.webp",
  "not-found": "night-prowl.webp",
  spring: "spring.webp",
  summer: "summer.webp",
  fall: "fall.webp",
  winter: "winter.webp",
};

const altText: Record<BanditVariant, string> = {
  loading: "Bandit the raccoon holding a tomato like a trophy while the app loads",
  empty: "Bandit the raccoon prowling through an empty moonlit garden",
  error: "Bandit the raccoon caught red-handed in street art style",
  onboarding: "Bandit and the baby raccoons raiding a garden together",
  "not-found": "Bandit the raccoon prowling through an empty moonlit garden",
  spring: "Bandit the raccoon in rain boots with seedlings, ink splash style",
  summer: "Bandit the raccoon lounging on watermelons with sunglasses",
  fall: "Bandit the raccoon hauling an oversized pumpkin through autumn leaves",
  winter: "Bandit the raccoon in a beanie and scarf holding preserved goods",
};

export function BanditIllustration({
  variant,
  className,
  priority = false,
}: {
  variant: BanditVariant;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[320px]", className)}>
      <Image
        src={`/images/bandit/${variantImage[variant]}`}
        alt={altText[variant]}
        fill
        className="object-contain"
        priority={priority}
        sizes="(max-width: 768px) 60vw, 320px"
      />
    </div>
  );
}
