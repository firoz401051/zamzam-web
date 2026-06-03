"use client";

import React from "react";
import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSkeleton from "@/components/ProductSkeleton";

const ProductsLoading = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <Container className="py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-300">/</span>
            <Skeleton className="h-4 w-24" />
          </div>
        </Container>
      </div>

      <Container className="py-6">
        {/* Page Header Skeleton */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="space-y-6">
          {/* Search and Filters Bar Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Skeleton */}
              <Skeleton className="h-10 w-full lg:max-w-md rounded-md" />

              {/* Controls Skeleton */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <Skeleton className="h-10 w-[180px] rounded-md hidden sm:block" />
                <div className="flex items-center border rounded-md">
                   <Skeleton className="h-10 w-9 rounded-none" />
                   <Skeleton className="h-10 w-9 rounded-none" />
                </div>
                <Skeleton className="h-10 w-24 lg:hidden rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar Filters Skeleton */}
            <div className="hidden lg:block w-64 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <Skeleton className="h-6 w-24 mb-4" />
                
                {/* Filter Sections */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                     <Skeleton className="h-5 w-32" />
                     <div className="space-y-2 pl-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-5/6" />
                     </div>
                  </div>
                ))}
                
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>

            {/* Products Area Skeleton */}
            <div className="flex-1">
              {/* Results Info Skeleton */}
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
              </div>

              {/* Products Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="h-full">
                     <ProductSkeleton viewMode="grid" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductsLoading;
