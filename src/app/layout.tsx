import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yieldly",
  description: "Personal Investment Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} mt-24 antialiased m-4.5`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
