"use client";

import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Globe, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useCartStore from "@/store";
import { useCurrencyUpdater } from "@/hooks";
import Container from "../Container";

interface TopBarProps {
  phoneNumber: string;
  emailAddress: string;
  companyAddress: string;
}

const TopBar = ({ phoneNumber, emailAddress, companyAddress }: TopBarProps) => {
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isLanguagePopoverOpen, setIsLanguagePopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    selectedCurrency,
    currencies,
    setCurrency,
    isUpdatingRates,
    lastRateUpdate,
  } = useCartStore();
  const { updateExchangeRates } = useCurrencyUpdater();
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-zamzam-text-dark text-white text-sm py-2">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{phoneNumber}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{emailAddress}</span>
              </div>
              <div className="hidden xl:flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{companyAddress}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span className="text-xs">English</span>
                </div>
                <span className="text-xs">USD</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span>Compare</span>
                <span>Wishlist</span>
                <span>Login</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="bg-zamzam-text-dark text-white text-sm py-2">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Left side - Contact info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{phoneNumber}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{emailAddress}</span>
            </div>
            <div className="hidden xl:flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{companyAddress}</span>
            </div>
          </div>

          {/* Right side - Language/Currency & Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <Popover
                  open={isLanguagePopoverOpen}
                  onOpenChange={setIsLanguagePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button className="bg-transparent border-none text-xs hover:bg-white/10 px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1">
                      English
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-40 p-1 max-h-64 overflow-y-auto"
                    align="start"
                  >
                    <div className="space-y-1">
                      <div className="px-2 py-1.5 text-xs font-medium bg-zamzam-primary/10 text-zamzam-primary rounded cursor-default flex items-center justify-between">
                        <span>🇺🇸 English</span>
                        <span>✓</span>
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇪🇸 Spanish (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇫🇷 French (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇩🇪 German (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇧🇩 Bengali (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇮🇳 Hindi (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇵🇰 Urdu (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇨🇳 Chinese (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇯🇵 Japanese (Coming Soon)
                      </div>
                      <div className="px-2 py-1.5 text-xs text-zamzam-text-muted cursor-not-allowed opacity-50 rounded hover:bg-gray-50">
                        🇰🇷 Korean (Coming Soon)
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Currency Selector */}
              <Popover
                open={isCurrencyPopoverOpen}
                onOpenChange={setIsCurrencyPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button className="bg-transparent border-none text-xs hover:bg-white/10 px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1">
                    {selectedCurrency.flag} {selectedCurrency.code}
                    {isUpdatingRates && (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    )}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 p-2 max-h-80 overflow-y-auto"
                  align="start"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span className="text-xs font-medium text-zamzam-text-dark">
                        Select Currency
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            await updateExchangeRates();
                          } catch (error) {
                            console.error("Failed to update rates:", error);
                          }
                        }}
                        disabled={isUpdatingRates}
                        className="flex items-center gap-1 text-xs text-zamzam-primary hover:text-zamzam-primary-dark disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${
                            isUpdatingRates ? "animate-spin" : ""
                          }`}
                        />
                        {isUpdatingRates ? "Updating..." : "Refresh"}
                      </button>
                    </div>

                    <div className="space-y-1">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => {
                            setCurrency(currency);
                            setIsCurrencyPopoverOpen(false); // Close the popover after selection
                          }}
                          className={`w-full px-2 py-2 text-xs text-left rounded transition-colors duration-200 flex items-center justify-between ${
                            currency.code === selectedCurrency.code
                              ? "font-medium bg-zamzam-primary/10 text-zamzam-primary cursor-default"
                              : "text-zamzam-text-muted hover:bg-gray-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {currency.flag} {currency.code} - {currency.name}
                            </span>
                            <span className="text-xs opacity-70">
                              Rate: {currency.rate.toFixed(4)}
                            </span>
                          </div>
                          {currency.code === selectedCurrency.code && (
                            <span className="text-green-500">✓</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {mounted && lastRateUpdate && (
  <div className="pt-2 border-t text-xs text-zamzam-text-muted">
    Last updated: {new Date(lastRateUpdate).toLocaleTimeString()}
  </div>
)}

                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Link
                href="/compare"
                className="hover:text-zamzam-primary-light transition-colors duration-200"
              >
                Compare
              </Link>
              <Link
                href="/wishlist"
                className="hover:text-zamzam-primary-light transition-colors duration-200"
              >
                Wishlist
              </Link>
              {user ? (
                <Link
                  href="/user/dashboard"
                  className="hover:text-zamzam-primary-light transition-colors duration-200"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="hover:text-zamzam-primary-light transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
