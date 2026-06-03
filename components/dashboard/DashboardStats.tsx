"use client";

import React from "react";
import useCartStore from "@/store";
import { Heart, DollarSign, Star, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import PriceFormatter from "@/components/PriceFormatter";

interface DashboardStatsProps {
  totalOrders: number;
  totalSpent: number;
}

const DashboardStats = ({ totalOrders, totalSpent }: DashboardStatsProps) => {
  const { favoriteProduct, getTotalItemCount, getTotalPrice } = useCartStore();

  return (
    <>
      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zamzam-text-dark">
              {getTotalItemCount()}
            </p>
            <p className="text-sm text-zamzam-text-muted">Cart Items</p>
            <p className="text-xs text-zamzam-text-muted">
              <PriceFormatter amount={getTotalPrice()} />
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zamzam-text-dark">
              {favoriteProduct.length}
            </p>
            <p className="text-sm text-zamzam-text-muted">Wishlist Items</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zamzam-text-dark">
              <PriceFormatter
                amount={totalSpent}
                className="text-2xl font-bold text-zamzam-text-dark"
              />
            </p>
            <p className="text-sm text-zamzam-text-muted">Total Spent</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Star className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zamzam-text-dark">0</p>
            <p className="text-sm text-zamzam-text-muted">Reviews Written</p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardStats;
