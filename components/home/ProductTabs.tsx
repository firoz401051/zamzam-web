"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "../ProductCard";
import Title from "../Title";
import Container from "../Container";
import Link from "next/link";
import { fetchProductsBySegment } from "@/app/actions/product";
import { motion, AnimatePresence } from "framer-motion";

interface ProductTabsProps {
  products?: any[];
}

const ProductTabs: React.FC<ProductTabsProps> = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState("new-arrival");
  const [currentProducts, setCurrentProducts] = useState<any[]>(products);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial fetch for "new-arrival" if not passed or ensure it's up to date
  // But usually we rely on initial props. When changing tabs we fetch.

  const handleTabChange = async (tabId: string) => {
    if (tabId === activeTab) return;

    setIsLoading(true);
    setActiveTab(tabId);
    
    try {
       const newProducts = await fetchProductsBySegment(tabId, 10);
       setCurrentProducts(newProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setCurrentProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabChange(tabId);
    }
  };

  const handleDropdownSelect = (tabId: string) => {
    handleTabChange(tabId);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: "new-arrival", label: "New Arrival" },
    { id: "best-seller", label: "Best Sellers" },
    { id: "featured", label: "Featured" },
    { id: "special-offer", label: "Special Offer" },
    { id: "editors-choice", label: "Editor's Choice" },
    { id: "trending", label: "Trending" },
    { id: "limited-edition", label: "Limited Edition" },
    { id: "exclusive", label: "Exclusive" },
  ];

  return (
    <div className="py-16 bg-white">
      <Container>
        <Title className="text-center mb-8">Exclusive Products</Title>

        {/* Tabs */}
        <div className="mb-10">
          {/* Mobile: Combobox Dropdown */}
          <div className="block md:hidden">
            <div ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-zamzam-primary/30 focus:outline-none focus:ring-2 focus:ring-zamzam-primary focus:border-zamzam-primary transition-all duration-200"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="font-medium text-gray-700">
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
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

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleDropdownSelect(tab.id)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150 ${
                          activeTab === tab.id
                            ? "bg-zamzam-primary/5 text-zamzam-primary font-medium border-r-2 border-zamzam-primary"
                            : "text-gray-700"
                        } ${tab.id === tabs[tabs.length - 1].id ? "" : "border-b border-gray-100"}`}
                        role="option"
                        aria-selected={activeTab === tab.id}
                      >
                        <span className="flex items-center justify-between">
                          {tab.label}
                          {activeTab === tab.id && (
                            <svg
                              className="w-4 h-4 text-zamzam-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                                />
                            </svg>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Centered flex layout */}
          <div className="hidden sm:block">
            <div className="flex justify-center gap-3 max-w-6xl mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  className={`tab-button group relative px-2.5 py-2 rounded-lg font-medium transition-all duration-300 ease-out hover:cursor-pointer transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zamzam-primary focus:ring-offset-2 active:scale-95 ${
                    activeTab === tab.id
                      ? "bg-zamzam-primary text-white shadow-lg shadow-zamzam-primary/25 scale-105"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-zamzam-primary/30 hover:bg-zamzam-primary/5 hover:text-zamzam-primary hover:shadow-md"
                  }`}
                >
                  <span className="relative z-10 whitespace-nowrap text-sm">
                    {tab.label}
                  </span>

                  {/* Active indicator line */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full opacity-80" />
                  )}

                  {/* Background animation */}
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-zamzam-primary to-zamzam-primary/80"
                        : "bg-gradient-to-r from-transparent to-transparent group-hover:from-zamzam-primary/5 group-hover:to-zamzam-primary/10"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Active tab indicator text */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-zamzam-primary">
                {currentProducts.length}
              </span>{" "}
              products in{" "}
              <span className="font-semibold">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="min-h-[400px]" 
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
               <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
               >
                 {/* Loading skeleton */}
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : currentProducts.length > 0 ? (
               <motion.div
                key={activeTab}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
               >
                 {currentProducts.map((product, index) => (
                    <motion.div
                        key={product._id || index}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: index * 0.05 }}
                    >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
               </motion.div>
            ) : (
                <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center py-12"
                 >
                 <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <p className="text-zamzam-text-muted text-lg font-medium mb-2">
                      No products available
                    </p>
                    <p className="text-zamzam-text-muted/70 text-sm">
                        {`No products found in ${tabs.find((t) => t.id === activeTab)?.label} category.`}
                    </p>
                  </div>
                </motion.div>
            )}
           </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href={"/products"}>
            <Button
              variant="outline"
              className="px-8 py-3 font-medium bg-white text-zamzam-text-muted border-gray-200 hover:bg-zamzam-primary hover:text-white hover:border-zamzam-primary transition-all duration-300 ease-in-out hover:shadow-md hover:scale-105"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default ProductTabs;
