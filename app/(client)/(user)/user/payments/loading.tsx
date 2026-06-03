import React from "react";

const PaymentsLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-3 pb-4 border-b">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-96" />
      </div>

      {/* Add Payment Method Button */}
      <div className="h-11 bg-gray-200 rounded-lg w-48" />

      {/* Saved Cards Section */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-5 space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-16" />
              </div>

              {/* Card Details */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-28" />
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <div className="h-9 bg-gray-200 rounded flex-1" />
                <div className="h-9 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Security Card */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="h-6 bg-gray-200 rounded w-40" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>

      {/* Payment Preferences Card */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-44" />

        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-48" />
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsLoadingSkeleton;
