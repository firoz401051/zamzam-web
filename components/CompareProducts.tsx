"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Search,
  Star,
  Heart,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import { urlFor } from "@/sanity/image";

import { client } from "@/sanity/lib/client";
import useCartStore, { CompareProduct } from "@/store";
import toast from "react-hot-toast";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/sanity.types";
import { RatingStars } from "./product/RatingStars";
import { Skeleton } from "@/components/ui/skeleton";

const CompareProducts = () => {
  const { compareList, addToCompare: addToStore, removeFromCompare } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const FETCH_LIMIT = 15;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async (reset: boolean = false) => {
      if (reset) {
        setProducts([]);
        setHasMore(true);
      }

      setLoading(true);
      try {
        const start = reset ? 0 : products.length;
        const end = start + FETCH_LIMIT;
        
        const searchFilter = debouncedSearchQuery 
          ? `&& (name match "${debouncedSearchQuery}*" || title match "${debouncedSearchQuery}*")`
          : "";

        const query = `*[_type=="product" && status in ["new", "hot", "sale", "active"] ${searchFilter}] | order(name asc)[${start}...${end}]{
          _id,
          name,
          title,
          slug,
          price,
          discount,
          discountedPrice,
          images,
          "description": description[0].children[0].text,
          stock,
          status,
          variant,
          isFeatured,
          rating,
          salesCount,
          weight,
          dimensions,
          material,
          warranty,
          features,
          "categories": categories[]->title,
          "brandName": brand->title,
          "brandRef": brand
        }`;
        
        const result = await client.fetch(query);
        
        if (result.length < FETCH_LIMIT) {
          setHasMore(false);
        }

        if (reset) {
          setProducts(result);
        } else {
          setProducts((prev) => [...prev, ...result]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(true);
  }, [debouncedSearchQuery]);

 



  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const start = products.length;
      const end = start + FETCH_LIMIT;
      
      const searchFilter = debouncedSearchQuery 
        ? `&& (name match "${debouncedSearchQuery}*" || title match "${debouncedSearchQuery}*")`
        : "";

      const query = `*[_type=="product" && status in ["new", "hot", "sale", "active"] ${searchFilter}] | order(name asc)[${start}...${end}]{
          _id,
          name,
          title,
          slug,
          price,
          discount,
          discountedPrice,
          images,
          "description": description[0].children[0].text,
          stock,
          status,
          variant,
          isFeatured,
          rating,
          salesCount,
          weight,
          dimensions,
          material,
          warranty,
          features,
          "categories": categories[]->title,
          "brandName": brand->title,
          "brandRef": brand
      }`;

  
      
      const result = await client.fetch(query);
      
      if (result.length < FETCH_LIMIT) {
        setHasMore(false);
      }

      setProducts((prev) => [...prev, ...result]);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMore();
    }
  };

  const addToCompare = (product: CompareProduct) => {
    if (compareList.find((p) => p._id === product._id)) {
      toast.error("This product is already in your comparison list");
      return;
    }

    if (compareList.length >= 4) {
      toast.error("You can only compare up to 4 products at a time");
      return;
    }

    addToStore(product);
    toast.success("Product added to comparison");
    setShowProductSearch(false);
  };

  // removeFromCompare is now imported from store



  const maxFeatures = Math.max(
    ...compareList.map((p) => p.features?.length || 0)
  );

  const hasWeight = compareList.some((p) => p.weight);
  const hasDimensions = compareList.some((p) => p.dimensions);
  const hasMaterial = compareList.some((p) => p.material);

  return (
    <div className="space-y-6">
      {/* Add Product Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Add Products to Compare
            </h3>
            <p className="text-sm text-gray-600">
              Add up to 4 products to compare side by side
            </p>
          </div>
          <Button
            onClick={() => setShowProductSearch(!showProductSearch)}
            className="bg-zamzam-primary hover:bg-zamzam-primary/90"
            disabled={compareList.length >= 4}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product ({compareList.length}/4)
          </Button>
          <Button
            onClick={() => {
                compareList.forEach(p => removeFromCompare(p._id));
                toast.success("List cleared. Please add products again.");
            }}
            variant="outline"
            className="text-xs text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
          >
            Clear List (Fix Data)
          </Button>
        </div>

        {/* Product Search */}
        {showProductSearch && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zamzam-primary focus:border-transparent"
              />
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto"
              onScroll={handleScroll}
            >
              {loading && products.length === 0 ? (
                 Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                 ))
              ) : products.filter(p => !compareList.find(c => c._id === p._id)).length > 0 ? (
                products
                  .filter(p => !compareList.find(c => c._id === p._id))
                  .map((product: CompareProduct) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-sm cursor-pointer transition-shadow"
                    onClick={() => addToCompare(product)}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images && product.images[0]?.asset ? (
                        <Image
                          src={urlFor(product.images[0]).size(48, 48).url()}
                          alt={product.title || product.name || "Product"}
                          width={48}
                          height={80}
                          className="object-contain rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">IMG</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 line-clamp-2">
                        {product.title || product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <PriceFormatter
                          amount={product.discountedPrice || product.price}
                          className="text-sm font-semibold"
                        />
                        <div className="scale-75 origin-left">
                           <RatingStars rating={product.rating} totalReviews={product.salesCount} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : !loading && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>No products found</p>
                </div>
              )}
              {loading && products.length > 0 && (
                <div className="col-span-full flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zamzam-primary"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {compareList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="mb-4 p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Product Comparison ({compareList.length}{" "}
              {compareList.length === 1 ? "Product" : "Products"})
            </h2>
            <p className="text-sm text-gray-600">
              Compare specifications and features to make the best choice
            </p>
          </div>

          {/* Mobile/Tablet Card Layout */}
          <div className="lg:hidden">
            <div
              className={`grid gap-6 p-6 ${
                compareList.length === 1
                  ? "grid-cols-1"
                  : compareList.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : compareList.length === 3
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {compareList.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-50 rounded-lg p-4 relative"
                >
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Product Header */}
                  <div className="text-center mb-4">
                    <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
                      {product.images && product.images[0]?.asset ? (
                        <Image
                          src={urlFor(product.images[0]).size(96, 96).url()}
                          alt={product.title || product.name || "Product"}
                          width={96}
                          height={96}
                          className="object-contain rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">IMG</span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">
                      {product.title || product.name}
                    </h3>
                    {(product as any).brandName || (product as any).brandRef || product.brand ? (
                      <p className="text-xs text-gray-500 mb-2">
                        {(product as any).brandName || (typeof (product as any).brandRef === 'string' ? (product as any).brandRef : (product as any).brandRef?.title) || "N/A"}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <PriceFormatter
                        amount={product.discountedPrice || product.price || 0}
                        className="text-sm font-semibold"
                      />
                      {product.discount && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details - All Product Information */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        {product.rating ? (
                          <>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {product.rating}
                            </span>
                            {product.reviews && (
                              <span className="text-xs text-gray-500">
                                ({product.reviews})
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">No rating</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Category:
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.categories && product.categories.length > 0
                          ? product.categories[0]
                          : "Uncategorized"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Availability:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock && product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock && product.stock > 0
                          ? `${product.stock} In Stock`
                          : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          product.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : product.status === "hot"
                              ? "bg-red-100 text-red-800"
                              : product.status === "sale"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Type:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                        {product.variant || "General"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Featured:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.isFeatured
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isFeatured ? "Yes" : "No"}
                      </span>
                    </div>

                    {product.salesCount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Sales:
                        </span>
                        <span>{product.salesCount} sold</span>
                      </div>
                    )}

                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Weight:
                        </span>
                        <span>{product.weight}</span>
                      </div>
                    )}

                    {product.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Size:</span>
                        <span>{product.dimensions}</span>
                      </div>
                    )}

                    {product.material && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Material:
                        </span>
                        <span>{product.material}</span>
                      </div>
                    )}

                    {product.warranty && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Warranty:
                        </span>
                        <span>{product.warranty}</span>
                      </div>
                    )}

                    {product.features && product.features.length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium block mb-2">
                          Features:
                        </span>
                        <ul className="space-y-1 text-xs">
                          {product.features
                            .slice(0, 3)
                            .map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {product.description && (
                      <div>
                        <span className="text-gray-600 font-medium block mb-1">
                          Description:
                        </span>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <AddToCartButton product={product as unknown as Product} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full table-fixed min-w-[1000px]">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium text-gray-900 bg-gray-50 w-1/5 align-middle border-r">Product Details</th>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <th key={index} className="p-4 text-center bg-gray-50 w-1/5 align-top border-r last:border-r-0">
                          {product ? (
                            <div className="relative">
                              <button
                                onClick={() => removeFromCompare(product._id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="space-y-3">
                                <div className="w-28 h-40 mx-auto flex items-center justify-center overflow-hidden mb-4">
                                  {product.images && product.images[0]?.asset ? (
                                    <Link href={`/product/${product.slug?.current}`}>
                                      <Image
                                        src={urlFor(product.images[0]).fit("max")
                                          .url()}
                                        alt={product.title || product.name || "Product"}
                                        width={110}
                                        height={110}
                                        className="object-contain rounded-lg w-full h-full"
                                      />
                                    </Link>
                                  ) : (
                                    <span className="text-xs text-gray-500">IMG</span>
                                  )}
                                </div>
                                
                                <div className="mt-2">
                                  <AddToCartButton product={product as unknown as Product} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                               <span className="italic mb-2">Empty Slot</span>
                               <Button 
                                 onClick={() => setShowProductSearch(true)}
                                 variant="outline" 
                                 size="sm"
                                 className="text-xs"
                               >
                                 <Plus className="w-3 h-3 mr-1" /> Add Product
                               </Button>
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Name */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Name
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <Link href={`/product/${product.slug?.current}`} className="block group">
                             <div className="font-medium text-gray-900 group-hover:text-zamzam-primary transition-colors line-clamp-3">
                               {product.title || product.name}
                             </div>
                            </Link>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Price */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Price
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <div className="flex flex-col items-center gap-1">
                              <PriceFormatter
                                amount={product.discountedPrice || product.price || 0}
                                className="font-semibold text-gray-900"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Discount */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Discount
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            product.discount ? (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                -{product.discount}%
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Brand */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Brand
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                 
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span className="text-gray-900 font-medium">
                              {(product as any).brandName || (typeof (product as any).brandRef === 'string' ? (product as any).brandRef : (product as any).brandRef?.title) || "N/A"}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Category
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {product.categories && product.categories.length > 0
                                ? product.categories[0]
                                : "Uncategorized"}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>



                  {/* Rating */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Rating
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <div className="flex justify-center">
                              <RatingStars rating={product.rating} totalReviews={product.reviews} />
                            </div>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Availability */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Availability
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                product.stock && product.stock > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stock && product.stock > 0
                                ? `${product.stock} In Stock`
                                : "Out of Stock"}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>



                  {/* Status */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Status
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                                product.status === "new"
                                  ? "bg-blue-100 text-blue-800"
                                  : product.status === "hot"
                                  ? "bg-red-100 text-red-800"
                                  : product.status === "sale"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.status || "N/A"}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Product Type */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Product Type
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                              {product.variant || "General"}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Featured */}
                   <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Featured
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                product.isFeatured
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.isFeatured ? "Yes" : "No"}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Sales Count */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Sales Count
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span className="text-gray-900">
                              {product.salesCount || 0} sold
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Weight */}
                  {hasWeight && (
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                        Weight
                      </td>
                      {[0, 1, 2, 3].map((index) => {
                        const product = compareList[index];
                        return (
                          <td key={index} className="p-4 text-center border-r last:border-r-0">
                            {product ? (
                              <span className="text-gray-700">
                                {product.weight || "-"}
                              </span>
                            ) : (
                              <span className="text-gray-200">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}

                  {/* Dimensions */}
                  {hasDimensions && (
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                        Dimensions
                      </td>
                      {[0, 1, 2, 3].map((index) => {
                        const product = compareList[index];
                        return (
                          <td key={index} className="p-4 text-center border-r last:border-r-0">
                            {product ? (
                              <span className="text-gray-700">
                                {product.dimensions || "-"}
                              </span>
                            ) : (
                              <span className="text-gray-200">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}

                  {/* Material */}
                  {hasMaterial && (
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                        Material
                      </td>
                      {[0, 1, 2, 3].map((index) => {
                        const product = compareList[index];
                        return (
                          <td key={index} className="p-4 text-center border-r last:border-r-0">
                            {product ? (
                              <span className="text-gray-700">
                                {product.material || "-"}
                              </span>
                            ) : (
                              <span className="text-gray-200">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}

                  {/* Warranty */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Warranty
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0">
                          {product ? (
                            <span className="text-gray-700">
                              1 Year Warranty
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Features */}
                  {maxFeatures > 0 && (
                    <>
                      {Array.from({ length: maxFeatures }, (_, index) => (
                        <tr key={`feature-${index}`} className="border-b">
                          <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                            Feature {index + 1}
                          </td>
                          {[0, 1, 2, 3].map((productIndex) => {
                            const product = compareList[productIndex];
                            return (
                              <td key={productIndex} className="p-4 text-center border-r last:border-r-0">
                                {product ? (
                                  <span className="text-gray-900">
                                    {product.features && product.features[index]
                                      ? product.features[index]
                                      : "N/A"}
                                  </span>
                                ) : (
                                  <span className="text-gray-200">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Description at the end */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50 border-r">
                      Description
                    </td>
                    {[0, 1, 2, 3].map((index) => {
                      const product = compareList[index];
                      return (
                        <td key={index} className="p-4 text-center border-r last:border-r-0 align-top">
                          {product ? (
                           <div className="text-sm text-gray-600 text-left line-clamp-10">
                              {product.description || "No description available."}
                           </div>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Comparison Insights */}
          <div className="p-6 bg-linear-to-r from-blue-50 to-purple-50 border-t">
            <div className="space-y-6">
              {/* Comparison Summary */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Quick Comparison Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div className="bg-green-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        💰
                      </div>
                      <h4 className="font-medium text-green-800">
                        Price Range
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-green-700">
                        Lowest:{" "}
                        <PriceFormatter
                          amount={Math.min(
                            ...compareList.map(
                              (p) => p.discountedPrice || p.price || 0
                            )
                          )}
                          className="font-semibold"
                        />
                      </p>
                      <p className="text-sm text-green-700">
                        Highest:{" "}
                        <PriceFormatter
                          amount={Math.max(
                            ...compareList.map(
                              (p) => p.discountedPrice || p.price || 0
                            )
                          )}
                          className="font-semibold"
                        />
                      </p>
                    </div>
                  </div>

                  {/* Best Rating */}
                  <div className="bg-yellow-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        ⭐
                      </div>
                      <h4 className="font-medium text-yellow-800">Top Rated</h4>
                    </div>
                    <div className="space-y-1">
                      {(() => {
                        const bestRated = compareList.reduce((best, current) =>
                          (current.rating || 0) > (best.rating || 0)
                            ? current
                            : best
                        );
                        return (
                          <div>
                            <p className="text-sm text-yellow-700 font-medium truncate">
                              {bestRated.title || bestRated.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-yellow-700">
                                {bestRated.rating || "N/A"}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Most Popular */}
                  <div className="bg-purple-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        🔥
                      </div>
                      <h4 className="font-medium text-purple-800">
                        Most Popular
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {(() => {
                        const mostPopular = compareList.reduce(
                          (best, current) =>
                            (current.salesCount || 0) > (best.salesCount || 0)
                              ? current
                              : best
                        );
                        return (
                          <div>
                            <p className="text-sm text-purple-700 font-medium truncate">
                              {mostPopular.title || mostPopular.name}
                            </p>
                            <p className="text-sm text-purple-700">
                              {mostPopular.salesCount || 0} sold
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Best Value */}
                  <div className="bg-blue-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        💎
                      </div>
                      <h4 className="font-medium text-blue-800">Best Value</h4>
                    </div>
                    <div className="space-y-1">
                      {(() => {
                        const bestValue = compareList.reduce(
                          (best, current) => {
                            const currentScore =
                              ((current.rating || 0) * 100) /
                              (current.discountedPrice || current.price || 1);
                            const bestScore =
                              ((best.rating || 0) * 100) /
                              (best.discountedPrice || best.price || 1);
                            return currentScore > bestScore ? current : best;
                          }
                        );
                        return (
                          <div>
                            <p className="text-sm text-blue-700 font-medium truncate">
                              {bestValue.title || bestValue.name}
                            </p>
                            <p className="text-sm text-blue-700">
                              Great rating + price
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Comparison Matrix */}
              {compareList.some((p) => p.features && p.features.length > 0) && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Feature Availability Matrix
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="grid gap-2 min-w-max">
                      {(() => {
                        const allFeatures = [
                          ...new Set(
                            compareList.flatMap((p) => p.features || [])
                          ),
                        ];
                        return allFeatures.slice(0, 8).map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                          >
                            <div className="w-48 text-sm font-medium text-gray-700 truncate">
                              {feature}
                            </div>
                            <div className="flex gap-2">
                              {compareList.map((product, pIndex) => (
                                <div
                                  key={product._id}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 transform hover:scale-110 ${
                                    product.features?.includes(feature)
                                      ? "bg-green-100 text-green-600 shadow-sm"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                  title={`${product.title || product.name} - ${product.features?.includes(feature) ? "Has" : "Missing"} this feature`}
                                >
                                  {product.features?.includes(feature)
                                    ? "✓"
                                    : "✗"}
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Stock & Availability Status */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  Stock & Availability Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {compareList.map((product, index) => (
                    <div
                      key={product._id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                        product.stock && product.stock > 0
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {product.title || product.name}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div
                          className={`flex items-center gap-2 p-2 rounded ${
                            product.stock && product.stock > 0
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              product.stock && product.stock > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            } animate-pulse`}
                          ></div>
                          <span
                            className={`text-xs font-medium ${
                              product.stock && product.stock > 0
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            {product.stock && product.stock > 0
                              ? `${product.stock} Available`
                              : "Out of Stock"}
                          </span>
                        </div>
                        {product.status && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                              Status:
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                                product.status === "new"
                                  ? "bg-blue-100 text-blue-800"
                                  : product.status === "hot"
                                    ? "bg-red-100 text-red-800"
                                    : product.status === "sale"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Price:</span>
                          <PriceFormatter
                            amount={
                              product.discountedPrice || product.price || 0
                            }
                            className="font-semibold text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Recommendations */}
              <div className="bg-linear-to-r from-indigo-100 to-purple-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  Our Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <h4 className="font-semibold text-green-800 mb-2">
                        Best Overall
                      </h4>
                      <p className="text-sm text-green-700">
                        Highest combination of rating, features, and value
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">💰</span>
                      </div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Budget Choice
                      </h4>
                      <p className="text-sm text-blue-700">
                        Best features for the lowest price point
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Premium Pick
                      </h4>
                      <p className="text-sm text-purple-700">
                        Top-tier features and highest quality
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {compareList.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products to compare
          </h3>
          <p className="text-gray-600 mb-6">
            Add products to see a detailed side-by-side comparison
          </p>
          <Button
            onClick={() => setShowProductSearch(true)}
            className="bg-zamzam-primary hover:bg-zamzam-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompareProducts;
