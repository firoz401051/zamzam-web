import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";
import CurrencyChangeNotifier from "@/components/CurrencyChangeNotifier";
import Script from "next/script"; // ✅ ADD THIS

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
   metadataBase: new URL("https://www.zamzamfashionstore.in"),
  title: {
    template: "%s | Zam Zam Fashion Store",
    default: "Zam Zam Fashion Store",
  },

  description:
    "Shop premium sarees, shervani, dress Materials, lehenga, lancha ,kids wear, footwear, purses, bags, accessories, tamil fashion, burkhas, abayas and fashion collections at Zam Zam Fashion Store.",

  keywords: [
    "sarees",
    "burkha",
    "abaya",
    "fashion store",
    "shervani",
    "dress Materials",
    "lehenga",
    "lancha",
    "kids wear",
    "footwear",
    "purses",
    "bags",
    "accessories",
    "tamil fashion",
    "designer sarees",
    "women fashion",
    "zam zam fashion store",
  ],

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
  canonical: "/",
},
};

const RootLayout = async ({ children }: { children: React.React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={poppins.variable}>
        <body className="font-sans antialiased">

          {/* ✅ Razorpay Checkout Script */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />

          {children}
          <CurrencyChangeNotifier />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-zamzam-text-dark)",
                color: "var(--color-zamzam-white)",
                border: "1px solid var(--color-zamzam-primary)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-family-sans)",
              },
              success: {
                style: {
                  background: "var(--color-zamzam-primary)",
                  color: "var(--color-zamzam-white)",
                  border: "1px solid var(--color-zamzam-primary-hover)",
                },
              },
              error: {
                style: {
                  background: "var(--color-destructive)",
                  color: "var(--color-zamzam-white)",
                  border: "1px solid var(--color-destructive)",
                },
              },
            }}
          />

          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
