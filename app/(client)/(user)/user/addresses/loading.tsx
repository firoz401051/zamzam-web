import React from "react";

const AddressesLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-3 pb-4 border-b">
        <div className="h-8 bg-gray-200 rounded w-44" />
        <div className="h-4 bg-gray-200 rounded w-80" />
      </div>

      {/* Add Address Button */}
      <div className="h-11 bg-gray-200 rounded-lg w-40" />

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-5 space-y-4">
            {/* Address Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-gray-200 rounded w-28" />
                  {i === 0 && (
                    <div className="h-5 bg-gray-200 rounded-full w-16" />
                  )}
                </div>
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>

            {/* Address Details */}
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>

            {/* Address Actions */}
            <div className="flex gap-2 pt-3 border-t">
              {i !== 0 && <div className="h-9 bg-gray-200 rounded flex-1" />}
              <div className="h-9 bg-gray-200 rounded flex-1" />
              <div className="h-9 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Address Limits Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-200 rounded-full" />
          <div className="h-4 bg-blue-200 rounded w-32" />
        </div>
        <div className="space-y-1 ml-7">
          <div className="h-3 bg-blue-200 rounded w-full" />
          <div className="h-3 bg-blue-200 rounded w-4/5" />
        </div>
      </div>

      {/* Empty State Alternative */}
      {/* Uncomment if needed for empty state
      <div className="text-center py-16 space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto" />
        <div className="h-6 bg-gray-200 rounded w-44 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
        <div className="h-11 bg-gray-200 rounded-lg w-40 mx-auto mt-6" />
      </div>
      */}
    </div>
  );
};

export default AddressesLoadingSkeleton;
