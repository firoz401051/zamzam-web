"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Individual cart item skeleton
export const CartItemSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-1 items-start gap-4">
            {/* Product Image Skeleton */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]" />

            {/* Product Info Skeleton */}
            <div className="flex-1 space-y-3">
              <div>
                {/* Title skeleton */}
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4 mb-2" />

                {/* Details skeleton */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%] w-20" />
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%] w-16" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]" />
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]" />
              </div>
            </div>
          </div>

          {/* Price and Quantity Skeleton */}
          <div className="flex flex-col items-end justify-between gap-4 min-h-[120px]">
            <div className="text-right">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16 mb-1" />
              <div className="h-6 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded animate-shimmer bg-[length:200%_100%] w-20" />
            </div>
            {/* Quantity buttons skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
              <div className="w-12 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
              <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Address selection skeleton
export const AddressSelectionSkeleton = () => (
  <Card>
    <CardHeader className="pb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Address items */}
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="p-4 border border-gray-200 rounded-lg space-y-2"
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-1/2" />
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-2/3" />
        </div>
      ))}
      {/* Add address button */}
      <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full" />
    </CardContent>
  </Card>
);

// Order summary skeleton
export const OrderSummarySkeleton = () => (
  <Card className="sticky top-8">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {/* Summary line items */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16" />
          </div>
        ))}

        <Separator className="my-4" />

        {/* Total section */}
        <div className="flex items-center justify-between py-3 bg-zamzam-primary/5 rounded-lg px-4">
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16" />
          <div className="h-6 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded animate-shimmer bg-[length:200%_100%] w-20" />
        </div>
      </div>

      {/* Checkout button skeleton */}
      <div className="h-12 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded-lg animate-shimmer bg-[length:200%_100%] w-full" />

      {/* Additional info */}
      <div className="space-y-2">
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full" />
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />
      </div>
    </CardContent>
  </Card>
);

// Header skeleton
export const CartHeaderSkeleton = () => (
  <div className="pb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div>
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-48 mb-2" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-32" />
        </div>
      </div>
      <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
    </div>
  </div>
);

// Sign in prompt skeleton
export const SignInPromptSkeleton = () => (
  <Card>
    <CardContent className="p-6 text-center">
      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded-full mx-auto mb-3 animate-shimmer bg-[length:200%_100%]" />
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-32 mx-auto mb-2" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-48 mx-auto mb-4" />
      </div>
      <div className="h-10 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded animate-shimmer bg-[length:200%_100%] w-full" />
    </CardContent>
  </Card>
);

// Main cart page skeleton
export const CartPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-zamzam-background to-zamzam-surface pb-52 md:pb-10">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-12" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-2" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
        </div>
      </div>

      {/* Header */}
      <CartHeaderSkeleton />

      <div className="grid lg:grid-cols-3 md:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <CartItemSkeleton key={i} index={i} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="hidden md:block">
            <AddressSelectionSkeleton />
          </div>
          <div className="hidden md:block">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>

      {/* Mobile cart footer skeleton */}
      <MobileCartFooterSkeleton />
    </div>
  </div>
);

// Mobile cart footer skeleton
export const MobileCartFooterSkeleton = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
    <div className="p-4 space-y-4">
      {/* Quick Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded animate-shimmer bg-[length:200%_100%]" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16" />
        </div>
        <div className="h-5 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded animate-shimmer bg-[length:200%_100%] w-20" />
      </div>

      {/* Address preview skeleton */}
      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />

      {/* Checkout button skeleton */}
      <div className="h-12 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded-lg animate-shimmer bg-[length:200%_100%] w-full" />

      {/* Continue shopping link skeleton */}
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-32 mx-auto" />
    </div>
  </div>
);
