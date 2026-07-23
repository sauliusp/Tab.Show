import type { Metadata } from "next";
import { AnalyticsConsent } from "./analytics-consent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tab.show"),
  title: {
    default: "TabShow — Live Tab Preview for Chrome",
    template: "%s | TabShow",
  },
  description:
    "Find the right Chrome tab before you switch. Search or point at a tab, preview the live page, then switch or snap back.",
  applicationName: "TabShow",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "TabShow",
    images: [{ url: "/images/tabshow-social-card.png", width: 1200, height: 630, alt: "TabShow live tab preview for Chrome" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/tabshow-social-card.png"],
  },
  icons: { icon: "/icon.png", shortcut: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
