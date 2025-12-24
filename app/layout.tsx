import type { Metadata } from "next";
import "./globals.css";
import AuthInitializer from "@/components/auth-initializer";
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
    <html lang="ko">
      <body className="antialiased">
        <AuthInitializer />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-XXXXXXXXXX" />
        <Toaster position="top-right" />
        <script src="https://cdn.iamport.kr/v1/iamport.js" async />
        {children}
      </body>
    </html>
  );
}

