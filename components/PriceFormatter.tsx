"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import useCartStore from "@/store";

interface Props {
  amount: number | undefined;
  className?: string;
  compact?: boolean;
  showCode?: boolean;
  showOriginal?: boolean;
}

const PriceFormatter = ({
  amount,
  className,
  compact = false,
  showCode = false,
  showOriginal = false,
}: Props) => {
  const [mounted, setMounted] = useState(false);

  // ✅ Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Subscribe to currency changes
  const selectedCurrency = useCartStore((state) => state.selectedCurrency);
  const formatPrice = useCartStore((state) => state.formatPrice);

  // ✅ Avoid server/client mismatch
  if (!mounted) {
    return (
      <span
        className={twMerge(
          "text-sm font-semibold text-zamzam-text-dark",
          className
        )}
      >
        ...
      </span>
    );
  }

  if (!amount || amount === 0) {
    return (
      <span
        className={twMerge(
          "text-sm font-semibold text-zamzam-text-dark",
          className
        )}
      >
        --
      </span>
    );
  }

  const formattedPrice = formatPrice(amount);

  return (
    <span
      className={twMerge(
        "text-sm font-semibold text-zamzam-text-dark",
        className
      )}
    >
      {compact ? formattedPrice.replace(/\.00$/, "") : formattedPrice}

      {showCode && ` ${selectedCurrency.code}`}

      {showOriginal && selectedCurrency.code !== "USD" && (
        <span className="text-xs text-gray-500 ml-2">
          (${amount.toFixed(2)} USD)
        </span>
      )}
    </span>
  );
};

export default PriceFormatter;