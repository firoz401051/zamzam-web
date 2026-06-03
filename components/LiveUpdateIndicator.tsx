"use client";

import { useEffect, useState } from "react";
import useCartStore from "@/store";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle } from "lucide-react";

export default function LiveUpdateIndicator() {
  const selectedCurrency = useCartStore((state) => state.selectedCurrency);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Show updating state when currency changes
    setIsUpdating(true);
    const timer = setTimeout(() => {
      setIsUpdating(false);
    }, 300); // Short animation duration

    return () => clearTimeout(timer);
  }, [selectedCurrency]);

  return (
    <div className="fixed top-20 right-4 z-50">
      <Badge
        variant={isUpdating ? "destructive" : "secondary"}
        className={`transition-all duration-300 ${
          isUpdating
            ? "animate-pulse bg-orange-500 text-white"
            : "bg-green-500 text-white"
        }`}
      >
        {isUpdating ? (
          <>
            <Zap className="h-3 w-3 mr-1 animate-spin" />
            Updating Prices...
          </>
        ) : (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Prices Updated!
          </>
        )}
      </Badge>
    </div>
  );
}
