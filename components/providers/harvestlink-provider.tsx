"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  buildCommunitySnapshot,
  followerPreview,
  getListingById,
  getListingProducer,
  getProducerBySlug,
  initialFollows,
  initialNotifications,
  initialSchedule,
  listings as mockListings,
  producers as mockProducers,
  type Follow,
  type Listing,
  type NotificationFrequency,
  type NotificationItem,
  type PermissionState,
  type ScheduleSlot
} from "@/lib/data/mock";
import { fetchListingsClient, fetchProducersClient } from "@/lib/data/client-bridge";
import {
  createCategoryNotificationCopy,
  createProducerNotificationCopy
} from "@/lib/notifications/copy";
import {
  registerForPush,
  requestNotificationPermission,
  showBrowserNotification
} from "@/lib/notifications/push";
import { getSeasonFromDate } from "@/lib/utils/season";

type PromptContext = {
  producerName?: string;
} | null;

type HarvestLinkContextValue = {
  season: ReturnType<typeof getSeasonFromDate>;
  producers: typeof mockProducers;
  listings: Listing[];
  follows: Follow[];
  notifications: NotificationItem[];
  schedule: ScheduleSlot[];
  followerPreview: typeof followerPreview;
  notificationPermission: PermissionState;
  unreadCount: number;
  promptContext: PromptContext;
  celebrationMessage: string | null;
  dashboardProducer: (typeof mockProducers)[0];
  communitySnapshot: ReturnType<typeof buildCommunitySnapshot>;
  isFollowingProducer: (producerId: string) => boolean;
  isFollowingCategory: (category: string) => boolean;
  toggleProducerFollow: (producerId: string) => void;
  toggleCategoryFollow: (category: string) => void;
  updateFollowPreference: (followId: string, frequency: NotificationFrequency) => void;
  toggleMuteFollow: (followId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  dismissPrompt: () => void;
  requestPushAccess: () => Promise<void>;
  sendTestNotification: (listingId: string) => void;
  markListingGone: (listingId: string) => void;
  repostListing: (listingId: string) => void;
  quickPostListing: (templateId?: string) => void;
  updateSchedule: (day: string, label: string, open: boolean) => void;
  dismissCelebration: () => void;
};

const HarvestLinkContext = createContext<HarvestLinkContextValue | null>(null);

const FOLLOWS_KEY = "harvestlink.follows";
const NOTIFICATIONS_KEY = "harvestlink.notifications";
const LISTINGS_KEY = "harvestlink.dashboardListings";
const SCHEDULE_KEY = "harvestlink.schedule";

function readStoredState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function writeStoredState<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function HarvestLinkProvider({ children }: { children: ReactNode }) {
  const [follows, setFollows] = useState<Follow[]>(initialFollows);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [dashboardListings, setDashboardListings] = useState<Listing[]>(mockListings);
  const [allProducers, setAllProducers] = useState(mockProducers);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(initialSchedule);
  const [notificationPermission, setNotificationPermission] = useState<PermissionState>("default");
  const [promptContext, setPromptContext] = useState<PromptContext>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  useEffect(() => {
    setFollows(readStoredState(FOLLOWS_KEY, initialFollows));
    setNotifications(readStoredState(NOTIFICATIONS_KEY, initialNotifications));
    setDashboardListings(readStoredState(LISTINGS_KEY, mockListings));
    setSchedule(readStoredState(SCHEDULE_KEY, initialSchedule));

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("unsupported");
    }

    // Fetch live data from Supabase (falls back to mock via client-bridge)
    fetchListingsClient().then((live) => {
      if (live.length > 0) {
        setDashboardListings(live);
        writeStoredState(LISTINGS_KEY, live);
      }
    }).catch(() => { /* mock data already loaded */ });

    fetchProducersClient().then((live) => {
      if (live.length > 0) setAllProducers(live);
    }).catch(() => { /* mock data already loaded */ });
  }, []);

  useEffect(() => {
    writeStoredState(FOLLOWS_KEY, follows);
  }, [follows]);

  useEffect(() => {
    writeStoredState(NOTIFICATIONS_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    writeStoredState(LISTINGS_KEY, dashboardListings);
  }, [dashboardListings]);

  useEffect(() => {
    writeStoredState(SCHEDULE_KEY, schedule);
  }, [schedule]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const dashboardProducer = allProducers[0];

  const value = useMemo<HarvestLinkContextValue>(
    () => ({
      season: getSeasonFromDate(),
      producers: allProducers,
      listings: dashboardListings,
      follows,
      notifications,
      schedule,
      followerPreview,
      notificationPermission,
      unreadCount,
      promptContext,
      celebrationMessage,
      dashboardProducer,
      communitySnapshot: buildCommunitySnapshot(),
      isFollowingProducer: (producerId) => follows.some((follow) => follow.producerId === producerId),
      isFollowingCategory: (category) =>
        follows.some((follow) => follow.category?.toLowerCase() === category.toLowerCase()),
      toggleProducerFollow: (producerId) => {
        const producer = allProducers.find((item) => item.id === producerId);
        if (!producer) {
          return;
        }

        const existing = follows.find((follow) => follow.producerId === producerId);

        startTransition(() => {
          if (existing) {
            setFollows((current) => current.filter((follow) => follow.id !== existing.id));
            setCelebrationMessage(`Quieted ${producer.name} for now. No hard feelings, just fewer pings.`);
            return;
          }

          setFollows((current) => [
            {
              id: `follow-${producerId}`,
              type: "producer",
              label: producer.name,
              producerId,
              frequency: "immediate",
              muted: false
            },
            ...current
          ]);
          setPromptContext({ producerName: producer.name });
          setCelebrationMessage(`${producer.name} is in your loop now. Bandit approves the excellent taste.`);
        });
      },
      toggleCategoryFollow: (category) => {
        const existing = follows.find((follow) => follow.category === category);

        startTransition(() => {
          if (existing) {
            setFollows((current) => current.filter((follow) => follow.id !== existing.id));
            setCelebrationMessage(`${category} watch switched off. Your phone can exhale.`);
            return;
          }

          setFollows((current) => [
            {
              id: `category-${category.toLowerCase()}`,
              type: "category",
              label: category,
              category,
              frequency: "daily",
              muted: false
            },
            ...current
          ]);
          setCelebrationMessage(`${category} joined your watch list. If eggs pop up, you’ll hear about it.`);
        });
      },
      updateFollowPreference: (followId, frequency) => {
        setFollows((current) =>
          current.map((follow) =>
            follow.id === followId
              ? {
                  ...follow,
                  frequency
                }
              : follow
          )
        );
      },
      toggleMuteFollow: (followId) => {
        setFollows((current) =>
          current.map((follow) =>
            follow.id === followId
              ? {
                  ...follow,
                  muted: !follow.muted
                }
              : follow
          )
        );
      },
      markNotificationRead: (notificationId) => {
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  unread: false
                }
              : notification
          )
        );
      },
      markAllNotificationsRead: () => {
        setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
      },
      dismissPrompt: () => setPromptContext(null),
      requestPushAccess: async () => {
        const permission = await requestNotificationPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          await registerForPush();
          setPromptContext(null);
          setCelebrationMessage("Notifications are on. You’re officially the first to know when the good stuff lands.");
        }
      },
      sendTestNotification: (listingId) => {
        const listing = getListingById(listingId);
        if (!listing) {
          return;
        }

        const producer = getListingProducer(listing);
        if (!producer) {
          return;
        }

        const copy = createProducerNotificationCopy(producer, listing);
        const nextNotification: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: copy.title,
          body: copy.body,
          href: `/listing/${listing.id}`,
          createdAt: "just now",
          unread: true,
          kind: "producer"
        };

        setNotifications((current) => [nextNotification, ...current]);
        showBrowserNotification(nextNotification.title, nextNotification.body, nextNotification.href);
      },
      markListingGone: (listingId) => {
        setDashboardListings((current) =>
          current.map((listing) =>
            listing.id === listingId
              ? {
                  ...listing,
                  status: "gone"
                }
              : listing
          )
        );
        setCelebrationMessage("Marked gone. Short, sweet, and no one has to wonder if the eggs vanished.");
      },
      repostListing: (listingId) => {
        const listing = getListingById(listingId);
        if (!listing) {
          return;
        }

        const producer = getListingProducer(listing);
        if (!producer) {
          return;
        }

        const revived: Listing = {
          ...listing,
          id: `listing-${Date.now()}`,
          postedLabel: "posted just now",
          postedAt: new Date().toISOString(),
          status: "active",
          availableUntil: "7 days from now"
        };

        setDashboardListings((current) => [revived, ...current]);
        const copy = createCategoryNotificationCopy(revived.category, revived, producer);
        setNotifications((current) => [
          {
            id: `notif-${Date.now() + 1}`,
            title: copy.title,
            body: copy.body,
            href: `/listing/${revived.id}`,
            createdAt: "just now",
            unread: true,
            kind: "category"
          },
          ...current
        ]);
        setCelebrationMessage(`Reposted ${listing.title}. Nice little encore.`);
      },
      quickPostListing: (templateId) => {
        const template = templateId ? getListingById(templateId) : getListingById("listing-eggs");
        if (!template) {
          return;
        }

        const freshPost: Listing = {
          ...template,
          id: `listing-${Date.now()}`,
          status: "active",
          postedLabel: "posted just now",
          postedAt: new Date().toISOString(),
          views: 0,
          availableUntil: "7 days from now"
        };

        setDashboardListings((current) => [freshPost, ...current]);
        setCelebrationMessage("Posted! Bandit did a quick two-step behind the compost bin.");
      },
      updateSchedule: (day, label, open) => {
        setSchedule((current) =>
          current.map((slot) =>
            slot.day === day
              ? {
                  ...slot,
                  label,
                  open
                }
              : slot
          )
        );
      },
      dismissCelebration: () => setCelebrationMessage(null)
    }),
    [
      allProducers,
      celebrationMessage,
      dashboardListings,
      follows,
      notificationPermission,
      notifications,
      promptContext,
      schedule,
      dashboardProducer,
      unreadCount
    ]
  );

  return <HarvestLinkContext.Provider value={value}>{children}</HarvestLinkContext.Provider>;
}

export function useHarvestLink() {
  const context = useContext(HarvestLinkContext);

  if (!context) {
    throw new Error("useHarvestLink must be used inside HarvestLinkProvider.");
  }

  return context;
}

export function useProducerBySlug(slug: string) {
  return getProducerBySlug(slug);
}
