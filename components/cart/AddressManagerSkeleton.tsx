"use client";

import { motion } from "framer-motion";

const AddressManagerSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-32" />
        </div>
        <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Current address section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-28" />

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20" />
                </div>
                <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
              </div>
            </div>
          </motion.div>

          {/* Available addresses section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-36" />

            {[...Array(2)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20" />
                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full" />
                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-5/6" />
                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16" />
                  </div>
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Add new address button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="h-12 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded-lg animate-shimmer bg-[length:200%_100%] w-full" />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="p-4 border-t bg-white"
      >
        <div className="h-12 bg-gradient-to-r from-zamzam-primary/20 via-zamzam-primary/30 to-zamzam-primary/20 rounded-lg animate-shimmer bg-[length:200%_100%] w-full" />
      </motion.div>
    </div>
  );
};

export default AddressManagerSkeleton;
