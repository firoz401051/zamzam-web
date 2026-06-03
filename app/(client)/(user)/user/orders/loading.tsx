import React from "react";

const OrdersLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-3 pb-4 border-b">
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-64" />
      </div>

      {/* Filters/Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 bg-gray-200 rounded-full w-24 shrink-0" />
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 md:p-6 space-y-4"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-40" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-24" />
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg shrink-0" />

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded w-24" />
                <div className="h-9 bg-gray-200 rounded w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
};

export default OrdersLoadingSkeleton;
