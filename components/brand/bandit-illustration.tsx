"use client";

import Image from "next/image";

import { cn } from "@/lib/utils/cn";

export type BanditVariant =
  // UI states
  | "loading"
  | "empty"
  | "error"
  | "onboarding"
  | "not-found"
  // Seasons
  | "spring"
  | "summer"
  | "fall"
  | "winter"
  // Time of day
  | "dawn-coffee"
  | "morning-garden"
  | "bread-morning"
  | "midday-market"
  | "afternoon-nap"
  | "evening-cooking"
  | "night-prowl"
  // Weather
  | "rain-boots"
  | "rain-heavy"
  | "sunny-bright"
  | "cloudy-cozy"
  | "windy-chaos"
  | "snow-cozy"
  | "fog-mysterious"
  | "storm-dramatic"
  // Special
  | "ferry-waiting";

/** Map each variant to actual WebP file. Falls back gracefully. */
const variantImage: Record<BanditVariant, string> = {
  // UI states → reuse best fits
  loading: "hero-tomato.webp",
  empty: "night-prowl.webp",
  error: "street.webp",
  onboarding: "family.webp",
  "not-found": "night-prowl.webp",
  // Seasons
  spring: "spring.webp",
  summer: "summer.webp",
  fall: "fall.webp",
  winter: "winter.webp",
  // Time of day
  "dawn-coffee": "dawn-coffee.webp",
  "morning-garden": "morning-garden.webp",
  "bread-morning": "bread-morning.webp",
  "midday-market": "midday-market.webp",
  "afternoon-nap": "afternoon-nap.webp",
  "evening-cooking": "evening-cooking.webp",
  "night-prowl": "night-prowl.webp",
  // Weather
  "rain-boots": "rain-boots.webp",
  "rain-heavy": "rain-heavy.webp",
  "sunny-bright": "sunny-bright.webp",
  "cloudy-cozy": "cloudy-cozy.webp",
  "windy-chaos": "windy-chaos.webp",
  "snow-cozy": "snow-cozy.webp",
  "fog-mysterious": "fog-mysterious.webp",
  "storm-dramatic": "storm-dramatic.webp",
  // Special
  "ferry-waiting": "ferry-waiting.webp",
};

const altText: Record<BanditVariant, string> = {
  loading: "Bandit the raccoon holding a tomato while the app loads",
  empty: "Bandit prowling through an empty moonlit garden",
  error: "Bandit caught red-handed in street art style",
  onboarding: "Bandit and the baby raccoons raiding a garden",
  "not-found": "Bandit prowling through an empty moonlit garden",
  spring: "Bandit in rain boots with seedlings",
  summer: "Bandit lounging on watermelons with sunglasses",
  fall: "Bandit hauling a pumpkin through autumn leaves",
  winter: "Bandit in a beanie holding preserved goods",
  "dawn-coffee": "Bandit yawning with a steaming coffee mug at dawn",
  "morning-garden": "Bandit picking vegetables in the morning garden",
  "bread-morning": "Bandit carrying a fresh baguette at sunrise",
  "midday-market": "Bandit running a rustic farm stand at midday",
  "afternoon-nap": "Bandit napping in a hammock on a lazy afternoon",
  "evening-cooking": "Bandit stirring a pot over a fire at dusk",
  "night-prowl": "Bandit prowling through the garden under moonlight",
  "rain-boots": "Bandit splashing through puddles in yellow rain boots",
  "rain-heavy": "Bandit sheltering under an awning watching heavy rain",
  "sunny-bright": "Bandit lounging in bright sunshine with sunglasses",
  "cloudy-cozy": "Bandit in a knit sweater on an overcast day",
  "windy-chaos": "Bandit leaning into wind with produce flying everywhere",
  "snow-cozy": "Bandit building a veggie snowman in falling snow",
  "fog-mysterious": "Bandit emerging from coastal fog with a lantern",
  "storm-dramatic": "Bandit standing heroically against a stormy sky",
  "ferry-waiting": "Bandit sitting on a dock watching the BC ferry",
};

/** Season-based fallback for when weather/time images don't exist yet */
function getFallbackVariant(variant: BanditVariant): BanditVariant {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

export function BanditIllustration({
  variant,
  className,
  priority = false,
}: {
  variant: BanditVariant;
  className?: string;
  priority?: boolean;
}) {
  const imageName = variantImage[variant] ?? variantImage[getFallbackVariant(variant)];

  return (
    <div className={cn("relative aspect-square w-full max-w-[320px]", className)}>
      <Image
        src={`/images/bandit/${imageName}`}
        alt={altText[variant] ?? "Bandit the raccoon"}
        fill
        className="object-contain"
        priority={priority}
        sizes="(max-width: 768px) 60vw, 320px"
        onError={(e) => {
          // Fall back to seasonal image if weather/time variant doesn't exist
          const fallback = variantImage[getFallbackVariant(variant)];
          if (imageName !== fallback) {
            (e.target as HTMLImageElement).src = `/images/bandit/${fallback}`;
          }
        }}
      />
    </div>
  );
}
