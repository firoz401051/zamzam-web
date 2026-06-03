import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  totalReviews?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars = ({
  rating,
  totalReviews,
  size = 14,
  showText = true,
}: RatingStarsProps) => {
  const stars = rating || 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={size}
            className={`${
              index < Math.floor(stars)
                ? "text-orange-400 fill-orange-400"
                : index < stars
                  ? "text-orange-400 fill-orange-200"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showText && (
        <>
          <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
            {stars.toFixed(1)} out of 5
          </span>
          {totalReviews && (
            <span className="text-sm text-gray-500">
              ({totalReviews.toLocaleString()} global ratings)
            </span>
          )}
        </>
      )}
    </div>
  );
};
