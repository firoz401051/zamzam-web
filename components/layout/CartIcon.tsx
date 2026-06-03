"use client";

import useCartStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CartIcon = () => {
  const { items } = useCartStore();

  // ✅ Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href={"/cart"} className="group relative">
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-zamzam-primary-dark text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
          0
        </span>
      </Link>
    );
  }

  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingBag className="w-5 h-5 group-hover:text-zamzam-primary-hover hoverEffect" />
      <span className="absolute -top-1 -right-1 bg-zamzam-primary-dark text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
        {items?.length || 0}
      </span>
    </Link>
  );
};

export default CartIcon;
