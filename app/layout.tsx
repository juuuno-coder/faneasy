import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import GoogleAnalytics from "@/components/google-analytics";

export const metadata: Metadata = {
  title: "FanEasy | No.1 Creator Platform",
  description: "Next Generation Platform for Creators and Fans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics GA_MEASUREMENT_ID="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}
