"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import SearchBar from "./ClientOnlySearchBar";
import CartIcon from "./CartIcon";
import UserDropdown from "./UserDropdown";

interface Props {
  ordersCount: number;
}

const HeaderUserSection = ({ ordersCount }: Props) => {
  // ✅ Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Render stable placeholder until mounted
  if (!mounted) {
    return (
      <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
      {/* Search + Cart */}
      <SearchBar />
      <CartIcon />

      {/* Clerk Auth UI */}
      <ClerkLoading>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignedIn>
          <UserDropdown ordersCount={ordersCount} />
        </SignedIn>

        <SignedOut>
  <div className="hidden md:flex items-center gap-3">
    <Link
      href="/sign-in"
      className="text-sm font-semibold hover:text-zamzam-text-dark"
    >
      Login
    </Link>

    <Link
      href="/sign-up"
      className="text-sm font-semibold bg-zamzam-primary-dark text-white px-4 py-2 rounded-md hover:bg-zamzam-primary-hover"
    >
      Sign Up
    </Link>
  </div>
</SignedOut>
      </ClerkLoaded>
    </div>
  );
};

export default HeaderUserSection;
