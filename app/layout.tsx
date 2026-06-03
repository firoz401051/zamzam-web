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
  title: {
    template: "%s - Zam Zam Fashion store",
    default: "Zam Zam Fashion store",
  },
  description: "Zam Zam Fashion store, Your one stop shop for all your needs",
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
