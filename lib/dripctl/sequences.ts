/**
 * DripCtl sequence definitions for The Trash Panda.
 *
 * Sequences are defined in code (infra-as-data) and deployed via the admin
 * endpoint. Each sequence is keyed by name — re-deploying replaces the live
 * definition. Templates (e.g. `trash-panda/welcome`) are managed on the DripCtl
 * side; we reference them by slug here.
 */

import { condition, exit, send, sequence, wait } from "@dripctl/sdk";
import type { SequenceDefinition } from "@dripctl/sdk";

const onboarding = sequence("trash-panda-onboarding", {
  trigger: "user.signup",
  steps: [
    send("welcome", {
      template: "trash-panda/welcome",
      subject: "Welcome to The Trash Panda 🦝"
    }),
    wait("3d"),
    send("whats-near-you", {
      template: "trash-panda/whats-near-you",
      subject: "Fresh finds near you"
    }),
    wait("5d"),
    send("list-your-first-item", {
      template: "trash-panda/list-your-first-item",
      subject: "Got something to share?"
    })
  ]
});

const newListingAlert = sequence("new-listing-alert", {
  trigger: "listing.created",
  steps: [
    send("notify-followers", {
      template: "trash-panda/new-listing",
      subject: "A producer you follow just listed something"
    })
  ]
});

const freshnessNudge = sequence("freshness-nudge", {
  trigger: "listing.stale",
  steps: [
    send("is-this-still-available", {
      template: "trash-panda/freshness-check",
      subject: "Is this still available?"
    }),
    wait("3d"),
    condition("listing.updated", {
      yes: exit("listing-refreshed"),
      no: send("listing-expired-soon", {
        template: "trash-panda/listing-expiring",
        subject: "Your listing is about to expire"
      })
    })
  ]
});

const producerReengagement = sequence("producer-reengagement", {
  trigger: "producer.inactive",
  steps: [
    send("neighbours-miss-you", {
      template: "trash-panda/reengagement",
      subject: "Your neighbours miss you"
    }),
    wait("7d"),
    condition("listing.created", {
      yes: exit("producer-returned"),
      no: [
        send("last-chance", {
          template: "trash-panda/last-chance",
          subject: "One last nudge"
        }),
        exit("reengagement-complete")
      ]
    })
  ]
});

const weeklyDigest = sequence("weekly-digest", {
  trigger: "digest.weekly",
  steps: [
    send("weekly-summary", {
      template: "trash-panda/weekly-digest",
      subject: "This week on The Trash Panda"
    })
  ]
});

const followConfirmation = sequence("follow-confirmation", {
  trigger: "follow.created",
  steps: [
    send("following-confirmed", {
      template: "trash-panda/follow-confirmation",
      subject: "You're now following a new producer"
    })
  ]
});

export const sequences: SequenceDefinition[] = [
  onboarding,
  newListingAlert,
  freshnessNudge,
  producerReengagement,
  weeklyDigest,
  followConfirmation
];
