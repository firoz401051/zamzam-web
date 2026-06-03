"use client";

import { RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react";
import useCartStore from "@/store";
import { useCurrencyUpdater } from "@/hooks";
import { Button } from "@/components/ui/button";

export default function CurrencyRateStatus() {
  const { updateExchangeRates, lastRateUpdate, isUpdatingRates } =
    useCurrencyUpdater();
  const selectedCurrency = useCartStore((state) => state.selectedCurrency);

  const handleManualUpdate = async () => {
    try {
      await updateExchangeRates();
    } catch (error) {
      console.error("Manual currency update failed:", error);
    }
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Never";

    const now = new Date();
    const updateTime = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - updateTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getStatusIcon = () => {
    if (isUpdatingRates) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }

    if (!lastRateUpdate) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }

    const now = new Date();
    const updateTime = new Date(lastRateUpdate);
    const hoursOld = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);

    if (hoursOld > 2) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }

    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isUpdatingRates) return "Updating rates...";
    if (!lastRateUpdate) return "Rates not loaded";

    const now = new Date();
    const updateTime = new Date(lastRateUpdate);
    const hoursOld = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);

    if (hoursOld > 2) return "Rates may be outdated";
    return "Rates up to date";
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {getStatusIcon()}
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {getTimeAgo(lastRateUpdate)}
      </span>
      <span className="hidden sm:inline">• {getStatusText()}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleManualUpdate}
        disabled={isUpdatingRates}
        className="h-6 px-2 text-xs"
      >
        {isUpdatingRates ? (
          <RefreshCw className="h-3 w-3 animate-spin" />
        ) : (
          <RefreshCw className="h-3 w-3" />
        )}
        <span className="ml-1 hidden sm:inline">Refresh</span>
      </Button>
    </div>
  );
}
