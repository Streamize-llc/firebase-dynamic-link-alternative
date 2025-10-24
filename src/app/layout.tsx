import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/utils/supabase/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEPL - Free Deep Linking for Mobile Apps | Firebase Dynamic Links Alternative",
  description: "Enterprise-grade deep linking without the enterprise price tag. No SDK required, just REST API. Free alternative to Firebase Dynamic Links, AppsFlyer, Adjust, and Branch. Universal Links & App Links support.",
  keywords: [
    "deep linking",
    "mobile deep links",
    "firebase dynamic links alternative",
    "appsflyer alternative",
    "adjust alternative",
    "branch alternative",
    "universal links",
    "app links",
    "mobile attribution",
    "deep link analytics",
    "free deep linking",
    "mobile app linking",
    "custom deep link domain",
    "iOS deep linking",
    "Android deep linking",
  ],
  authors: [{ name: "DEPL" }],
  creator: "DEPL",
  publisher: "DEPL",
  metadataBase: new URL("https://depl.link"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://depl.link",
    siteName: "DEPL",
    title: "DEPL - Free Deep Linking for Mobile Apps",
    description: "Enterprise-grade deep linking without the enterprise price tag. Free alternative to Firebase Dynamic Links, AppsFlyer, Adjust, and Branch. No SDK required.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DEPL - Deep Linking for Mobile Apps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEPL - Free Deep Linking for Mobile Apps",
    description: "Enterprise-grade deep linking without the enterprise price tag. No SDK required, just REST API.",
    images: ["/images/og-image.jpg"],
    creator: "@depl_link",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
