import { getSeasonFromDate, type Season } from "@/lib/utils/season";

export type NotificationFrequency = "immediate" | "daily" | "off";
export type FollowType = "producer" | "category" | "area";
export type PermissionState = NotificationPermission | "unsupported";

export type Producer = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  categories: string[];
  locationLabel: string;
  pickupDetails: string;
  scheduleSummary: string;
  followerCount: number;
  activeListingIds: string[];
};

export type Listing = {
  id: string;
  producerId: string;
  title: string;
  category: string;
  quantity: "plenty" | "some" | "last_few";
  priceLabel: string;
  distanceLabel: string;
  postedLabel: string;
  locationLabel: string;
  views: number;
  status: "active" | "gone" | "expired";
  description: string;
  availableUntil: string;
};

export type Follow = {
  id: string;
  type: FollowType;
  label: string;
  producerId?: string;
  category?: string;
  areaLabel?: string;
  radiusKm?: number;
  frequency: NotificationFrequency;
  muted: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  unread: boolean;
  kind: "producer" | "category" | "area" | "system";
};

export type FollowerPreview = {
  id: string;
  name: string;
  note: string;
};

export type ScheduleSlot = {
  day: string;
  label: string;
  open: boolean;
};

export type AnalyticsPoint = {
  label: string;
  value: number;
};

export type CommunitySnapshot = {
  community: string;
  activeListings: number;
  followedProducers: number;
  watchedCategories: number;
  season: Season;
};

export const categoryPalette: Record<string, string> = {
  Eggs: "#F4D87A",
  Produce: "#7EB36F",
  "Baked Goods": "#C98A54",
  Honey: "#DAA520",
  Plants: "#5D8C62",
  Other: "#8B6F5B"
};

export const producers: Producer[] = [
  {
    id: "producer-cedar-bloom",
    slug: "cedar-bloom",
    name: "Cedar Bloom Homestead",
    bio: "Eggs, greens, and a suspicious amount of dill from the upper end of Cranberry.",
    categories: ["Eggs", "Produce", "Plants"],
    locationLabel: "Cranberry, Powell River",
    pickupDetails: "Porch cooler by the red gate. If Bandit beats you there, be polite.",
    scheduleSummary: "Tue, Thu, Sat · 8am to noon",
    followerCount: 24,
    activeListingIds: ["listing-eggs", "listing-kale", "listing-seedlings"]
  },
  {
    id: "producer-sunshine-oven",
    slug: "sunshine-oven",
    name: "Sunshine Oven",
    bio: "Small-batch bread near Willingdon Beach. Sourdough first, gossip second.",
    categories: ["Baked Goods"],
    locationLabel: "Willingdon Beach, Powell River",
    pickupDetails: "Saturday table by the blue van.",
    scheduleSummary: "Wed to Sat · 7am to 1pm",
    followerCount: 31,
    activeListingIds: ["listing-sourdough"]
  },
  {
    id: "producer-tidewater",
    slug: "tidewater-honey",
    name: "Tidewater Honey",
    bio: "Wildflower honey and beeswax things from just past the ferry lineups.",
    categories: ["Honey", "Other"],
    locationLabel: "Townsite, Powell River",
    pickupDetails: "Text the gate bell and give the bees a respectful wave.",
    scheduleSummary: "Fri & Sat · 10am to 4pm",
    followerCount: 16,
    activeListingIds: ["listing-honey"]
  }
];

export const listings: Listing[] = [
  {
    id: "listing-eggs",
    producerId: "producer-cedar-bloom",
    title: "Farm fresh eggs",
    category: "Eggs",
    quantity: "plenty",
    priceLabel: "$6 / dozen",
    distanceLabel: "900m away",
    postedLabel: "posted 28 minutes ago",
    locationLabel: "Cranberry pickup porch",
    views: 47,
    status: "active",
    description: "Brown and blue eggs. Neighbours keep calling them the fancy breakfast marbles.",
    availableUntil: "Sunday at 5pm"
  },
  {
    id: "listing-kale",
    producerId: "producer-cedar-bloom",
    title: "Curly kale bundles",
    category: "Produce",
    quantity: "some",
    priceLabel: "Honour system jar",
    distanceLabel: "900m away",
    postedLabel: "posted 2 hours ago",
    locationLabel: "Cranberry pickup porch",
    views: 19,
    status: "active",
    description: "Still crisp, still not winning any popularity contests with children.",
    availableUntil: "Tomorrow at 6pm"
  },
  {
    id: "listing-seedlings",
    producerId: "producer-cedar-bloom",
    title: "Tomato seedlings",
    category: "Plants",
    quantity: "last_few",
    priceLabel: "$4 each",
    distanceLabel: "900m away",
    postedLabel: "posted yesterday",
    locationLabel: "Cranberry pickup porch",
    views: 36,
    status: "active",
    description: "Sturdy little things. Already plotting world domination from their trays.",
    availableUntil: "Saturday at noon"
  },
  {
    id: "listing-sourdough",
    producerId: "producer-sunshine-oven",
    title: "Crackly sourdough loaves",
    category: "Baked Goods",
    quantity: "some",
    priceLabel: "$8 loaf",
    distanceLabel: "2.3km away",
    postedLabel: "posted 45 minutes ago",
    locationLabel: "Willingdon Beach table",
    views: 58,
    status: "active",
    description: "Still warm if the ferry gods are kind and the oven behaved.",
    availableUntil: "Today at 3pm"
  },
  {
    id: "listing-honey",
    producerId: "producer-tidewater",
    title: "Spring wildflower honey",
    category: "Honey",
    quantity: "last_few",
    priceLabel: "$14 jar",
    distanceLabel: "3.1km away",
    postedLabel: "posted today",
    locationLabel: "Townsite garden gate",
    views: 41,
    status: "active",
    description: "Sunny, floral, and absolutely not for the impatient tea stirrer.",
    availableUntil: "Monday at 4pm"
  }
];

export const initialFollows: Follow[] = [
  {
    id: "follow-1",
    type: "producer",
    label: "Sunshine Oven",
    producerId: "producer-sunshine-oven",
    frequency: "immediate",
    muted: false
  },
  {
    id: "follow-2",
    type: "category",
    label: "Eggs",
    category: "Eggs",
    frequency: "daily",
    muted: false
  },
  {
    id: "follow-3",
    type: "area",
    label: "Watch Willingdon Beach",
    areaLabel: "Willingdon Beach",
    radiusKm: 2,
    frequency: "immediate",
    muted: true
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "🦝 Sunshine Oven just posted crackly sourdough",
    body: "Willingdon Beach is smelling smug again. There are still a few loaves left.",
    href: "/listing/listing-sourdough",
    createdAt: "7 minutes ago",
    unread: true,
    kind: "producer"
  },
  {
    id: "notif-2",
    title: "Egg watch: Cedar Bloom has fresh dozens up",
    body: "Farm fresh eggs landed 900m away. Breakfast is trying to flirt with you.",
    href: "/listing/listing-eggs",
    createdAt: "32 minutes ago",
    unread: true,
    kind: "category"
  },
  {
    id: "notif-3",
    title: "Loop check near Willingdon Beach",
    body: "A new bread listing popped inside your watched patch. Nice catch.",
    href: "/producer/sunshine-oven",
    createdAt: "Today at 8:02am",
    unread: false,
    kind: "area"
  }
];

export const followerPreview: FollowerPreview[] = [
  { id: "f-1", name: "Maya", note: "Immediate pings for eggs, always." },
  { id: "f-2", name: "Rob", note: "Daily digest. Lives down by the mill." },
  { id: "f-3", name: "Jen", note: "Follows produce and porch pickup posts." },
  { id: "f-4", name: "Sam", note: "Muted for now, still checking your feed." },
  { id: "f-5", name: "Ivy", note: "Shows up every Saturday with exact change." },
  { id: "f-6", name: "Derek", note: "Mostly here for seedlings and neighbour gossip." },
  { id: "f-7", name: "Keira", note: "Shares your profile with ferry-line friends." },
  { id: "f-8", name: "Noah", note: "Clicks fast when you post 'last few'." },
  { id: "f-9", name: "Talia", note: "Watches Cranberry listings after school pickup." },
  { id: "f-10", name: "Bryn", note: "Buys eggs, forgets cartons, apologizes every time." },
  { id: "f-11", name: "Levi", note: "Favourite listing type: greens that survive soup." },
  { id: "f-12", name: "Ana", note: "Daily digest and absolutely zero chill for honey." }
];

export const initialSchedule: ScheduleSlot[] = [
  { day: "Tue", label: "8am to noon", open: true },
  { day: "Wed", label: "Closed", open: false },
  { day: "Thu", label: "8am to noon", open: true },
  { day: "Fri", label: "By arrangement", open: true },
  { day: "Sat", label: "8am to noon", open: true },
  { day: "Sun", label: "Closed", open: false }
];

export const viewTrend: AnalyticsPoint[] = [
  { label: "Mon", value: 14 },
  { label: "Tue", value: 21 },
  { label: "Wed", value: 18 },
  { label: "Thu", value: 27 },
  { label: "Fri", value: 42 },
  { label: "Sat", value: 51 },
  { label: "Sun", value: 23 }
];

export const engagementMoments: AnalyticsPoint[] = [
  { label: "7am", value: 18 },
  { label: "9am", value: 34 },
  { label: "Noon", value: 12 },
  { label: "4pm", value: 28 },
  { label: "7pm", value: 22 }
];

export function getProducerBySlug(slug: string) {
  return producers.find((producer) => producer.slug === slug);
}

export function getListingById(id: string) {
  return listings.find((listing) => listing.id === id);
}

export function getListingProducer(listing: Listing) {
  return producers.find((producer) => producer.id === listing.producerId);
}

export function buildCommunitySnapshot(): CommunitySnapshot {
  return {
    community: "Powell River, BC",
    activeListings: listings.filter((listing) => listing.status === "active").length,
    followedProducers: initialFollows.filter((follow) => follow.type === "producer").length,
    watchedCategories: initialFollows.filter((follow) => follow.type === "category").length,
    season: getSeasonFromDate()
  };
}
