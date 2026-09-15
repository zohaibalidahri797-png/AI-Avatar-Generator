import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SiteChrome from "@/components/layout/SiteChrome";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Free AI Avatar Generator — Create AI Avatars, PFPs & Headshots | AvatarForge",
    template: "%s | AvatarForge",
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  manifest: "/manifest.json",
  authors: [{ name: `${site.name} Team` }],
  creator: site.name,
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Free AI Avatar Generator — Create AI Avatars, PFPs & Headshots",
    description: site.description,
    url: site.url,
    siteName: site.fullName,
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1344,
        height: 768,
        alt: "AvatarForge — Free AI Avatar Generator with realistic, anime, cartoon, 3D and gaming avatar styles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Avatar Generator — AvatarForge",
    description: site.description,
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9fe" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1522" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.fullName,
  url: site.url,
  logo: `${site.url}/icon-192.png`,
  description: site.description,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.fullName,
  url: site.url,
  description: site.description,
  applicationCategory: "MultimediaApplication",
};

/**
 * Legacy-hash URL migration, executed before hydration.
 *
 * Old links of the form `/#/ai-avatar-generator` or `/#/gallery?fav=1` can
 * never reach the server (the fragment is client-side only), so they land on
 * `/` with a hash fragment. This inline script — which runs synchronously
 * during HTML parsing, before React hydrates and in every runtime (Node dev,
 * `next start`, Cloudflare Workers) — rewrites them once to the real,
 * crawlable path with location.replace() (no history entry, no loop).
 */
const legacyHashRedirectScript = `try{(function(){
var h=location.hash;
if(h.indexOf("#/")!==0)return;
var t=h.slice(1);
var q=t.indexOf("?");
var path=q>-1?t.slice(0,q):t;
var query=q>-1?t.slice(q+1):"";
path=path.replace(/\\/+$/,"");
if(path==="")path="/";
var last=path.slice(path.lastIndexOf("/")+1);
if(!/\\.[a-z0-9]+$/i.test(last)&&path!=="/")path+="/";
location.replace(location.origin+path+(query?"?"+query:""));
}());}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          id="legacy-hash-redirect"
          dangerouslySetInnerHTML={{ __html: legacyHashRedirectScript }}
        />
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
