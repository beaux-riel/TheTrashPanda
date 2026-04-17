import type { Listing, Producer } from "@/lib/data/mock";

export const POWELL_RIVER_CENTER = {
  lat: 49.8353,
  lng: -124.5247,
  label: "Powell River"
};

export const LOCATION_SUGGESTIONS = [
  { label: "Cranberry", lat: 49.868, lng: -124.51 },
  { label: "Willingdon Beach", lat: 49.8445, lng: -124.5265 },
  { label: "Townsite", lat: 49.837, lng: -124.543 },
  { label: "Westview", lat: 49.8504, lng: -124.5379 }
];

export const quantityLabels: Record<Listing["quantity"], string> = {
  plenty: "Plenty",
  some: "Some left",
  last_few: "Better hurry!"
};

export type DiscoveryView = "map" | "feed";
export type AvailabilityFilter = "available" | "all";
export type PriceFilter = "free" | "paid" | "all";
export type UserLocation = {
  lat: number;
  lng: number;
  label: string;
};

export type DiscoveryFilters = {
  query: string;
  categories: string[];
  radiusKm: number;
  availability: AvailabilityFilter;
  price: PriceFilter;
  userLocation: UserLocation | null;
};

export function getDiscoveryCategories(listings: Listing[]) {
  return [...new Set(listings.map((listing) => listing.category))].sort((left, right) => left.localeCompare(right));
}

export function haversineDistanceKm(
  from: Pick<UserLocation, "lat" | "lng">,
  to: Pick<UserLocation, "lat" | "lng">
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.max(100, Math.round(distanceKm * 1000 / 50) * 50)}m away`;
  }

  return `${distanceKm.toFixed(distanceKm < 4 ? 1 : 0)}km away`;
}

export function getListingDistanceKm(
  listing: Pick<Listing, "lat" | "lng">,
  origin: Pick<UserLocation, "lat" | "lng"> = POWELL_RIVER_CENTER
) {
  return haversineDistanceKm(origin, listing);
}

export function getListingDistanceLabel(listing: Listing, userLocation: UserLocation | null) {
  if (!userLocation) {
    return listing.distanceLabel;
  }

  return formatDistance(getListingDistanceKm(listing, userLocation));
}

export function getListingTimeAgo(listing: Pick<Listing, "postedAt" | "postedLabel">) {
  const postedTime = new Date(listing.postedAt).getTime();
  const elapsedMinutes = Math.max(0, Math.round((Date.now() - postedTime) / 60000));

  if (!Number.isFinite(elapsedMinutes) || elapsedMinutes <= 0) {
    return listing.postedLabel.replace(/^posted\s+/i, "");
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours}h ago`;
  }

  const elapsedDays = Math.round(elapsedHours / 24);
  return `${elapsedDays}d ago`;
}

export function isListingFree(listing: Listing) {
  return /free|swap|gift/i.test(listing.priceLabel);
}

export function getProducerMap(producers: Producer[]) {
  return Object.fromEntries(producers.map((producer) => [producer.id, producer]));
}

export function filterListings(listings: Listing[], producers: Producer[], filters: DiscoveryFilters) {
  const producerMap = getProducerMap(producers);
  const normalizedQuery = filters.query.trim().toLowerCase();
  const filterOrigin = filters.userLocation ?? POWELL_RIVER_CENTER;

  return listings
    .filter((listing) => {
      const producer = producerMap[listing.producerId];

      if (filters.categories.length && !filters.categories.includes(listing.category)) {
        return false;
      }

      if (filters.availability === "available" && listing.status !== "active") {
        return false;
      }

      if (filters.price === "free" && !isListingFree(listing)) {
        return false;
      }

      if (filters.price === "paid" && isListingFree(listing)) {
        return false;
      }

      if (filters.radiusKm > 0 && getListingDistanceKm(listing, filterOrigin) > filters.radiusKm) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [listing.title, listing.category, producer?.name ?? "", listing.locationLabel]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (filters.userLocation) {
        return getListingDistanceKm(left, filters.userLocation) - getListingDistanceKm(right, filters.userLocation);
      }

      return new Date(right.postedAt).getTime() - new Date(left.postedAt).getTime();
    });
}
