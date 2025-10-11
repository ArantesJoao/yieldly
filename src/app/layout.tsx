import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/navbar";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#fcfcf5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "overlays-content",
};

export const metadata: Metadata = {
  title: "Yieldly",
  description: "Personal Investment Tracker",
  applicationName: "Yieldly",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yieldly",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Yieldly",
    title: "Yieldly - Personal Investment Tracker",
    description: "Track your personal investments and yields with ease",
  },
  twitter: {
    card: "summary",
    title: "Yieldly - Personal Investment Tracker",
    description: "Track your personal investments and yields with ease",
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/web-app-manifest-192x192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* !important is used to override the drawer styles */}
      <body
        className={`${openSans.variable} mt-22 md:mt-24 max-w-3xl mx-auto antialiased px-4.5!`}
      >
        <Toaster />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
