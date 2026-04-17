import type { Listing, Producer } from "@/lib/data/mock";

export function createProducerNotificationCopy(producer: Producer, listing: Listing) {
  return {
    title: `${producer.name} just listed ${listing.title}`,
    body: `${listing.distanceLabel}. ${listing.quantity === "last_few" ? "Last few, so hustle." : "Worth a detour if your bag's empty."}`
  };
}

export function createCategoryNotificationCopy(category: string, listing: Listing, producer: Producer) {
  return {
    title: `${category} watch: ${producer.name} has you covered`,
    body: `${listing.title} popped up ${listing.distanceLabel}. Powell River breakfast planning just improved.`
  };
}

export function createDigestCopy(count: number) {
  return {
    title: `Daily roundup: ${count} fresh neighbourhood leads`,
    body: "Bandit did the rummaging so you don't have to. Pop in and see what's fresh."
  };
}
