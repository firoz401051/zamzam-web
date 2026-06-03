import React from "react";

const ProfileLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-3 pb-4 border-b">
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-80" />
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-36" />
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded w-36" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div className="h-6 bg-gray-200 rounded w-48" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-100 rounded-lg border border-gray-200" />
            </div>
          ))}
        </div>

        {/* Bio Field (Full Width) */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-24 bg-gray-100 rounded-lg border border-gray-200" />
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div className="h-6 bg-gray-200 rounded w-40" />

        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-3 bg-gray-200 rounded w-56" />
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Membership Section */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-44" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <div className="h-11 bg-gray-200 rounded-lg flex-1" />
        <div className="h-11 bg-gray-200 rounded-lg w-full sm:w-32" />
      </div>
    </div>
  );
};

export default ProfileLoadingSkeleton;
