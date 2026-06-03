import React from "react";

const DashboardLayoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 animate-pulse">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-3 xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-4 space-y-2">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 p-3 border-b pb-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>

              {/* Menu Items */}
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg w-full" />
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="lg:col-span-9 xl:col-span-10">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              {/* Page Header */}
              <div className="space-y-3 pb-4 border-b">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-64" />
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-32" />
                    <div className="h-20 bg-gray-100 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutSkeleton;
