"use client";
import { Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import useCartStore from "@/store";
import QuantityButtons from "./QuantityButtons";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { getFinalPrice } from "@/lib/pricing-utils";

interface Props {
  product: Product;
  className?: string;
  quantity?: number;
}

const AddToCartButton = ({ product, className, quantity = 1 }: Props) => {
  const { addItem, getItemCount } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  // Use useEffect to set isClient to true after component mounts
  // This ensures that the component only renders on the client-side
  // Preventing hydration errors due to server/client mismatch

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  const handleAddToCart = () => {
    const availableStock = (product?.stock as number) - itemCount;
    const quantityToAdd = Math.min(quantity, availableStock);

    if (quantityToAdd > 0) {
      // Add items one by one to maintain cart state consistency
      for (let i = 0; i < quantityToAdd; i++) {
        addItem(product);
      }
      toast.success(
        `${quantityToAdd} × ${product?.name?.substring(
          0,
          12
        )}... added successfully!`
      );
    } else {
      toast.error("Cannot add more than available stock");
    }
  };
  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product ? getFinalPrice(product) * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-zamzam-primary/80 text-zamzam-background shadow-none border border-zamzam-primary/80 font-semibold tracking-wide hover:text-white hover:bg-zamzam-primary hover:border-zamzam-primary hoverEffect",
            className
          )}
        >
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
