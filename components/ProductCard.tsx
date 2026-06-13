"use client";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import { Button } from "@/components/ui/button";
import { Product } from "@/sanity.types";
import PriceFormatter from "./PriceFormatter";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import { RatingStars } from "./product/RatingStars";
import {
  Flame,
  Star,
  Shield,
  Truck,
  Clock,
  Award,
  TrendingUp,
  Zap,
  Crown,
} from "lucide-react";
import { urlFor } from "@/sanity/image";
import { calculateProductPrice } from "@/lib/pricing-utils";
import { cn } from "@/lib/utils";

// Helper function to get segment badge styles
const getSegmentBadgeStyle = (segment: string) => {
  const styles = {
    "new-arrival": {
      icon: Zap,
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    "best-seller": {
      icon: TrendingUp,
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    featured: {
      icon: Star,
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    "special-offer": {
      icon: Flame,
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
    },
    "editors-choice": {
      icon: Award,
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    trending: {
      icon: TrendingUp,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    "limited-edition": {
      icon: Crown,
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    exclusive: {
      icon: Shield,
      bg: "bg-pink-100",
      text: "text-pink-700",
      border: "border-pink-200",
    },
  };
  return (
    styles[segment as keyof typeof styles] || {
      icon: Star,
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    }
  );
};


interface ProductCardProps {
  product: Omit<Product, "categories" | "brand"> & {
    categories?: (string | NonNullable<Product["categories"]>[number])[] | null;
    brand?: string | NonNullable<Product["brand"]> | null;
  };
  layout?: "grid" | "list";
}

const ProductCard = ({ product, layout = "grid" }: ProductCardProps) => {

  const router = useRouter();
const { addItem } = useCartStore();

const handleBuyNow = () => {
  addItem(product as unknown as Product);
  router.push("/cart");
};
  // Calculate pricing using utility function
  const { displayPrice, originalPrice, hasDiscount } =
    calculateProductPrice(product as unknown as Product);

  // Get primary product segment for badge
  const primarySegment = product?.productSegments?.[0];
  const segmentStyle = primarySegment
    ? getSegmentBadgeStyle(primarySegment)
    : null;

  // Stock status
  const isOutOfStock = !product?.stock || product?.stock <= 0;

  const isLowStock =
    product?.stock && product?.stock <= (product?.lowStockThreshold || 10);

  return (
    <div
      className={cn(
        "text-sm border rounded-lg border-gray-200 group bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
        layout === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative group overflow-hidden bg-zamzam-white shrink-0",
          layout === "list"
            ? "w-full sm:w-48 sm:border-r border-gray-100"
            : "rounded-t-lg border-b border-gray-100"
        )}
      >
        {product?.images && (
          <Link href={`/products/${product?.slug?.current}`}>
            <div
              className={cn(
                "flex items-center justify-center p-4",
                layout === "list" ? "h-48 sm:h-full" : "aspect-5/5"
              )}
            >
              <img
                src={urlFor(product.images[0]).url()}
                className={cn(
                  "max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500",
                  !isOutOfStock ? "group-hover:scale-105" : "opacity-50"
                )}
                alt={product?.name || "Product image"}
                loading="lazy"
              />
            </div>
          </Link>
        )}

        {/* Side Menu - Only show in grid view or hidden on mobile list view */}
        <div className={layout === "list" ? "hidden sm:block" : ""}>
          <ProductSideMenu product={product as unknown as Product} />
        </div>

        {/* Top Left Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {/* Product Segment Badge */}
          {primarySegment && segmentStyle && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${segmentStyle.bg} ${segmentStyle.text} ${segmentStyle.border} border`}
            >
              <segmentStyle.icon size={12} />
              {primarySegment
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
          )}
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {/* Free Shipping */}
          {product?.freeShipping && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              <Truck size={12} />
              <span className={layout === "list" ? "hidden lg:inline" : ""}>
                Free Ship
              </span>
            </div>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3 flex-1 h-full">
        {/* Categories */}
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-zamzam-text-light">
            {product.categories.map((cat: any) => cat.title || cat).join(", ")}
          </p>
        )}

        {/* Product Name */}
        <Title
          className={cn(
            "text-sm font-medium leading-tight group-hover:text-zamzam-primary transition-colors",
            layout === "list" ? "text-base lg:text-lg" : "line-clamp-2"
          )}
        >
          {product?.name}
        </Title>

        {/* Short Description */}
        {product?.shortDescription && (
          <p
            className={cn(
              "text-xs text-gray-600 leading-relaxed",
              layout === "list" ? "line-clamp-3 mb-2" : "line-clamp-2"
            )}
          >
            {product.shortDescription}
          </p>
        )}

        {/* Ratings & Stock Row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {/* Ratings */}
          <div className="flex items-center gap-1.5">
            <RatingStars
              rating={product?.averageRating || 0}
              totalReviews={product?.totalReviews}
              size={14}
              showText={false}
            />
             <span className="text-xs text-gray-500">
              {product?.averageRating?.toFixed(1) || "0.0"}
            </span>
             {/* {product?.totalReviews && (
              <span className="text-xs text-gray-400">
                ({product.totalReviews.toLocaleString()})
              </span>
            )} */}
          </div>
 
          {/* Separator */}
          <div className="h-3 w-px bg-gray-300 hidden sm:block"></div>

          {/* Stock Status */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">
              {isOutOfStock ? (
                <span className="text-red-600">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-orange-600">Low Stock</span>
              ) : (
                <span className="text-green-600">In Stock</span>
              )}
            </span>
            {!isOutOfStock && product?.stock && (
              <span className="text-xs text-gray-500">
                ({product.stock} available)
              </span>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        {product?.deliveryTime && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock size={12} />
            <span>Delivery: {product.deliveryTime.replace("-", " ")}</span>
          </div>
        )}

        {/* Spacer to push price and button to bottom in grid view */}
        <div className="mt-auto pt-2" />

        {/* Bottom Row: Price & Button */}
        <div
          className={cn(
            "flex items-center gap-4",
            layout === "list"
              ? "flex-col sm:flex-row sm:justify-between sm:items-end mt-auto"
              : "flex-col items-start gap-3"
          )}
        >
          {/* Pricing */}
          <div className="flex items-end gap-2">
            <PriceFormatter
              amount={displayPrice}
              className="text-lg font-bold text-zamzam-primary"
            />
            {hasDiscount && (
              <PriceFormatter
                amount={originalPrice}
                className="text-sm text-gray-500 line-through mb-1"
              />
            )}
            {hasDiscount && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded mb-1">
                {Math.round(
                  ((originalPrice - displayPrice) / originalPrice) * 100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div
  className={
    layout === "list"
      ? "w-full sm:w-auto sm:min-w-[140px]"
      : "w-full"
  }
>
  <div className="flex flex-col gap-2">
    <AddToCartButton
      product={product as unknown as Product}
      className="w-full rounded-lg font-medium"
    />

    <Button
      onClick={handleBuyNow}
      disabled={isOutOfStock}
      variant="outline"
      className="w-full rounded-lg font-medium"
    >
      Buy Now
    </Button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
