/**
 * Utility functions for calculating product prices with discounts
 */

interface ProductPrice {
  price?: number;
  salePrice?: number;
  discount?: number;
}

/**
 * Calculate the final display price for a product
 * @param product Product with pricing information
 * @returns Object with displayPrice, originalPrice, hasDiscount, and discountPercentage
 */
export function calculateProductPrice(product: ProductPrice) {
  const originalPrice = product?.price || 0;
  const salePrice = product?.salePrice;
  const discount = product?.discount || 0;

  let displayPrice = originalPrice;
  let hasDiscount = false;

  // Priority: salePrice > discount percentage > original price
  if (salePrice && salePrice < originalPrice) {
    displayPrice = salePrice;
    hasDiscount = true;
  } else if (discount > 0) {
    displayPrice = originalPrice - (originalPrice * discount) / 100;
    hasDiscount = true;
  }

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const savingsAmount = hasDiscount ? originalPrice - displayPrice : 0;

  return {
    displayPrice,
    originalPrice,
    hasDiscount,
    discountPercentage,
    savingsAmount,
  };
}

/**
 * Calculate the final price for a single product (used in cart calculations)
 * @param product Product with pricing information
 * @returns Final price after all discounts
 */
export function getFinalPrice(product: ProductPrice): number {
  return calculateProductPrice(product).displayPrice;
}
