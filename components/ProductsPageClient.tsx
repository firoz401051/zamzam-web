"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ALL_PRODUCTS_QUERYResult, BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import {
  Grid,
  List,
  Search,
  X,
  Filter,
  Loader2,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Custom Components
import ProductCard from "@/components/ProductCard";
import NoProductAvailable from "@/components/common/NoProductAvailable";
import CategoryList from "@/components/shopPage/CategoryList";
import BrandList from "@/components/shopPage/BrandList";
import PriceList from "@/components/shopPage/PriceList";
import ProductSkeleton from "@/components/ProductSkeleton";

interface ProductsPageClientProps {
  initialProducts: ALL_PRODUCTS_QUERYResult | Product[];
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

type ViewMode = "grid" | "list";
type SortOption = "newest" | "price-low" | "price-high" | "popular";

const PRODUCTS_PER_PAGE = 16;

// Loading dots component
// Loading dots component removed in favor of ProductSkeleton

const ProductsPageClient = ({
  initialProducts,
  categories,
  brands,
}: ProductsPageClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const observerTarget = useRef<HTMLDivElement>(null);

  // URL params
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const priceParams = searchParams?.get("price");
  const searchQuery = searchParams?.get("search") || "";
  const sortParam = (searchParams?.get("sort") as SortOption) || "newest";

  // State
  const [products, setProducts] = useState<Product[] | ALL_PRODUCTS_QUERYResult>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [totalProductsLoaded, setTotalProductsLoaded] = useState(
    initialProducts.length
  );
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(
    priceParams || null
  );
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);

  // Update URL when filters change
  const updateURL = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
      });

      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    },
    [router, pathname]
  );

  // Build Sanity query
  const buildQuery = useCallback(
    (
      category: string | null,
      brand: string | null,
      price: string | null,
      search: string,
      sort: SortOption,
      offset: number,
      limit: number
    ) => {
      let query = `*[_type == "product" && !(_id in path("drafts.**"))`;
      const params: Record<string, unknown> = {};

      // Add filters
      if (category) {
        query += ` && references(*[_type=="category" && slug.current == $category]._id)`;
        params.category = category;
      }

      if (brand) {
        query += ` && brand->slug.current == $brand`;
        params.brand = brand;
      }

      if (search) {
        query += ` && (name match $search || description match $search)`;
        params.search = `*${search}*`;
      }

      if (price) {
  const [min, max] = price.split("-").map(Number);

  if (max) {
    query += ` && coalesce(salePrice, price) >= $minPrice
               && coalesce(salePrice, price) <= $maxPrice`;

    params.minPrice = min;
    params.maxPrice = max;
  } else {
    query += ` && coalesce(salePrice, price) >= $minPrice`;

    params.minPrice = min;
  }
}

      query += `]{
        ...,
        "categories": categories[]->title,
        "brand": brand->name
      }`;

      // Add sorting
      let sortClause = "";
      switch (sort) {
        case "price-low":
  sortClause = " | order(coalesce(salePrice, price) asc)";
  break;
        case "price-high":
          sortClause = " | order(price desc)";
          break;
        case "popular":
          sortClause = " | order(stock desc)";
          break;
        case "newest":
        default:
          sortClause = " | order(_createdAt desc)";
          break;
      }

      query += sortClause;
      query += ` [${offset}...${offset + limit}]`;

      params.offset = offset;
      params.limit = limit;

      return { query, params };
    },
    []
  );

  // Fetch products count for total
  const fetchProductsCount = useCallback(
    async (
      category: string | null,
      brand: string | null,
      price: string | null,
      search: string
    ) => {
      try {
        let countQuery = `count(*[_type == "product" && !(_id in path("drafts.**"))`;
        const params: Record<string, unknown> = {};

        if (category) {
          countQuery += ` && references(*[_type=="category" && slug.current == $category]._id)`;
          params.category = category;
        }

        if (brand) {
          countQuery += ` && brand->slug.current == $brand`;
          params.brand = brand;
        }

        if (search) {
          countQuery += ` && (name match $search || description match $search)`;
          params.search = `*${search}*`;
        }

        if (price) {
          const [min, max] = price.split("-").map(Number);
          if (max) {
            countQuery += ` && coalesce(salePrice, price) >= $minPrice
                && coalesce(salePrice, price) <= $maxPrice`;
            params.minPrice = min;
            params.maxPrice = max;
          } else {
            countQuery += ` && coalesce(salePrice, price) >= $minPrice`;
            params.minPrice = min;
          }
        }

        countQuery += `])`;

        const total = await client.fetch(countQuery, params);
        setTotalCount(total);
        return total;
      } catch (error) {
        console.error("Error fetching products count:", error);
        return 0;
      }
    },
    []
  );

  // Fetch products with filters
  const fetchProducts = useCallback(
    async (
      category: string | null,
      brand: string | null,
      price: string | null,
      search: string,
      sort: SortOption,
      offset: number = 0,
      append: boolean = false
    ) => {
      if (offset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const { query, params } = buildQuery(
          category,
          brand,
          price,
          search,
          sort,
          offset,
          PRODUCTS_PER_PAGE
        );

        const data = await client.fetch(query, params);

        if (append) {
          setProducts((prev) => [...prev, ...(data || [])]);
          setTotalProductsLoaded((prev) => prev + (data?.length || 0));
        } else {
          setProducts(data || []);
          setTotalProductsLoaded(data?.length || 0);
          // Fetch total count for new search
          await fetchProductsCount(category, brand, price, search);
        }

        // Check if we have more products to load
        const hasMoreProducts = data && data.length === PRODUCTS_PER_PAGE;
        setHasMore(!!hasMoreProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (!append) {
          setProducts([]);
          setTotalProductsLoaded(0);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQuery, fetchProductsCount]
  );

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchProducts(
        selectedCategory,
        selectedBrand,
        selectedPrice,
        searchTerm,
        sortBy,
        totalProductsLoaded,
        true
      );
    }
  }, [
    loadingMore,
    hasMore,
    fetchProducts,
    selectedCategory,
    selectedBrand,
    selectedPrice,
    searchTerm,
    sortBy,
    totalProductsLoaded,
  ]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMoreProducts]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(
      selectedCategory,
      selectedBrand,
      selectedPrice,
      searchTerm,
      sortBy,
      0,
      false
    );
  }, [
    selectedCategory,
    selectedBrand,
    selectedPrice,
    searchTerm,
    sortBy,
    fetchProducts,
  ]);

  // Update URL when filters change
  useEffect(() => {
    updateURL({
      category: selectedCategory,
      brand: selectedBrand,
      price: selectedPrice,
      search: searchTerm || null,
      sort: sortBy !== "newest" ? sortBy : null,
    });
  }, [
    selectedCategory,
    selectedBrand,
    selectedPrice,
    searchTerm,
    sortBy,
    updateURL,
  ]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
    setSearchTerm("");
    setSortBy("newest");
  }, []);

  // Active filters count
  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    selectedPrice,
    searchTerm,
  ].filter(Boolean).length;

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[180px] justify-between"
                >
                  {sortBy === "newest" && "Newest First"}
                  {sortBy === "popular" && "Most Popular"}
                  {sortBy === "price-low" && "Price: Low to High"}
                  {sortBy === "price-high" && "Price: High to Low"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-0">
                <div className="space-y-1 p-1">
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "popular", label: "Most Popular" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? "default" : "ghost"}
                      className="w-full justify-start h-8 text-xs"
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* View Mode */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-2 h-5 w-5 p-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                  <BrandList
                    brands={brands}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                  />
                  <PriceList
                    selectedPrice={selectedPrice}
                    setSelectedPrice={setSelectedPrice}
                  />
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Category:{" "}
                {
                  categories.find((c) => c.slug?.current === selectedCategory)
                    ?.title
                }
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                />
              </Badge>
            )}
            {selectedBrand && (
              <Badge variant="secondary" className="gap-1">
                Brand:{" "}
                {brands.find((b) => b.slug?.current === selectedBrand)?.title}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedBrand(null)}
                />
              </Badge>
            )}
            {selectedPrice && (
              <Badge variant="secondary" className="gap-1">
                Price: ${selectedPrice.replace("-", " - $")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedPrice(null)}
                />
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            <div className="space-y-6">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <BrandList
                brands={brands}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
              />
              <PriceList
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
              />
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Products Area */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading ? (
                <span className="animate-pulse">Loading products...</span>
              ) : (
                `Showing ${totalProductsLoaded} ${
                  totalCount !== null ? `of ${totalCount}` : ""
                } products`
              )}
            </div>
          </div>

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} viewMode={viewMode} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product, index: number) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                  >
                    <ProductCard product={product as any} layout={viewMode} />
                  </motion.div>
                ))}
              </div>

              {/* Loading more / End message */}
              <div className="mt-8 flex items-center justify-center">
                {loadingMore ? (
                   <div className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
                      : "space-y-4 w-full"
                  }>
                     {[...Array(4)].map((_, index) => (
                      <ProductSkeleton key={index} viewMode={viewMode} />
                    ))}
                  </div>
                ) : hasMore ? (
                  <div ref={observerTarget} className="h-10" />
                ) : totalProductsLoaded > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>
                      You&apos;ve seen all {totalProductsLoaded} products
                    </span>
                  </motion.div>
                ) : null}
              </div>
            </>
          ) : (
            <NoProductAvailable />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPageClient;
