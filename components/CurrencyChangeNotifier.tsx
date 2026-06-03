"use client";

import { useEffect, useRef } from "react";
import useCartStore from "@/store";
import toast from "react-hot-toast";

export default function CurrencyChangeNotifier() {
  const selectedCurrency = useCartStore((state) => state.selectedCurrency);
  const isInitialMount = useRef(true);
  const lastCurrencyCode = useRef(selectedCurrency.code);

  useEffect(() => {
    // Skip notification on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastCurrencyCode.current = selectedCurrency.code;
      return;
    }

    // Only show notification when currency code changes (not rate updates)
    if (lastCurrencyCode.current !== selectedCurrency.code) {
      toast.success(
        `Currency changed to ${selectedCurrency.flag} ${selectedCurrency.name}`,
        {
          icon: selectedCurrency.flag,
          duration: 2000,
          style: {
            background: "var(--color-zamzam-primary)", // #fa324d
            color: "var(--color-zamzam-white)", // #ffffff
            border: "1px solid var(--color-zamzam-primary-hover)", // #e02544
            borderRadius: "var(--radius-md)",
            fontWeight: "var(--font-weight-medium)",
          },
        }
      );
      lastCurrencyCode.current = selectedCurrency.code;
    }
  }, [selectedCurrency]);

  return null; // This component doesn't render anything
}
