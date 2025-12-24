import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/auth-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import GoogleAnalytics from "@/components/google-analytics";
import { Toaster } from 'react-hot-toast';

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
        <AuthInitializer />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-XXXXXXXXXX" />
        <Toaster position="top-right" />
        <script src="https://cdn.iamport.kr/v1/iamport.js" async />
        {children}
      </body>
    </html>
  );
}
