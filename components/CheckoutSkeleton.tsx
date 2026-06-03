"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CheckoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Card */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg" />
                  <div className="h-12 bg-gray-200 rounded-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Lines */}
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between py-3">
                  <div className="h-6 bg-gray-200 rounded w-12" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>

                {/* Checkout Button */}
                <div className="h-12 bg-gray-200 rounded-lg" />

                {/* Continue Shopping Link */}
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
