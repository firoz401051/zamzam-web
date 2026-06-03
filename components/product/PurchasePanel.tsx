"use client";

import React, { useState, useEffect } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import PriceFormatter from "@/components/PriceFormatter";
import { ProductActions } from "./ProductActions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useCartStore from "@/store";
import {
  Truck,
  Clock,
  MapPin,
  CheckCircle,
  Shield,
  RotateCcw,
} from "lucide-react";

interface PurchasePanelProps {
  product: any; // Using any since we have extended fields
  displayPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  originalPrice: number;
}

export const PurchasePanel = ({
  product,
  displayPrice,
}: PurchasePanelProps) => {
  const { getItemCount } = useCartStore();

  // Use client-only state to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
    if (product?._id) {
      const currentCartQuantity = getItemCount(product._id);
      setCartQuantity(currentCartQuantity);
      if (currentCartQuantity > 0) {
        setQuantity(currentCartQuantity);
      }
    }
  }, [product?._id, getItemCount]);

  // Update quantity when cart changes (only on client)
  useEffect(() => {
    if (isClient && product?._id) {
      const newCartQuantity = getItemCount(product._id);
      setCartQuantity(newCartQuantity);
      if (newCartQuantity > 0) {
        setQuantity(newCartQuantity);
      }
    }
  }, [isClient, product?._id, getItemCount]);

  const handleBuyNow = () => {
    // Add buy now logic here
    console.log("Buy now clicked with quantity:", quantity);
  };

  const isOutOfStock = !product?.stock || product?.stock <= 0;
  const isLowStock =
    product?.stock && product?.stock <= (product?.lowStockThreshold || 10);

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Price in cart */}
        <div>
          <PriceFormatter
            amount={displayPrice}
            className="text-3xl font-semibold text-zamzam-primary"
          />
        </div>

        {/* Shipping */}
        <div className="space-y-2 text-sm">
          {product?.freeShipping && (
            <div className="flex items-center gap-2 text-zamzam-text-dark">
              <Truck size={16} />
              <span>FREE delivery</span>
            </div>
          )}

          {product?.deliveryTime && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock size={16} />
              <span>{product.deliveryTime.replace("-", " ")}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-zamzam-text-dark hover:text-zamzam-primary cursor-pointer transition-colors">
            <MapPin size={16} />
            <span>Deliver to your location</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-xs">
              Currently unavailable
            </Badge>
          ) : isLowStock ? (
            <Badge
              variant="secondary"
              className="text-xs bg-orange-50 text-orange-600 border-orange-200"
            >
              Only {product.stock} left in stock
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs bg-green-50 text-green-700 border-green-200"
            >
              In Stock
            </Badge>
          )}
        </div>

       

        {/* Action Buttons */}
        <div className="space-y-3">
          <AddToCartButton
            product={product}
            quantity={quantity}
            className={`font-medium py-5 transition-colors ${
              isOutOfStock ? "opacity-90 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* zamzam Plus */}
        {product?.zamzamPlusEligible && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-zamzam-text-dark" />
              <span className="text-zamzam-text-dark">
                zamzam Plus eligible
              </span>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="border-t pt-4 space-y-2 text-xs text-zamzam-text-light">
          <div className="flex items-center gap-2">
            <Shield size={14} />
            <span>Secure transaction</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw size={14} />
            <span>Return policy</span>
          </div>
        </div>

        {/* Actions */}
        <ProductActions />
      </CardContent>
    </Card>
  );
};
