"use client";

import React from "react";
import Link from "next/link";
import useCartStore from "@/store";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceFormatter from "@/components/PriceFormatter";

const DashboardWishlistPreview = () => {
  const { favoriteProduct } = useCartStore();
  const recentWishlistItems = favoriteProduct.slice(0, 3);

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-zamzam-text-dark">Wishlist</h3>
        <Link href="/wishlist">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {recentWishlistItems.length > 0 ? (
          recentWishlistItems.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-zamzam-surface rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-zamzam-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zamzam-text-dark truncate">
                  {item.name}
                </p>
                <p className="text-xs text-zamzam-text-muted">
                  <PriceFormatter amount={item.price} />
                </p>
              </div>
              <Badge
                className={
                  item.stock && item.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {item.stock && item.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-zamzam-text-muted">
              No wishlist items
            </p>
            <Link href="/products">
              <Button variant="outline" size="sm" className="mt-2">
                Browse Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardWishlistPreview;
