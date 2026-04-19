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
  lat: number;
  lng: number;
  pickupDetails: string;
  scheduleSummary: string;
  followerCount: number;
  activeListingIds: string[];
  isCommunityMaintained?: boolean;
  contributedBy?: string | null;
  contributorName?: string | null;
  websiteUrl?: string | null;
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
  postedAt: string;
  locationLabel: string;
  lat: number;
  lng: number;
  views: number;
  status: "active" | "gone" | "expired";
  description: string;
  availableUntil: string;
  contributedBy?: string | null;
  contributorName?: string | null;
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
  Eggs: "#DAA520",
  Produce: "#3A5A40",
  "Baked Goods": "#D94F30",
  Preserved: "#8B6914",
  Dairy: "#4A90D9",
  "Meat & Fish": "#8B2500",
  Honey: "#FFB300",
  Plants: "#2E8B57",
  "Prepared Food": "#CD853F",
  Market: "#6B5B95",
  Other: "#888888"
};

export const producers: Producer[] = [
  {
    id: "b1111111-1111-1111-1111-111111111111",
    slug: "terra-nostra-farm",
    name: "Terra Nostra Farm",
    bio: "Certified organic farm growing vegetables the way they should be grown — in actual dirt, by actual people. Weekly CSA boxes mid-June through October with free delivery to Westview, Townsite, and Cranberry.",
    categories: ["Produce", "Eggs"],
    locationLabel: "Byron Road, Powell River",
    lat: 49.855,
    lng: -124.490,
    pickupDetails: "Farm store pickup Tue 12-5pm & Thu 12-6pm at 3244 Byron Road, or free delivery Tue/Thu afternoons.",
    scheduleSummary: "CSA Season: mid-June to mid-October · Farm Store: Tue & Thu",
    followerCount: 0,
    activeListingIds: ["listing-csa-harvest", "listing-csa-garden", "listing-eggs-tn"],
    websiteUrl: "https://terranostrafarm.com"
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    slug: "powell-river-farmers-market",
    name: "Powell River Farmers' Market",
    bio: "The longest-running farmers' market in the qathet region, going strong since 1987. Over 65 vendors who make it, bake it, grow it, or wild-harvest it.",
    categories: ["Market"],
    locationLabel: "Paradise Exhibition Grounds, McLeod Road",
    lat: 49.836,
    lng: -124.530,
    pickupDetails: "4365 McLeod Road. Past the airport, stay right, follow the signs. Tons of parking.",
    scheduleSummary: "Summer: Sat 10:30am-12:30pm + Sun 12:30-2:30pm · Winter: Sun 12:30-2:30pm",
    followerCount: 0,
    activeListingIds: ["listing-winter-market", "listing-summer-market"],
    websiteUrl: "https://powellriverfarmersmarket.blogspot.com"
  },
  {
    id: "b3333333-3333-3333-3333-333333333333",
    slug: "andtbaka-farm",
    name: "Andtbaka Farm",
    bio: "First greens of the season, free-range eggs, and the kind of storage crops that got your grandma through February. Frozen meats year-round.",
    categories: ["Produce", "Eggs", "Meat & Fish"],
    locationLabel: "Powell River",
    lat: 49.870,
    lng: -124.520,
    pickupDetails: "Find us at the Powell River Farmers' Market most Sundays.",
    scheduleSummary: "Sundays at the Farmers' Market",
    followerCount: 0,
    activeListingIds: ["listing-spring-greens", "listing-eggs-af", "listing-potatoes"]
  },
  {
    id: "b4444444-4444-4444-4444-444444444444",
    slug: "myrtle-point-heritage-farm",
    name: "Myrtle Point Heritage Farm",
    bio: "Heritage farm up in the Myrtle Point area. Fresh greens, raw honey from our own hives, pasture-raised frozen meats, and goat's milk soap in scents you didn't know you needed.",
    categories: ["Produce", "Honey", "Meat & Fish", "Other"],
    locationLabel: "Myrtle Point, Powell River",
    lat: 49.895,
    lng: -124.540,
    pickupDetails: "Farmers' Market on Sundays, or message us for farm pickup.",
    scheduleSummary: "Sundays at the Farmers' Market · Farm pickup by arrangement",
    followerCount: 0,
    activeListingIds: ["listing-honey-mph", "listing-chicken", "listing-soap"]
  },
  {
    id: "b5555555-5555-5555-5555-555555555555",
    slug: "ggs-good-greens",
    name: "GG's Good Greens",
    bio: "Sprouts, microgreens, and wheatgrass flats. High in nutrients, crunch, and the kind of flavour that makes salads worth eating. Locally grown indoors year-round by Lori.",
    categories: ["Produce"],
    locationLabel: "Westview, Powell River",
    lat: 49.840,
    lng: -124.525,
    pickupDetails: "Farmers' Market on Sundays, or reach out for midweek orders.",
    scheduleSummary: "Year-round · Sundays at the Farmers' Market",
    followerCount: 0,
    activeListingIds: ["listing-sprouts", "listing-microgreens", "listing-wheatgrass"]
  },
  {
    id: "b6666666-6666-6666-6666-666666666666",
    slug: "coast-berry-company",
    name: "Coast Berry Company",
    bio: "Locally grown frozen blueberries and strawberries — the kind that remind you what berries are supposed to taste like.",
    categories: ["Produce", "Preserved"],
    locationLabel: "Powell River",
    lat: 49.850,
    lng: -124.515,
    pickupDetails: "Available at the Farmers' Market year-round.",
    scheduleSummary: "Year-round · Saturdays & Sundays at the Farmers' Market",
    followerCount: 0,
    activeListingIds: ["listing-blueberries", "listing-strawberries"]
  },
  {
    id: "b7777777-7777-7777-7777-777777777777",
    slug: "primal-pastures",
    name: "Primal Pastures",
    bio: "Pasture-raised meats from animals that actually saw the sun. Frozen cuts and specialty products.",
    categories: ["Meat & Fish"],
    locationLabel: "Powell River",
    lat: 49.860,
    lng: -124.530,
    pickupDetails: "Farmers' Market or message for bulk orders.",
    scheduleSummary: "Sundays at the Farmers' Market",
    followerCount: 0,
    activeListingIds: ["listing-ground-beef", "listing-liver-caps"]
  },
  {
    id: "b8888888-8888-8888-8888-888888888888",
    slug: "seed-to-soul-farm",
    name: "Seed to Soul Farm",
    bio: "Pushing the seasons in Powell River — winter produce so you can eat local even when it's raining sideways.",
    categories: ["Produce"],
    locationLabel: "Powell River",
    lat: 49.845,
    lng: -124.510,
    pickupDetails: "Farmers' Market through the fall and winter season.",
    scheduleSummary: "Fall & Winter · Sundays at the Farmers' Market",
    followerCount: 0,
    activeListingIds: ["listing-kale-sts", "listing-lettuce-starts"]
  },
  {
    id: "b9999999-9999-9999-9999-999999999999",
    slug: "hammill-hill-farm",
    name: "Hammill Hill Farm",
    bio: "Raw, unpasteurized honey from happy bees in the hills above Powell River. We don't rush them and they don't rush us.",
    categories: ["Honey"],
    locationLabel: "Hammil Lake area, Powell River",
    lat: 49.880,
    lng: -124.550,
    pickupDetails: "Farmers' Market on Sundays.",
    scheduleSummary: "Fall & Winter · Sundays at the Farmers' Market",
    followerCount: 0,
    activeListingIds: ["listing-raw-honey", "listing-creamed-honey"]
  },
  {
    id: "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    slug: "blueberry-commons",
    name: "Blueberry Commons",
    bio: "Community self-serve farm store with rotating local produce. The kind of place you stumble into and leave with the best green onions of your life. Open daily — honour system.",
    categories: ["Produce", "Preserved"],
    locationLabel: "Cranberry / Westview, Powell River",
    lat: 49.845,
    lng: -124.525,
    pickupDetails: "Self-serve farm store — open daily, honour system.",
    scheduleSummary: "Daily · Self-serve",
    followerCount: 0,
    activeListingIds: ["listing-green-onions", "listing-salad-greens", "listing-rhubarb"],
    isCommunityMaintained: true,
    contributorName: "Maya"
  }
];

export const listings: Listing[] = [
  // Terra Nostra Farm
  {
    id: "listing-csa-harvest",
    producerId: "b1111111-1111-1111-1111-111111111111",
    title: "CSA Harvest Box — Weekly Subscription",
    category: "Produce",
    quantity: "some",
    priceLabel: "$55/week ($990 season)",
    distanceLabel: "2.1km away",
    postedLabel: "posted 3 days ago",
    postedAt: "2026-04-14T10:00:00-07:00",
    locationLabel: "Byron Road farm store",
    lat: 49.855,
    lng: -124.490,
    views: 89,
    status: "active",
    description: "Eight to ten different organic veggies every week for 18 weeks. Free delivery to Westview, Townsite, and Cranberry.",
    availableUntil: "June 15"
  },
  {
    id: "listing-csa-garden",
    producerId: "b1111111-1111-1111-1111-111111111111",
    title: "CSA Garden Box — Weekly Subscription",
    category: "Produce",
    quantity: "some",
    priceLabel: "$38/week ($684 season)",
    distanceLabel: "2.1km away",
    postedLabel: "posted 3 days ago",
    postedAt: "2026-04-14T10:00:00-07:00",
    locationLabel: "Byron Road farm store",
    lat: 49.855,
    lng: -124.490,
    views: 64,
    status: "active",
    description: "The smaller box for singles and couples. Seven to nine items including spring mix, arugula, carrots, beets, and more.",
    availableUntil: "June 15"
  },
  {
    id: "listing-eggs-tn",
    producerId: "b1111111-1111-1111-1111-111111111111",
    title: "Organic Free-Range Eggs (add-on)",
    category: "Eggs",
    quantity: "some",
    priceLabel: "$10/week",
    distanceLabel: "2.1km away",
    postedLabel: "posted 3 days ago",
    postedAt: "2026-04-14T10:00:00-07:00",
    locationLabel: "Byron Road farm store",
    lat: 49.855,
    lng: -124.490,
    views: 31,
    status: "active",
    description: "A dozen organic-fed chicken eggs each week. The yolks are that deep orange that makes grocery store eggs look sad.",
    availableUntil: "June 15"
  },
  // Powell River Farmers' Market
  {
    id: "listing-winter-market",
    producerId: "b2222222-2222-2222-2222-222222222222",
    title: "Sunday Winter Market",
    category: "Market",
    quantity: "plenty",
    priceLabel: "Free entry",
    distanceLabel: "3.5km away",
    postedLabel: "posted yesterday",
    postedAt: "2026-04-16T09:00:00-07:00",
    locationLabel: "Paradise Exhibition Grounds, McLeod Road",
    lat: 49.836,
    lng: -124.530,
    views: 124,
    status: "active",
    description: "Local produce, frozen berries, meats, honey, baked goods, and more. 65+ vendors under the Quonset hut.",
    availableUntil: "April 30"
  },
  {
    id: "listing-summer-market",
    producerId: "b2222222-2222-2222-2222-222222222222",
    title: "Summer Outdoor Market — Opens May 3",
    category: "Market",
    quantity: "plenty",
    priceLabel: "Free entry",
    distanceLabel: "3.5km away",
    postedLabel: "posted 5 days ago",
    postedAt: "2026-04-12T09:00:00-07:00",
    locationLabel: "Paradise Exhibition Grounds, McLeod Road",
    lat: 49.836,
    lng: -124.530,
    views: 203,
    status: "active",
    description: "Saturdays 10:30-12:30 and Sundays 12:30-2:30, outdoors with train rides. Over 65 vendors. Make It, Bake It, Grow It, or Wild Harvest It.",
    availableUntil: "September 30"
  },
  // Andtbaka Farm
  {
    id: "listing-spring-greens",
    producerId: "b3333333-3333-3333-3333-333333333333",
    title: "Spring Greens Mix",
    category: "Produce",
    quantity: "some",
    priceLabel: "$5/bag",
    distanceLabel: "1.8km away",
    postedLabel: "posted 2 days ago",
    postedAt: "2026-04-15T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.870,
    lng: -124.520,
    views: 27,
    status: "active",
    description: "First greens of the season. The stuff your body's been craving since November.",
    availableUntil: "Sunday"
  },
  {
    id: "listing-eggs-af",
    producerId: "b3333333-3333-3333-3333-333333333333",
    title: "Free-Range Eggs",
    category: "Eggs",
    quantity: "plenty",
    priceLabel: "$7/dozen",
    distanceLabel: "1.8km away",
    postedLabel: "posted yesterday",
    postedAt: "2026-04-16T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.870,
    lng: -124.520,
    views: 34,
    status: "active",
    description: "From chickens who know what grass looks like. Brown, blue, and every shade in between.",
    availableUntil: "Sunday"
  },
  {
    id: "listing-potatoes",
    producerId: "b3333333-3333-3333-3333-333333333333",
    title: "Storage Potatoes (Yukon Gold)",
    category: "Produce",
    quantity: "some",
    priceLabel: "$4/lb",
    distanceLabel: "1.8km away",
    postedLabel: "posted 4 days ago",
    postedAt: "2026-04-13T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.870,
    lng: -124.520,
    views: 18,
    status: "active",
    description: "Overwintered and still firm. These have been waiting patiently in the root cellar since October.",
    availableUntil: "While supplies last"
  },
  // Myrtle Point Heritage Farm
  {
    id: "listing-honey-mph",
    producerId: "b4444444-4444-4444-4444-444444444444",
    title: "Raw Wildflower Honey",
    category: "Honey",
    quantity: "some",
    priceLabel: "$14/jar",
    distanceLabel: "5.2km away",
    postedLabel: "posted 6 days ago",
    postedAt: "2026-04-11T10:00:00-07:00",
    locationLabel: "Farmers' Market or farm pickup",
    lat: 49.895,
    lng: -124.540,
    views: 45,
    status: "active",
    description: "From our own hives overlooking the forest. Floral, complex, and tastes like Powell River smells in July.",
    availableUntil: "While supplies last"
  },
  {
    id: "listing-chicken",
    producerId: "b4444444-4444-4444-4444-444444444444",
    title: "Frozen Pasture-Raised Chicken",
    category: "Meat & Fish",
    quantity: "last_few",
    priceLabel: "$28/bird",
    distanceLabel: "5.2km away",
    postedLabel: "posted 3 days ago",
    postedAt: "2026-04-14T10:00:00-07:00",
    locationLabel: "Farmers' Market or farm pickup",
    lat: 49.895,
    lng: -124.540,
    views: 22,
    status: "active",
    description: "Whole birds, raised on pasture the way your great-grandparents would approve of. Vacuum-sealed and frozen.",
    availableUntil: "While supplies last"
  },
  {
    id: "listing-soap",
    producerId: "b4444444-4444-4444-4444-444444444444",
    title: "Goat's Milk Soap — Lavender",
    category: "Other",
    quantity: "plenty",
    priceLabel: "$8/bar",
    distanceLabel: "5.2km away",
    postedLabel: "posted yesterday",
    postedAt: "2026-04-16T10:00:00-07:00",
    locationLabel: "Farmers' Market or farm pickup",
    lat: 49.895,
    lng: -124.540,
    views: 16,
    status: "active",
    description: "Handmade from our own goats' milk. Available in every scent imaginable, but lavender is why people come back.",
    availableUntil: "Always available"
  },
  // GG's Good Greens
  {
    id: "listing-sprouts",
    producerId: "b5555555-5555-5555-5555-555555555555",
    title: "Mixed Sprout Tray",
    category: "Produce",
    quantity: "plenty",
    priceLabel: "$6/tray",
    distanceLabel: "1.2km away",
    postedLabel: "posted 2 days ago",
    postedAt: "2026-04-15T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.840,
    lng: -124.525,
    views: 21,
    status: "active",
    description: "Broccoli, radish, and alfalfa sprouts. Crunchy, nutrient-dense, and the easiest way to make any sandwich feel fancy.",
    availableUntil: "Sunday"
  },
  {
    id: "listing-microgreens",
    producerId: "b5555555-5555-5555-5555-555555555555",
    title: "Sunflower Microgreens",
    category: "Produce",
    quantity: "some",
    priceLabel: "$5/clamshell",
    distanceLabel: "1.2km away",
    postedLabel: "posted 3 days ago",
    postedAt: "2026-04-14T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.840,
    lng: -124.525,
    views: 15,
    status: "active",
    description: "Nutty, tender, and photogenic enough for your most pretentious salad. Grown indoors, available year-round.",
    availableUntil: "Sunday"
  },
  {
    id: "listing-wheatgrass",
    producerId: "b5555555-5555-5555-5555-555555555555",
    title: "Wheatgrass Flat",
    category: "Produce",
    quantity: "some",
    priceLabel: "$12/flat",
    distanceLabel: "1.2km away",
    postedLabel: "posted 5 days ago",
    postedAt: "2026-04-12T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.840,
    lng: -124.525,
    views: 9,
    status: "active",
    description: "Grow your own juice supply. One flat keeps you in green shots for a couple weeks.",
    availableUntil: "Sunday"
  },
  // Coast Berry Company
  {
    id: "listing-blueberries",
    producerId: "b6666666-6666-6666-6666-666666666666",
    title: "Frozen Blueberries (2lb bag)",
    category: "Produce",
    quantity: "plenty",
    priceLabel: "$12/bag",
    distanceLabel: "2.0km away",
    postedLabel: "posted 4 days ago",
    postedAt: "2026-04-13T09:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.850,
    lng: -124.515,
    views: 33,
    status: "active",
    description: "Locally grown, flash-frozen at peak ripeness. These are the ones your smoothie has been missing.",
    availableUntil: "Year-round"
  },
  {
    id: "listing-strawberries",
    producerId: "b6666666-6666-6666-6666-666666666666",
    title: "Frozen Strawberries (2lb bag)",
    category: "Produce",
    quantity: "some",
    priceLabel: "$14/bag",
    distanceLabel: "2.0km away",
    postedLabel: "posted 4 days ago",
    postedAt: "2026-04-13T09:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.850,
    lng: -124.515,
    views: 28,
    status: "active",
    description: "Summer in a bag, available in April. Slightly thawed on cereal is the move. Trust us.",
    availableUntil: "Year-round"
  },
  // Primal Pastures
  {
    id: "listing-ground-beef",
    producerId: "b7777777-7777-7777-7777-777777777777",
    title: "Frozen Ground Beef (1lb packs)",
    category: "Meat & Fish",
    quantity: "some",
    priceLabel: "$12/lb",
    distanceLabel: "2.8km away",
    postedLabel: "posted 2 days ago",
    postedAt: "2026-04-15T09:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.860,
    lng: -124.530,
    views: 19,
    status: "active",
    description: "Pasture-raised, no hormones, no antibiotics. The kind of ground beef that makes you wonder why you ever bought the other stuff.",
    availableUntil: "While supplies last"
  },
  {
    id: "listing-liver-caps",
    producerId: "b7777777-7777-7777-7777-777777777777",
    title: "Beef Liver Capsules",
    category: "Other",
    quantity: "plenty",
    priceLabel: "$35/bottle",
    distanceLabel: "2.8km away",
    postedLabel: "posted 7 days ago",
    postedAt: "2026-04-10T09:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.860,
    lng: -124.530,
    views: 12,
    status: "active",
    description: "For the nutrition nerds. Freeze-dried pasture-raised beef liver in capsule form. All the nutrients, none of the taste.",
    availableUntil: "Always available"
  },
  // Seed to Soul Farm
  {
    id: "listing-kale-sts",
    producerId: "b8888888-8888-8888-8888-888888888888",
    title: "Overwintered Kale",
    category: "Produce",
    quantity: "some",
    priceLabel: "$4/bunch",
    distanceLabel: "1.5km away",
    postedLabel: "posted 2 days ago",
    postedAt: "2026-04-15T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.845,
    lng: -124.510,
    views: 14,
    status: "active",
    description: "Survived the Powell River winter and came out sweeter for it. Frost-kissed lacinato and curly varieties.",
    availableUntil: "Sunday"
  },
  {
    id: "listing-lettuce-starts",
    producerId: "b8888888-8888-8888-8888-888888888888",
    title: "Spring Lettuce Starts",
    category: "Plants",
    quantity: "last_few",
    priceLabel: "$3/pot",
    distanceLabel: "1.5km away",
    postedLabel: "posted yesterday",
    postedAt: "2026-04-16T08:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.845,
    lng: -124.510,
    views: 11,
    status: "active",
    description: "Ready-to-plant lettuce seedlings. Get a head start on the season before the slugs figure out what you're doing.",
    availableUntil: "Sunday"
  },
  // Hammill Hill Farm
  {
    id: "listing-raw-honey",
    producerId: "b9999999-9999-9999-9999-999999999999",
    title: "Raw Unpasteurized Honey",
    category: "Honey",
    quantity: "some",
    priceLabel: "$16/jar (500g)",
    distanceLabel: "4.5km away",
    postedLabel: "posted 5 days ago",
    postedAt: "2026-04-12T09:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.880,
    lng: -124.550,
    views: 26,
    status: "active",
    description: "From bees who forage the wildflowers above Hammil Lake. Thick, golden, and completely unprocessed.",
    availableUntil: "While supplies last"
  },
  {
    id: "listing-creamed-honey",
    producerId: "b9999999-9999-9999-9999-999999999999",
    title: "Creamed Honey",
    category: "Honey",
    quantity: "last_few",
    priceLabel: "$18/jar (500g)",
    distanceLabel: "4.5km away",
    postedLabel: "posted 5 days ago",
    postedAt: "2026-04-12T09:00:00-07:00",
    locationLabel: "Farmers' Market",
    lat: 49.880,
    lng: -124.550,
    views: 19,
    status: "active",
    description: "Same great honey, whipped into a spreadable texture. Dangerously good on toast. You've been warned.",
    availableUntil: "While supplies last"
  },
  // Blueberry Commons
  {
    id: "listing-green-onions",
    producerId: "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Green Onion Bunches",
    category: "Produce",
    quantity: "plenty",
    priceLabel: "$3/bunch",
    distanceLabel: "1.0km away",
    postedLabel: "posted yesterday",
    postedAt: "2026-04-16T07:00:00-07:00",
    locationLabel: "Self-serve farm store",
    lat: 49.845,
    lng: -124.525,
    views: 42,
    status: "active",
    description: "The ones that started it all. You'll come for the green onions and leave wondering why you don't shop here every day.",
    availableUntil: "While supplies last",
    contributorName: "Maya"
  },
  {
    id: "listing-salad-greens",
    producerId: "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Mixed Salad Greens",
    category: "Produce",
    quantity: "some",
    priceLabel: "$5/bag",
    distanceLabel: "1.0km away",
    postedLabel: "posted 12 hours ago",
    postedAt: "2026-04-17T02:00:00-07:00",
    locationLabel: "Self-serve farm store",
    lat: 49.845,
    lng: -124.525,
    views: 18,
    status: "active",
    description: "Freshly picked, gently washed, ready for your bowl. Rotating varieties depending on what's growing this week.",
    availableUntil: "While supplies last"
  },
  {
    id: "listing-rhubarb",
    producerId: "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Rhubarb Stalks",
    category: "Produce",
    quantity: "plenty",
    priceLabel: "$4/lb",
    distanceLabel: "1.0km away",
    postedLabel: "posted 2 days ago",
    postedAt: "2026-04-15T07:00:00-07:00",
    locationLabel: "Self-serve farm store",
    lat: 49.845,
    lng: -124.525,
    views: 29,
    status: "active",
    description: "It's rhubarb season and these stalks are thick, tart, and ready for pie. Or crumble. Or that thing where you just dip it in sugar.",
    availableUntil: "While supplies last"
  }
];

export const initialFollows: Follow[] = [
  {
    id: "follow-1",
    type: "producer",
    label: "Terra Nostra Farm",
    producerId: "b1111111-1111-1111-1111-111111111111",
    frequency: "immediate",
    muted: false
  },
  {
    id: "follow-2",
    type: "producer",
    label: "Blueberry Commons",
    producerId: "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    frequency: "immediate",
    muted: false
  },
  {
    id: "follow-3",
    type: "category",
    label: "Eggs",
    category: "Eggs",
    frequency: "daily",
    muted: false
  },
  {
    id: "follow-4",
    type: "area",
    label: "Watch Westview area",
    areaLabel: "Westview",
    radiusKm: 3,
    frequency: "immediate",
    muted: false
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Blueberry Commons just posted green onions",
    body: "The green onions are back. You know what to do.",
    href: "/listing/listing-green-onions",
    createdAt: "7 minutes ago",
    unread: true,
    kind: "producer"
  },
  {
    id: "notif-2",
    title: "Egg watch: Andtbaka Farm has fresh dozens up",
    body: "Free-range eggs just landed at the market. Brown, blue, and every shade in between.",
    href: "/listing/listing-eggs-af",
    createdAt: "32 minutes ago",
    unread: true,
    kind: "category"
  },
  {
    id: "notif-3",
    title: "New listing near Westview",
    body: "GG's Good Greens posted sunflower microgreens. Your salad game is about to level up.",
    href: "/producer/ggs-good-greens",
    createdAt: "Today at 8:02am",
    unread: false,
    kind: "area"
  }
];

export const followerPreview: FollowerPreview[] = [];

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
