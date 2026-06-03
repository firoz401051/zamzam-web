"use client";

import React from "react";
import useCartStore from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import { useCurrencyUpdater } from "@/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, DollarSign, TrendingUp, Clock } from "lucide-react";
import CurrencyRateStatus from "@/components/CurrencyRateStatus";
import LiveUpdateIndicator from "@/components/LiveUpdateIndicator";
import DemoProductGrid from "@/components/DemoProductGrid";

const CurrencyTestPage = () => {
  const {
    selectedCurrency,
    currencies,
    setCurrency,
    formatPrice,
    lastRateUpdate,
    isUpdatingRates,
  } = useCartStore();

  const { updateExchangeRates } = useCurrencyUpdater();

  const samplePrices = [
    { label: "Smartphone", price: 599 },
    { label: "Laptop", price: 1299 },
    { label: "Headphones", price: 199 },
    { label: "Coffee Mug", price: 25 },
    { label: "T-Shirt", price: 45 },
  ];

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
    <div className="min-h-screen bg-background">
      <LiveUpdateIndicator />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Currency System Test
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Test real-time currency conversion with live exchange rates
          </p>
        </div>

        {/* Currency Status Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <TrendingUp className="h-5 w-5" />
                  Current Currency: {selectedCurrency.flag}{" "}
                  {selectedCurrency.name}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {selectedCurrency.code} • Rate:{" "}
                  {selectedCurrency.rate.toFixed(4)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {getTimeAgo(lastRateUpdate)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualUpdate}
                  disabled={isUpdatingRates}
                  className="text-xs"
                >
                  <RefreshCw
                    className={`h-3 w-3 mr-1 ${
                      isUpdatingRates ? "animate-spin" : ""
                    }`}
                  />
                  {isUpdatingRates ? "Updating..." : "Refresh"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Real-time Update Demo */}
        <Card className="mb-6 border-2 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-green-600">
              <TrendingUp className="h-5 w-5" />
              Live Currency Update Demo
            </CardTitle>
            <CardDescription>
              Change currency from the TopBar above ↑ and watch prices update
              instantly!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {samplePrices.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-dashed border-green-500/30 rounded-lg bg-green-50/50 dark:bg-green-950/20"
                >
                  <h4 className="font-semibold text-center mb-2 text-sm">
                    {item.label}
                  </h4>
                  <div className="text-center">
                    <PriceFormatter
                      amount={item.price}
                      className="text-xl font-bold text-green-600"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Updates instantly!
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Test Instructions:</strong> Go to the TopBar at the
                very top of this page and change the currency. Watch how all
                prices update immediately without any page refresh!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Currency Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Select Currency
            </CardTitle>
            <CardDescription>
              Choose a currency to see converted prices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currencies.map((currency) => (
                <Button
                  key={currency.code}
                  onClick={() => setCurrency(currency)}
                  variant={
                    currency.code === selectedCurrency.code
                      ? "default"
                      : "outline"
                  }
                  className="h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200"
                >
                  <div className="text-2xl">{currency.flag}</div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{currency.code}</div>
                    <div className="text-xs opacity-70 truncate max-w-16">
                      {currency.name}
                    </div>
                    <div className="text-xs opacity-60 font-mono">
                      {currency.rate.toFixed(4)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Product Grid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Product Price Demo
            </CardTitle>
            <CardDescription>
              Real product cards showing instant currency conversion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemoProductGrid />
          </CardContent>
        </Card>

        {/* Sample Product Prices */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <DollarSign className="h-5 w-5" />
              Sample Product Prices
            </CardTitle>
            <CardDescription>
              See how prices convert to your selected currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {samplePrices.map((item, index) => (
                <Card
                  key={index}
                  className="border-2 hover:border-primary/20 transition-colors"
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 text-base">
                      {item.label}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Current Price:
                        </span>
                        <PriceFormatter
                          amount={item.price}
                          className="text-lg font-bold text-primary"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          USD Original:
                        </span>
                        <PriceFormatter
                          amount={item.price}
                          className="text-sm font-medium"
                          showOriginal={false}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          With Code:
                        </span>
                        <PriceFormatter
                          amount={item.price}
                          className="text-sm font-medium"
                          showCode
                        />
                      </div>

                      {selectedCurrency.code !== "USD" && (
                        <div className="pt-2 border-t border-muted">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Exchange Rate:
                            </span>
                            <span className="text-xs font-mono">
                              1 USD = {selectedCurrency.rate.toFixed(4)}{" "}
                              {selectedCurrency.code}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Direct Currency Store Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Direct Store Usage
            </CardTitle>
            <CardDescription>
              Raw currency conversion using the store's formatPrice method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {samplePrices.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm text-muted-foreground mb-1 truncate">
                    {item.label}
                  </div>
                  <div className="font-semibold text-primary mb-1">
                    {formatPrice(item.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${item.price} USD
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Information */}
        <Card className="mt-6">
          <CardContent className="p-4 sm:p-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                About Live Currency Rates
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Rates are automatically updated every hour</li>
                <li>• Data is fetched from reliable exchange rate APIs</li>
                <li>• Fallback rates are used if live data is unavailable</li>
                <li>• All prices are converted from USD base currency</li>
                <li>
                  • Rate updates are cached locally for better performance
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyTestPage;
