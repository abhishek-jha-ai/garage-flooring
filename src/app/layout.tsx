import type { Metadata, Viewport } from "next";
import { Archivo, Cinzel, Inter } from "next/font/google";
import { demoMode, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel", display: "swap" });

const title = `${site.name} | Epoxy & Polyaspartic Floor Coatings in Bradenton, FL`;
const description =
  "Garage floors, pool decks, patios, driveways and commercial floor coatings in Bradenton, Sarasota & surrounding areas. Family owned, BBB accredited, 5.0 rating from 148 reviews. Get a free estimate.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  title,
  description,
  applicationName: site.name,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    siteName: site.name,
    images: [{ url: "/images/projects/garage-showroom.jpg", width: 1672, height: 941, alt: "Titan Garage Flooring showroom garage" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/projects/garage-showroom.jpg"] },
  // Concept builds stay out of search so they never compete with the live site.
  robots: demoMode ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  telephone: "+1-941-800-1997",
  email: site.email,
  url: site.url,
  image: "/images/projects/garage-showroom.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: "US",
  },
  areaServed: site.areas.map((name) => ({ "@type": "City", name })),
  sameAs: [site.social.instagram, site.social.facebook],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${cinzel.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
