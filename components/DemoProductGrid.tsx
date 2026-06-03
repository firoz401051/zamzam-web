"use client";

import useCartStore from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/api/placeholder/200/200",
    discount: 25,
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/api/placeholder/200/200",
    discount: 20,
    inStock: true,
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image: "/api/placeholder/200/200",
    discount: 20,
    inStock: false,
  },
  {
    id: "4",
    name: "Wireless Phone Charger",
    price: 39.99,
    originalPrice: 59.99,
    image: "/api/placeholder/200/200",
    discount: 33,
    inStock: true,
  },
];

export default function DemoProductGrid() {
  const selectedCurrency = useCartStore((state) => state.selectedCurrency);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Grid Demo</h3>
        <Badge variant="outline" className="text-xs">
          {selectedCurrency.flag} {selectedCurrency.code}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Product Image</div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h4>

                {/* Price Section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PriceFormatter
                      amount={product.price}
                      className="text-lg font-bold text-green-600"
                    />
                    {product.discount && (
                      <Badge variant="destructive" className="text-xs">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>

                  {product.originalPrice > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Original:
                      </span>
                      <PriceFormatter
                        amount={product.originalPrice}
                        className="text-xs text-muted-foreground line-through"
                      />
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Exchange Rate: 1 USD = {selectedCurrency.rate.toFixed(4)}{" "}
                    {selectedCurrency.code}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="pt-2">
                  {product.inStock ? (
                    <Badge
                      variant="secondary"
                      className="text-xs text-green-600"
                    >
                      ✓ In Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-red-600">
                      ✗ Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    disabled={!product.inStock}
                    className="flex-1 text-xs"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" className="p-2">
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          🚀 <strong>Live Demo:</strong> Change currency from TopBar and watch
          all prices update instantly across all products!
        </p>
      </div>
    </div>
  );
}
