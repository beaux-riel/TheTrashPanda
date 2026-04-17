import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CelebrationToast } from "@/components/layout/celebration-toast";
import { DemoDataBanner } from "@/components/layout/demo-data-banner";
import { PermissionBanner } from "@/components/layout/permission-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { HarvestLinkProvider } from "@/components/providers/harvestlink-provider";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { getSeasonFromDate } from "@/lib/utils/season";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thetrashpanda.ca"),
  title: {
    default: "The Trash Panda",
    template: "%s | The Trash Panda"
  },
  description:
    "The Trash Panda is a community food network for Powell River, BC. Follow producers, catch fresh listings, and keep local food moving neighbour to neighbour.",
  openGraph: {
    title: "The Trash Panda",
    description:
      "Follow Powell River producers, catch fresh listings, and keep the local food loop weird, warm, and useful.",
    type: "website",
    locale: "en_CA"
  },
  appleWebApp: {
    capable: true,
    title: "The Trash Panda"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const season = getSeasonFromDate();

  return (
    <html data-season={season} lang="en">
      <body>
        <AuthProvider>
          <HarvestLinkProvider>
            <SiteHeader />
            <div className="space-y-3 px-4 py-4 sm:px-6 lg:px-8">
              <DemoDataBanner />
              <PermissionBanner />
            </div>
            <main className="mx-auto flex min-h-[calc(100vh-180px)] max-w-7xl flex-col gap-8 px-4 pb-20 sm:px-6 lg:px-8">
              {children}
            </main>
            <SiteFooter />
            <InstallPrompt />
            <CelebrationToast />
          </HarvestLinkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
