"use client";

import React from "react";
import { Heart, Share2 } from "lucide-react";

interface ProductActionsProps {
  onAddToWishlist?: () => void;
  onShare?: () => void;
}

export const ProductActions = ({
  onAddToWishlist,
  onShare,
}: ProductActionsProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
    onShare?.();
  };

  const handleAddToWishlist = () => {
    // Add your wishlist logic here
    onAddToWishlist?.();
  };

  return (
    <div className="border-t pt-4 flex justify-between text-sm">
      <button
        className="flex items-center gap-1 text-blue-600 hover:text-orange-600 transition-colors"
        onClick={handleAddToWishlist}
      >
        <Heart size={14} />
        Add to Wish List
      </button>
      <button
        className="flex items-center gap-1 text-blue-600 hover:text-orange-600 transition-colors"
        onClick={handleShare}
      >
        <Share2 size={14} />
        Share
      </button>
    </div>
  );
};
