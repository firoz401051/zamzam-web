"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CreditCard,
  MapPin,
  Check,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

interface OrderCreationLoaderProps {
  isVisible: boolean;
}

const OrderCreationLoader = ({ isVisible }: OrderCreationLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setShowRedirectMessage(false);
      return;
    }

    // Progress through steps
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 2) return prev + 1;
        return prev;
      });
    }, 800);

    // Show redirect message after all steps complete
    const redirectTimer = setTimeout(() => {
      setShowRedirectMessage(true);
    }, 2800);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(redirectTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const steps = [
    {
      icon: Package,
      label: "Creating your order",
      sublabel: "Processing cart items",
    },
    {
      icon: MapPin,
      label: "Confirming address",
      sublabel: "Verifying delivery details",
    },
    {
      icon: ShoppingCart,
      label: "Clearing cart",
      sublabel: "Order successfully created",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 bg-linear-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl border border-gray-100"
          >
            {/* Header with animated icon */}
            <div className="text-center mb-8">
              <motion.div
                className="relative w-20 h-20 mx-auto mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-zamzam-primary/20 to-zamzam-primary/5 rounded-full blur-xl" />
                <div className="relative w-20 h-20 bg-linear-to-br from-zamzam-primary to-zamzam-primary-hover rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Package className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-zamzam-text-dark to-zamzam-primary bg-clip-text text-transparent mb-3">
                Processing Your Order
              </h2>
              <p className="text-zamzam-text-medium text-sm md:text-base">
                {showRedirectMessage
                  ? "Redirecting you to checkout..."
                  : "Please wait while we prepare everything for you"}
              </p>
            </div>

            {/* Steps Progress */}
            <div className="space-y-4 mb-6">
              {steps.map((step, index) => {
                const isCompleted = currentStep > index;
                const isActive = currentStep === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                      isActive
                        ? "bg-linear-to-r from-zamzam-primary/10 to-zamzam-primary/5 border-2 border-zamzam-primary/30 shadow-md"
                        : isCompleted
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-gray-100"
                    }`}
                  >
                    {/* Step Icon */}
                    <motion.div
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1,
                        repeat: isActive ? Infinity : 0,
                      }}
                      className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "bg-linear-to-br from-zamzam-primary to-zamzam-primary-hover"
                          : "bg-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          <Check
                            className="w-6 h-6 text-white"
                            strokeWidth={3}
                          />
                        </motion.div>
                      ) : (
                        <step.icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </motion.div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm md:text-base mb-1 ${
                          isActive || isCompleted
                            ? "text-zamzam-text-dark"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs md:text-sm ${
                          isActive || isCompleted
                            ? "text-zamzam-text-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {step.sublabel}
                      </p>
                    </div>

                    {/* Loading Spinner for active step */}
                    {isActive && !isCompleted && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-zamzam-primary/30 border-t-zamzam-primary rounded-full"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 text-xs font-medium text-zamzam-text-medium">
                <span>Progress</span>
                <span>
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-linear-to-r from-zamzam-primary to-zamzam-primary-hover h-3 rounded-full shadow-lg relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </div>

            {/* Redirect Message */}
            <AnimatePresence>
              {showRedirectMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-900 mb-1">
                        Order Created Successfully!
                      </p>
                      <p className="text-sm text-green-700">
                        Taking you to checkout page...
                      </p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-green-600" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Note */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-zamzam-text-medium">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure checkout • Your data is protected</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderCreationLoader;
