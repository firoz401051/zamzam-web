"use client";
import { motion } from "motion/react";

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
  >
    {/* Image skeleton */}
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 animate-pulse" />

    {/* Title skeleton */}
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>

    {/* Price skeleton */}
    <div className="flex items-center justify-between mt-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
      <div className="h-8 bg-gray-300 rounded animate-pulse w-24" />
    </div>
  </motion.div>
);

const HeaderSkeleton = () => (
  <div className="w-full h-20 bg-white border-b border-gray-200 mb-8">
    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
      {/* Logo skeleton */}
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

      {/* Navigation skeleton */}
      <div className="hidden md:flex space-x-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>

      {/* Cart/Profile skeleton */}
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

const BannerSkeleton = () => (
  <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg mb-8 animate-pulse" />
);

const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      <div className="max-w-7xl mx-auto px-4">
        {/* Banner Skeleton */}
        <BannerSkeleton />

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
