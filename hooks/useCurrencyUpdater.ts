"use client";

import { useEffect } from "react";
import useCartStore from "@/store";

// Hook to automatically update currency rates
export const useCurrencyUpdater = () => {
  const updateExchangeRates = useCartStore(
    (state) => state.updateExchangeRates
  );
  const lastRateUpdate = useCartStore((state) => state.lastRateUpdate);
  const isUpdatingRates = useCartStore((state) => state.isUpdatingRates);

  useEffect(() => {
    const shouldUpdate = () => {
      if (!lastRateUpdate) return true;

      const lastUpdate = new Date(lastRateUpdate);
      const now = new Date();
      const hoursSinceUpdate =
        (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      // Update rates if they're older than 1 hour
      return hoursSinceUpdate >= 1;
    };

    const updateRates = async () => {
      if (shouldUpdate() && !isUpdatingRates) {
        try {
          await updateExchangeRates();
        } catch (error) {
          console.error("Failed to update currency rates:", error);
        }
      }
    };

    // Update rates on initial load
    updateRates();

    // Set up interval to check for updates every 30 minutes
    const interval = setInterval(updateRates, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateExchangeRates, lastRateUpdate, isUpdatingRates]);

  return {
    updateExchangeRates,
    lastRateUpdate,
    isUpdatingRates,
  };
};
