"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import useCartStore from "@/store";

interface QuantitySelectorProps {
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  disabled?: boolean;
  initialQuantity?: number;
  productId?: string;
}

export const QuantitySelector = ({
  maxQuantity = 10,
  onQuantityChange,
  disabled = false,
  initialQuantity = 1,
  productId,
}: QuantitySelectorProps) => {
  const { getItemCount } = useCartStore();

  // Get cart quantity for the product, or use initialQuantity if not in cart
  const cartQuantity = productId ? getItemCount(productId) : 0;
  const defaultQuantity = cartQuantity > 0 ? cartQuantity : initialQuantity;

  const [quantity, setQuantity] = useState(defaultQuantity);
  const [isOpen, setIsOpen] = useState(false);

  // Update quantity when cart changes or productId changes
  useEffect(() => {
    const newCartQuantity = productId ? getItemCount(productId) : 0;
    const newDefaultQuantity =
      newCartQuantity > 0 ? newCartQuantity : initialQuantity;
    setQuantity(newDefaultQuantity);
    onQuantityChange?.(newDefaultQuantity);
  }, [productId, getItemCount, initialQuantity, onQuantityChange]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Label
        htmlFor="quantity"
        className="text-sm font-medium text-zamzam-text-dark"
      >
        Qty:
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-16 h-8 px-3 justify-between text-sm bg-zamzam-surface hover:bg-zamzam-surface/80 border-border"
            disabled={disabled}
          >
            {quantity}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-20 p-1" align="start">
          <div className="max-h-48 overflow-y-auto">
            {[...Array(Math.min(maxQuantity, 30))].map((_, i) => (
              <button
                key={i}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-zamzam-surface hover:text-zamzam-primary rounded transition-colors"
                onClick={() => handleQuantityChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
