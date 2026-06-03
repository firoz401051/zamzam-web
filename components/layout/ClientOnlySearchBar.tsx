"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";

// Dynamic import with no SSR to prevent hydration mismatch
const SearchBar = dynamic(() => import("./SearchBar"), {
  ssr: false,
  loading: () => (
    <Search className="w-5 h-5 hover:text-zamzam-primary-hover hoverEffect animate-pulse" />
  ),
});

export default SearchBar;
