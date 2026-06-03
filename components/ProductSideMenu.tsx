"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useCartStore from "@/store";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useCartStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const availableItem = favoriteProduct.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };
  return (
    <div className={cn("absolute top-2 right-2", className)}>
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full hover:bg-zamzam-primary/80 hover:text-white hoverEffect ${existingProduct ? "bg-zamzam-primary/80 text-white" : "bg-zamzam-card"}`}
      >
        <Heart size={15} />
      </div>
    </div>
  );
};

export default ProductSideMenu;
