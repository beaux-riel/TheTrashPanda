"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { categoryPalette, type Listing, type Producer } from "@/lib/data/mock";
import {
  POWELL_RIVER_CENTER,
  getListingDistanceLabel,
  getProducerMap,
  quantityLabels,
  type UserLocation
} from "@/lib/discovery";

const MAPBOX_VERSION = "v3.20.0";

type MapboxMap = {
  on: (...args: any[]) => void;
  off: (...args: any[]) => void;
  remove: () => void;
  resize: () => void;
  easeTo: (options: Record<string, unknown>) => void;
  addSource: (id: string, source: Record<string, unknown>) => void;
  addLayer: (layer: Record<string, unknown>) => void;
  getSource: (id: string) => { setData: (data: unknown) => void; getClusterExpansionZoom?: (...args: any[]) => void };
  getCanvas: () => HTMLCanvasElement;
  queryRenderedFeatures: (point: unknown, options?: Record<string, unknown>) => Array<Record<string, any>>;
};

type MapboxPopup = {
  setLngLat: (lngLat: [number, number]) => MapboxPopup;
  setHTML: (html: string) => MapboxPopup;
  addTo: (map: MapboxMap) => MapboxPopup;
  remove: () => void;
};

type MapboxGlobal = {
  accessToken: string;
  Map: new (options: Record<string, unknown>) => MapboxMap;
  Popup: new (options?: Record<string, unknown>) => MapboxPopup;
};

declare global {
  interface Window {
    mapboxgl?: MapboxGlobal;
  }
}

function loadMapboxAssets() {
  if (typeof window === "undefined") {
    return Promise.resolve<MapboxGlobal | null>(null);
  }

  if (window.mapboxgl) {
    return Promise.resolve(window.mapboxgl);
  }

  return new Promise<MapboxGlobal | null>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-mapbox-gl]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.mapboxgl ?? null), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Mapbox GL JS failed to load.")), { once: true });
      return;
    }

    if (!document.querySelector(`link[data-mapbox-css="${MAPBOX_VERSION}"]`)) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = `https://api.mapbox.com/mapbox-gl-js/${MAPBOX_VERSION}/mapbox-gl.css`;
      stylesheet.dataset.mapboxCss = MAPBOX_VERSION;
      document.head.appendChild(stylesheet);
    }

    const script = document.createElement("script");
    script.src = `https://api.mapbox.com/mapbox-gl-js/${MAPBOX_VERSION}/mapbox-gl.js`;
    script.async = true;
    script.dataset.mapboxGl = "true";
    script.addEventListener("load", () => resolve(window.mapboxgl ?? null), { once: true });
    script.addEventListener("error", () => reject(new Error("Mapbox GL JS failed to load.")), { once: true });
    document.body.appendChild(script);
  });
}

export function HarvestLinkMap({
  listings,
  producers,
  userLocation
}: {
  listings: Listing[];
  producers: Producer[];
  userLocation: UserLocation | null;
}) {
  const mapRef = useRef<MapboxMap | null>(null);
  const popupRef = useRef<MapboxPopup | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const producerMap = useMemo(() => getProducerMap(producers), [producers]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection",
      features: listings.map((listing) => {
        const producer = producerMap[listing.producerId];

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [listing.lng, listing.lat]
          },
          properties: {
            id: listing.id,
            title: listing.title,
            category: listing.category,
            producerName: producer?.name ?? "Neighbour producer",
            quantityLabel: quantityLabels[listing.quantity],
            distanceLabel: getListingDistanceLabel(listing, userLocation),
            href: `/listing/${listing.id}`
          }
        };
      })
    }),
    [listings, producerMap, userLocation]
  );

  useEffect(() => {
    if (!token || !containerRef.current) {
      return;
    }

    let cancelled = false;

    void loadMapboxAssets()
      .then((mapboxgl) => {
        if (!mapboxgl || cancelled || !containerRef.current) {
          return;
        }

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: [POWELL_RIVER_CENTER.lng, POWELL_RIVER_CENTER.lat],
          zoom: 11.6
        });

        const onLoad = () => {
          map.addSource("thetrashpanda-listings", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: []
            },
            cluster: true,
            clusterRadius: 56,
            clusterMaxZoom: 13
          });

          map.addLayer({
            id: "thetrashpanda-clusters",
            type: "circle",
            source: "thetrashpanda-listings",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "rgba(58, 90, 64, 0.9)",
              "circle-radius": ["step", ["get", "point_count"], 20, 4, 24, 8, 30],
              "circle-stroke-width": 2,
              "circle-stroke-color": "rgba(255,255,255,0.85)"
            }
          });

          map.addLayer({
            id: "thetrashpanda-cluster-count",
            type: "symbol",
            source: "thetrashpanda-listings",
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-size": 12
            },
            paint: {
              "text-color": "#ffffff"
            }
          });

          map.addLayer({
            id: "thetrashpanda-points",
            type: "circle",
            source: "thetrashpanda-listings",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": [
                "match",
                ["get", "category"],
                ...Object.entries(categoryPalette).flatMap(([category, color]) => [category, color]),
                "#888888"
              ],
              "circle-radius": 10,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fffdf7"
            }
          });
        };

        const onClusterClick = (event: { point: unknown }) => {
          const features = map.queryRenderedFeatures(event.point, { layers: ["thetrashpanda-clusters"] });
          const clusterId = features[0]?.properties?.cluster_id;
          const source = map.getSource("thetrashpanda-listings");

          source.getClusterExpansionZoom?.(clusterId, (error: unknown, zoom: number) => {
            if (error || !features[0]) {
              return;
            }

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom
            });
          });
        };

        const onPointClick = (event: { features?: Array<Record<string, any>> }) => {
          const feature = event.features?.[0];
          if (!feature) {
            return;
          }

          popupRef.current?.remove();
          popupRef.current = new mapboxgl.Popup({ offset: 16 })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
              `<article class="harvestlink-popup">
                <p class="harvestlink-popup__eyebrow">${feature.properties.producerName}</p>
                <a class="harvestlink-popup__title" href="${feature.properties.href}">${feature.properties.title}</a>
                <div class="harvestlink-popup__meta">
                  <span class="harvestlink-popup__badge">${feature.properties.quantityLabel}</span>
                  <span>${feature.properties.distanceLabel}</span>
                </div>
              </article>`
            )
            .addTo(map);
        };

        const onEnter = () => {
          map.getCanvas().style.cursor = "pointer";
        };

        const onLeave = () => {
          map.getCanvas().style.cursor = "";
        };

        map.on("load", onLoad);
        map.on("click", "thetrashpanda-clusters", onClusterClick);
        map.on("click", "thetrashpanda-points", onPointClick);
        map.on("mouseenter", "thetrashpanda-clusters", onEnter);
        map.on("mouseleave", "thetrashpanda-clusters", onLeave);
        map.on("mouseenter", "thetrashpanda-points", onEnter);
        map.on("mouseleave", "thetrashpanda-points", onLeave);

        mapRef.current = map;
        window.setTimeout(() => {
          map.resize();
        }, 0);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Mapbox could not load.");
      });

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      popupRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const source = mapRef.current?.getSource("thetrashpanda-listings");
    source?.setData(geojson);
    mapRef.current?.resize();
  }, [geojson]);

  if (!token) {
    return (
      <Card className="min-h-[420px] space-y-3">
        <h3 className="font-display text-3xl text-[var(--ink)]">Map needs its token</h3>
        <p className="max-w-xl text-sm leading-6 text-[var(--ink-soft)]">
          Add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> and the real Powell River map wakes up. Until then, the feed still works and nobody has to pretend.
        </p>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card className="min-h-[420px] space-y-3">
        <h3 className="font-display text-3xl text-[var(--ink)]">Mapbox tripped on the dock</h3>
        <p className="max-w-xl text-sm leading-6 text-[var(--ink-soft)]">{loadError}</p>
      </Card>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--border)] shadow-card">
      <div ref={containerRef} className="min-h-[460px] bg-[linear-gradient(135deg,#f4efe8,#e7ded3)]" />
    </div>
  );
}
