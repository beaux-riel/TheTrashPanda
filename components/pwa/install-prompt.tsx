"use client";

import { useEffect, useState } from "react";

import { BanditIllustration } from "@/components/brand/bandit-illustration";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "thetrashpanda.install.dismissed";

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "true";
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    if (dismissed || standalone) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!visible || !installEvent) {
    return null;
  }

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setVisible(false);
      setInstallEvent(null);
      return;
    }

    dismiss();
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-auto mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,252,247,0.96),rgba(232,223,211,0.92))] p-5 shadow-card backdrop-blur">
        <div className="relative flex flex-col gap-4 pr-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">PWA install</p>
            <h3 className="font-display text-3xl text-[var(--ink)]">Add The Trash Panda to your home screen</h3>
            <p className="max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
              Open the map faster, catch local food sooner, and give Bandit a suspiciously permanent place on your phone.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={dismiss} variant="secondary">
              Maybe later
            </Button>
            <Button onClick={() => void install()}>Install</Button>
          </div>
          <div className="absolute -bottom-7 right-0 w-24 sm:w-28">
            <BanditIllustration variant="onboarding" className="max-w-[112px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
