"use client";
import { Search, X, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/image";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Add custom animation styles
  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = `
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeOutScale {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
          }
        }
        
        /* Overlay fade animation */
        [data-radix-dialog-overlay] {
          animation: fadeIn 0.15s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  // Fetch suggested/trending products
  const fetchSuggestedProducts = async () => {
    try {
      const query = `*[_type == "product" && defined(categories[0])] {
        _id,
        name,
        price,
        salePrice,
        images,
        slug,
        categories[]->{title}
      } | order(_createdAt desc)[0...8]`;
      const response = await client.fetch(query);
      setSuggestedProducts(response);
    } catch (error) {
      console.error("Error fetching suggested products:", error);
    }
  };

  // Load suggested products on mount
  useEffect(() => {
    fetchSuggestedProducts();
  }, []);

  // Enhanced fetch products with better search logic
  const fetchProducts = async (searchTerm: string) => {
    if (!searchTerm) {
      setProducts([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Search queries
      const productNameQuery = `*[_type == "product" && name match $search] {
        _id,
        name,
        price,
        salePrice,
        images,
        slug,
        categories[]->{title}
      } | order(name asc)[0...20]`;
      const categoryQuery = `*[_type == "product" && categories[]->title match $search] {
        _id,
        name,
        price,
        salePrice,
        images,
        slug,
        categories[]->{title}
      } | order(name asc)[0...20]`;
      const descriptionQuery = `*[_type == "product" && (description match $search || shortDescription match $search)] {
        _id,
        name,
        price,
        salePrice,
        images,
        slug,
        categories[]->{title}
      } | order(name asc)[0...20]`;

      const params = { search: `${searchTerm}*` };

      // Execute searches in priority order
      const [productResults, categoryResults, descriptionResults] =
        await Promise.all([
          client.fetch(productNameQuery, params),
          client.fetch(categoryQuery, params),
          client.fetch(descriptionQuery, params),
        ]);

      // Combine results with product name matches first
      const allResults = [
        ...productResults,
        ...categoryResults.filter(
          (item: Product) =>
            !productResults.some((p: Product) => p._id === item._id)
        ),
        ...descriptionResults.filter(
          (item: Product) =>
            !productResults.some((p: Product) => p._id === item._id) &&
            !categoryResults.some((c: Product) => c._id === item._id)
        ),
      ];

      setProducts(allResults.slice(0, 20));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  // Keyboard shortcut handler for Command+K and Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setShowSearch(true);
      }
      if (event.key === "Escape" && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch("");
    setProducts([]);
    setLoading(false);
    setHasSearched(false);
  };

  const handleProductClick = () => {
    setSearch("");
    setProducts([]);
    setShowSearch(false);
  };
  return (
    <>
      {/* Search trigger button */}
      <Button
        variant="outline"
        className="hidden lg:inline-flex flex-1 h-10 max-w-lg justify-start text-sm text-muted-foreground relative"
        onClick={() => setShowSearch(true)}
      >
        <Search className="h-4 w-4 mr-1" />
        <span className="text-xs">Search products here...</span>
        <kbd className="pointer-events-none absolute right-0 -top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <button
        className="inline-flex lg:hidden border p-2 rounded-md hover:border-zamzam-primary hover:text-zamzam-primary hoverEffect"
        onClick={() => setShowSearch(true)}
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Search Modal */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent
          className="max-w-4xl w-[90vw] min-h-[80vh] max-h-[90vh] p-0 flex flex-col border-0 shadow-2xl"
          style={{
            animation: showSearch
              ? "fadeInScale 0.15s cubic-bezier(0.16, 1, 0.3, 1)"
              : "fadeOutScale 0.1s ease-in",
          }}
        >
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg font-semibold">
              Search Products
            </DialogTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products here..."
                className="pl-10 pr-10"
                value={search}
                onChange={handleSearchChange}
                autoFocus
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="border-t border-border/50"></div>
          <ScrollArea className="flex-1 min-h-0 max-h-[calc(80vh-100px)] relative scroll-smooth overflow-y-auto">
            <div className="px-6 min-h-[400px] pb-8">
              {search ? (
                // Show search results or loading when user has typed something
                loading ? (
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="flex items-end space-x-1">
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{
                            animationDelay: "0ms",
                            animationDuration: "0.6s",
                            animationIterationCount: "infinite",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{
                            animationDelay: "200ms",
                            animationDuration: "0.6s",
                            animationIterationCount: "infinite",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{
                            animationDelay: "400ms",
                            animationDuration: "0.6s",
                            animationIterationCount: "infinite",
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Searching for &quot;{search}&quot;...
                    </p>
                  </div>
                ) : products?.length > 0 ? (
                  <div className="space-y-1 max-h-full overflow-y-auto">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center sticky top-0 bg-background py-2 z-10">
                      <Search className="h-4 w-4 mr-2" />
                      Search Results ({products.length})
                    </h3>
                    <div className="space-y-2">
                      {products?.map((item: Product) => (
                        <Link
                          key={item?._id}
                          href={`/products/${item?.slug?.current}`}
                          onClick={handleProductClick}
                          className="flex items-center gap-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border"
                        >
                          <div className="bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item?.images?.[0] ? (
                              <Image
                                src={urlFor(item.images[0]).url()}
                                alt={item.name || "Product"}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Search className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 px-2">
                            <p className="text-base line-clamp-2 font-medium text-foreground">
                              {item?.name}
                            </p>
                            {item?.categories?.[0] &&
                              "title" in item.categories[0] && (
                                <p className="text-sm text-muted-foreground">
                                  in {(item.categories[0] as any).title}
                                </p>
                              )}
                          </div>
                          {(item?.salePrice || item?.price) && (
                            <span className="text-sm font-semibold text-primary shrink-0">
                              ${item?.salePrice || item?.price}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : hasSearched ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-base text-foreground mb-1">
                      No products found for{" "}
                      <span className="font-semibold">
                        &quot;{search}&quot;
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try searching for something else
                    </p>
                  </div>
                ) : null
              ) : (
                // Show suggested/trending products when search is empty
                suggestedProducts?.length > 0 && (
                  <div className="space-y-1 max-h-full overflow-y-auto">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center sticky top-0 bg-background py-2 z-10">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trending Products
                    </h3>
                    <div className="space-y-2">
                      {suggestedProducts?.slice(0, 8).map((item: Product) => (
                        <Link
                          key={item?._id}
                          href={`/products/${item?.slug?.current}`}
                          onClick={handleProductClick}
                          className="flex items-center gap-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border"
                        >
                          <div className="w-6 h-6 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 px-2">
                            <p className="text-base font-medium text-foreground line-clamp-2">
                              {item?.name}
                            </p>
                            {item?.categories?.[0] &&
                              "title" in item.categories[0] && (
                                <p className="text-sm text-muted-foreground">
                                  Trending in{" "}
                                  {(item.categories[0] as any).title}
                                </p>
                              )}
                          </div>
                          {(item?.salePrice || item?.price) && (
                            <span className="text-sm font-semibold text-primary flex-shrink-0">
                              ${item?.salePrice || item?.price}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
