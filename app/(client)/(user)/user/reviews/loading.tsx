import React from "react";

const ReviewsLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-3 pb-4 border-b">
        <div className="h-8 bg-gray-200 rounded w-36" />
        <div className="h-4 bg-gray-200 rounded w-72" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 space-y-2">
            <div className="h-8 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 bg-gray-200 rounded-full w-28 shrink-0" />
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-5 space-y-4">
            {/* Review Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-32" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-48" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>

            {/* Review Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-6 bg-gray-200 rounded-full w-24" />
              </div>
              <div className="h-9 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Alternative */}
      {/* Uncomment if needed for empty state
      <div className="text-center py-12 space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto" />
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
        <div className="h-10 bg-gray-200 rounded w-36 mx-auto" />
      </div>
      */}

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
};

export default ReviewsLoadingSkeleton;
