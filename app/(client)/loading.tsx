import React from "react";
import Container from "@/components/Container";

const HomeSkeleton = () => {
  return (
    <div className="animate-pulse bg-zamzam-background min-h-screen">
      {/* Home Banner Skeleton */}
      <div className="bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 pb-10 pt-6 relative overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Banner Skeleton (Women Fashion) */}
            <div className="lg:col-span-2 bg-gray-200 rounded-3xl min-h-[350px] sm:min-h-[400px] relative p-8 flex items-center">
              <div className="w-1/2 space-y-4">
                <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
                <div className="h-12 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                <div className="h-12 w-40 bg-gray-300 rounded-full mt-4"></div>
              </div>
            </div>

            {/* Side Banners Skeleton */}
            <div className="flex flex-col gap-6">
              {/* Top Side Banner */}
              <div className="bg-gray-200 rounded-3xl h-44 sm:h-48 lg:h-56 xl:h-64 p-6 flex flex-col justify-center relative">
                <div className="w-2/3 space-y-3">
                  <div className="h-5 w-24 bg-gray-300 rounded-full"></div>
                  <div className="h-8 w-32 bg-gray-300 rounded"></div>
                  <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              {/* Bottom Side Banner */}
              <div className="bg-gray-200 rounded-3xl h-44 sm:h-48 lg:h-56 xl:h-64 p-6 flex flex-col justify-center relative">
                <div className="w-2/3 space-y-3">
                  <div className="h-8 w-32 bg-gray-300 rounded"></div>
                  <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Banner Row Skeleton (Kids, Accessories, Shoes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-3xl h-28 sm:h-32 p-6 flex items-center"
              >
                <div className="space-y-2 w-2/3">
                  <div className="h-5 w-24 bg-gray-300 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-16 bg-gray-300 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Product Tabs Skeleton */}
      <div className="py-16 bg-white">
        <Container>
          <div className="text-center mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Tabs Navigation Skeleton */}
          <div className="mb-10 hidden sm:block">
            <div className="flex justify-center gap-3 max-w-6xl mx-auto flex-wrap">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-28 bg-gray-100 rounded-lg"
                ></div>
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="border rounded-lg bg-white p-3 space-y-3">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Special Offer Banner Skeleton */}
      <div className="py-16 bg-linear-to-r from-orange-50 to-red-50">
        <Container>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-auto min-h-[400px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
                <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-gray-200 h-64 lg:h-full"></div>
            </div>
          </div>
        </Container>
      </div>

      {/* Categories & Brands Skeleton */}
      <div className="py-10">
        <Container>
          {/* Categories */}
          <div className="mb-12">
            <div className="h-7 w-40 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center group">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 mx-auto w-20 h-20"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="mb-12">
            <div className="h-7 w-32 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/2 bg-gray-100 rounded-lg border border-gray-200"
                ></div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Service Features Skeleton */}
      <div className="bg-gray-50 py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-6 w-32 bg-gray-200 rounded mx-auto"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Testimonials Skeleton */}
      <div className="py-12">
        <Container>
          <div className="text-center mb-8 space-y-3">
            <div className="h-8 w-48 bg-gray-300 rounded mx-auto"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 bg-white space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Newsletter Skeleton */}
      <div className="bg-linear-to-r from-blue-50 to-purple-50 py-12">
        <Container>
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="h-8 w-64 bg-gray-300 rounded mx-auto"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="flex gap-2 h-12">
              <div className="flex-1 bg-white rounded-lg border border-gray-200"></div>
              <div className="w-32 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HomeSkeleton;
