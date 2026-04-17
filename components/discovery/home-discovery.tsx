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
  const [view, setView] = useState<DiscoveryView>("feed");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
          label: "Your location"
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
    <section className="space-y-4">
      {/* Search + view toggle row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar resultCount={filteredListings.length} onSearch={setQuery} />
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle — prominent */}
          <div className="flex rounded-full border border-[color:var(--border)] bg-[var(--surface)] p-1">
            <button
              type="button"
              onClick={() => setView("feed")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === "feed" ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "text-[var(--ink-soft)]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="14" height="3" rx="1" />
                <rect x="1" y="6" width="14" height="3" rx="1" />
                <rect x="1" y="11" width="14" height="3" rx="1" />
              </svg>
              List
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === "map" ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "text-[var(--ink-soft)]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 2.5-4.5 8.5-4.5 8.5S3.5 8.5 3.5 6A4.5 4.5 0 0 1 8 1.5zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
              </svg>
              Map
            </button>
          </div>
          {/* Filter toggle on mobile */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex h-10 items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)] xl:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3h14v1.5H1V3zm3 4h8v1.5H4V7zm2 4h4v1.5H6V11z" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="gold">{filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""}</Badge>
          {userLocation && <Badge tone="forest">Near {userLocation.label}</Badge>}
          {selectedCategories.length > 0 && (
            <Badge tone="neutral">{selectedCategories.length} filter{selectedCategories.length !== 1 ? "s" : ""}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {userLocation ? (
            <Button variant="ghost" onClick={() => setUserLocation(null)}>
              Clear location
            </Button>
          ) : (
            <Button variant="ghost" onClick={locateUser} disabled={locating}>
              {locating ? "Finding you..." : "📍 Use my location"}
            </Button>
          )}
        </div>
      </div>

      {/* Category pills — always visible, horizontally scrollable on mobile */}
      <MapControls
        categories={categories}
        selectedCategories={selectedCategories}
        radiusKm={radiusKm}
        view={view}
        onToggleCategory={handleToggleCategory}
        onRadiusChange={setRadiusKm}
        onViewChange={setView}
        hideViewToggle
      />

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div>
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

        {/* Sidebar filters — desktop always visible, mobile toggle */}
        <div className={`space-y-4 xl:sticky xl:top-20 xl:self-start ${showFilters ? "block" : "hidden xl:block"}`}>
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
      </div>
    </section>
  );
}
