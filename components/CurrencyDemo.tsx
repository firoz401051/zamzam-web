"use client";

import { useState } from "react";
import useCartStore from "@/store";
import { useCurrencyUpdater } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, DollarSign, TrendingUp, Clock } from "lucide-react";
import PriceFormatter from "@/components/PriceFormatter";
import CurrencyRateStatus from "@/components/CurrencyRateStatus";

export default function CurrencyDemo() {
  const [samplePrice] = useState(99.99); // Sample product price in USD

  const {
    selectedCurrency,
    currencies,
    setCurrency,
    convertPrice,
    formatPrice,
    lastRateUpdate,
    isUpdatingRates,
  } = useCartStore();

  const { updateExchangeRates } = useCurrencyUpdater();

  const handleCurrencyChange = (currency: (typeof currencies)[0]) => {
    setCurrency(currency);
  };

  const handleManualUpdate = async () => {
    try {
      await updateExchangeRates();
    } catch (error) {
      console.error("Failed to update rates:", error);
    }
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Never updated";

    const now = new Date();
    const updateTime = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - updateTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just updated";
    if (diffInMinutes < 60) return `Updated ${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Updated ${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `Updated ${diffInDays} days ago`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Currency Conversion Demo
          </CardTitle>
          <CardDescription>
            Real-time currency rates are automatically updated every hour. You
            can also manually refresh rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Rate Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {getTimeAgo(lastRateUpdate)}
              </span>
            </div>
            <CurrencyRateStatus />
          </div>

          {/* Sample Product Price */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Sample Product Price
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Original Price (USD)
                </p>
                <p className="text-lg font-bold">${samplePrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Converted to {selectedCurrency.code}
                </p>
                <PriceFormatter
                  amount={samplePrice}
                  showCode={true}
                  showOriginal={selectedCurrency.code !== "USD"}
                  className="text-lg font-bold text-green-600"
                />
              </div>
            </div>
          </div>

          {/* Currency Selector */}
          <div>
            <h3 className="font-semibold mb-3">Select Currency</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {currencies.map((currency) => (
                <Button
                  key={currency.code}
                  variant={
                    selectedCurrency.code === currency.code
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleCurrencyChange(currency)}
                  className="justify-start"
                  size="sm"
                >
                  <span className="mr-2">{currency.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs opacity-70">
                      {currency.rate.toFixed(4)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Exchange Rates Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                Current Exchange Rates (Base: USD)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualUpdate}
                disabled={isUpdatingRates}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isUpdatingRates ? "animate-spin" : ""
                  }`}
                />
                {isUpdatingRates ? "Updating..." : "Refresh Rates"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  className={`p-3 border rounded-lg transition-colors ${
                    selectedCurrency.code === currency.code
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{currency.flag}</span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-20">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        {currency.rate.toFixed(4)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currency.symbol}
                      </div>
                    </div>
                  </div>

                  {/* Show conversion example */}
                  <div className="mt-2 pt-2 border-t border-muted/50">
                    <div className="text-xs text-muted-foreground">
                      $1 USD = {formatPrice(1).replace("$", currency.symbol)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Update Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              About Live Currency Rates
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Rates are automatically updated every hour</li>
              <li>• Data is fetched from reliable exchange rate APIs</li>
              <li>• Fallback rates are used if live data is unavailable</li>
              <li>• All prices are converted from USD base currency</li>
              <li>• Rate updates are cached locally for better performance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
