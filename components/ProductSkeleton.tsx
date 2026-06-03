import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductSkeletonProps {
  viewMode?: "grid" | "list";
}

const ProductSkeleton = ({ viewMode = "grid" }: ProductSkeletonProps) => {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row border rounded-lg border-gray-200 overflow-hidden bg-white shadow-sm h-full">
        {/* Image Skeleton */}
        <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-100 flex items-center justify-center p-4">
          <Skeleton className="w-32 h-32 rounded-md" />
        </div>

        {/* Content Skeleton */}
        <div className="p-4 flex flex-col gap-3 flex-1 justify-center">
          {/* Category */}
          <Skeleton className="h-3 w-20" />
          
          {/* Title */}
          <Skeleton className="h-5 w-3/4" />
          
          {/* Description */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center gap-4 mt-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex items-center justify-between mt-2">
             {/* Prices */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            {/* Delivery */}
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-full mt-2" />
        </div>
      </div>
    );
  }

  // Grid Skeleton
  return (
    <div className="border rounded-lg border-gray-200 overflow-hidden bg-white shadow-sm h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="aspect-5/5 bg-gray-100 flex items-center justify-center p-4">
        <Skeleton className="w-3/4 h-3/4 rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Category */}
        <Skeleton className="h-3 w-20" />

        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Rating */}
        <Skeleton className="h-3 w-24" />

        {/* Stock */}
        <Skeleton className="h-3 w-16" />

        <div className="mt-auto pt-2 space-y-3">
          {/* Price */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
