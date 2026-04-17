"use client";

import { startTransition, useState } from "react";

import { ListingFeed } from "@/components/feed/listing-feed";
import { HarvestLinkMap } from "@/components/map/harvestlink-map";
import { MapControls } from "@/components/map/map-controls";
import { FilterPanel } from "@/components/search/filter-panel";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHarvestLink } from "@/hooks/use-harvestlink";
import {
  LOCATION_SUGGESTIONS,
  filterListings,
  getDiscoveryCategories,
  type AvailabilityFilter,
  type DiscoveryView,
  type PriceFilter,
  type UserLocation
} from "@/lib/discovery";

export function HomeDiscovery() {
  const { listings, producers } = useHarvestLink();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radiusKm, setRadiusKm] = useState(5);
  const [availability, setAvailability] = useState<AvailabilityFilter>("available");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [view, setView] = useState<DiscoveryView>("map");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = getDiscoveryCategories(listings);
  const filteredListings = filterListings(listings, producers, {
    query,
    categories: selectedCategories,
    radiusKm,
    availability,
    price,
    userLocation
  });

  const handleToggleCategory = (category: string) => {
    if (category === "__all__") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const locateUser = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setUserLocation(LOCATION_SUGGESTIONS[0] ?? null);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your current spot"
        });
        setLocating(false);
      },
      () => {
        setUserLocation(LOCATION_SUGGESTIONS[0] ?? null);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const refreshFeed = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      startTransition(() => {
        setRefreshing(false);
      });
    }, 700);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
      <div className="space-y-5">
        <SearchBar resultCount={filteredListings.length} onSearch={setQuery} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">{filteredListings.length} listings in the loop</Badge>
            {userLocation ? <Badge tone="forest">Sorting from {userLocation.label}</Badge> : <Badge tone="neutral">Sorting by fresh posts</Badge>}
          </div>
          {userLocation ? (
            <Button variant="ghost" onClick={() => setUserLocation(null)}>
              Clear location bias
            </Button>
          ) : null}
        </div>
        <MapControls
          categories={categories}
          selectedCategories={selectedCategories}
          radiusKm={radiusKm}
          view={view}
          onToggleCategory={handleToggleCategory}
          onRadiusChange={setRadiusKm}
          onViewChange={setView}
        />

        {view === "map" ? (
          <HarvestLinkMap listings={filteredListings} producers={producers} userLocation={userLocation} />
        ) : (
          <ListingFeed
            listings={filteredListings}
            producers={producers}
            userLocation={userLocation}
            refreshing={refreshing}
            onRefresh={refreshFeed}
          />
        )}
      </div>

      <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <FilterPanel
          categories={categories}
          selectedCategories={selectedCategories}
          radiusKm={radiusKm}
          availability={availability}
          price={price}
          userLocation={userLocation}
          locating={locating}
          onToggleCategory={handleToggleCategory}
          onRadiusChange={setRadiusKm}
          onAvailabilityChange={setAvailability}
          onPriceChange={setPrice}
          onLocateUser={locateUser}
        />
      </div>
    </section>
  );
}
