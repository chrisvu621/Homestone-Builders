import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { MobileCallBar } from "@/components/MobileCallBar";
import { businessJsonLd } from "@/lib/seo";
import { getSiteUrl, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Homestone Builders Inc. | Kitchen, Bath & ADU Contractor in Orange County",
    template: "%s | Homestone Builders Inc.",
  },
  description: `Licensed California general contractor (CSLB #${site.licenseNumber}) for kitchen and bathroom remodeling, ADUs, new homes, windows, doors and shower doors in Garden Grove and nearby Orange County cities. Call ${site.phone.display}.`,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCallBar />
        <JsonLd data={businessJsonLd()} />
      </body>
    </html>
  );
}
