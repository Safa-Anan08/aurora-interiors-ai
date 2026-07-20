
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { GoogleOAuthWrapper } from "./GoogleOAuthWrapper";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurora Interiors AI - Virtual Design Studio & Marketplace",
  description: "Transform your living space instantly with AI-powered interior visualization, custom style presets, and professional designer consultations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-gray-100 dark:text-gray-100 relative`}>
        {/* Animated Aurora Ambient Glow */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-orb-1" />
          <div className="aurora-orb-2" />
        </div>

        {/* Content Layer with Query, Theme, Auth, Cart, and Toast providers */}
        <GoogleOAuthWrapper>
          <Providers>
            <div className="relative z-10 flex flex-col min-h-screen">
              {children}
            </div>
          </Providers>
        </GoogleOAuthWrapper>
      </body>
    </html>
  );
}
