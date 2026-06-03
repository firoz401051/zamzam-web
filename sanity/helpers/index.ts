import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

// export const getAllProducts = async () => {
//   const PRODUCTS_QUERY = defineQuery(`*[_type=="product"] | order(name asc)`);
//   try {
//     const products = await sanityFetch({
//       query: PRODUCTS_QUERY,
//     });
//     return products.data || [];
//   } catch (error) {
//     console.log("Error fetching all products:", error);
//     return [];
//   }
// };

// export const getAllCategories = async () => {
//   const CATEGORIES_QUERY = defineQuery(
//     `*[_type=="category"] | order(name asc)`
//   );

//   try {
//     const categories = await sanityFetch({
//       query: CATEGORIES_QUERY,
//     });
//     return categories.data || [];
//   } catch (error) {
//     console.log("Error fetching all categories:", error);
//     return [];
//   }
// };

// export const searchProductsByName = async (searchParam: string) => {
//   const PRODUCT_SEARCH_QUERY = defineQuery(
//     `*[_type == "product" && name match $searchParam] | order(name asc)`
//   );

//   try {
//     const products = await sanityFetch({
//       query: PRODUCT_SEARCH_QUERY,
//       params: {
//         searchParam: `${searchParam}`,
//       },
//     });
//     return products?.data || [];
//   } catch (error) {
//     console.error("Error fetching products by name:", error);
//     return [];
//   }
// };

// export const getProductBySlug = async (slug: string) => {
//   const PRODUCT_BY_ID_QUERY = defineQuery(
//     `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
//   );

//   try {
//     const product = await sanityFetch({
//       query: PRODUCT_BY_ID_QUERY,
//       params: {
//         slug,
//       },
//     });
//     return product?.data || null;
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     return null;
//   }
// };

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCT_BY_CATEGORY_QUERY = defineQuery(
    `*[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)`
  );
  try {
    const products = await sanityFetch({
      query: PRODUCT_BY_CATEGORY_QUERY,
      params: {
        categorySlug,
      },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const getSale = async () => {
  const SALE_QUERY = defineQuery(`*[_type == 'sale'] | order(name asc)`);
  try {
    const products = await sanityFetch({
      query: SALE_QUERY,
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const getMyOrders = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const MY_ORDERS_QUERY =
    defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
    ...,products[]{
      ...,product->
    }
  }`);

  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return orders?.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// New Product Segment Helper Functions

export const getProductsBySegment = async (segment: string) => {
  const PRODUCTS_BY_SEGMENT_QUERY = defineQuery(
    `*[_type == 'product' && status == "active" && $segment in productSegments] | order(name asc){
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_SEGMENT_QUERY,
      params: { segment },
    });
    return products?.data || [];
  } catch (error) {
    console.error(`Error fetching ${segment} products:`, error);
    return [];
  }
};

export const getNewArrivalProducts = async (limit?: number) => {
  const NEW_ARRIVAL_QUERY = defineQuery(
    `*[_type == 'product' && status == "active" && "new-arrival" in productSegments] | order(_createdAt desc)[0...$limit]{
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: NEW_ARRIVAL_QUERY,
      params: { limit: limit || 12 },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    return [];
  }
};

export const getBestSellerProducts = async (limit?: number) => {
  const BEST_SELLER_QUERY = defineQuery(
    `*[_type == 'product' && status == "active" && "best-seller" in productSegments] | order(salesCount desc)[0...$limit]{
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: BEST_SELLER_QUERY,
      params: { limit: limit || 12 },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching best seller products:", error);
    return [];
  }
};

export const getFeaturedProducts = async (limit?: number) => {
  const FEATURED_QUERY = defineQuery(
    `*[_type == 'product' && status == "active" && "featured" in productSegments] | order(name asc)[0...$limit]{
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: FEATURED_QUERY,
      params: { limit: limit || 12 },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const getSpecialOfferProducts = async (limit?: number) => {
  const SPECIAL_OFFER_QUERY = defineQuery(
    `*[_type == 'product' && status == "active" && "special-offer" in productSegments] | order(discount desc)[0...$limit]{
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: SPECIAL_OFFER_QUERY,
      params: { limit: limit || 12 },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching special offer products:", error);
    return [];
  }
};

export const getAllProductsWithSegments = async (limit?: number) => {
  const ALL_PRODUCTS_WITH_SEGMENTS_QUERY = defineQuery(
    `*[_type == 'product' && status == "active"] | order(_createdAt desc)[0...$limit]{
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: ALL_PRODUCTS_WITH_SEGMENTS_QUERY,
      params: { limit: limit || 50 },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching all products with segments:", error);
    return [];
  }
};

// Enhanced product search with segments
export const searchProductsByNameAndSegments = async (
  searchParam: string,
  segments?: string[]
) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(
    `*[_type == "product" && status == "active" && name match $searchParam ${
      segments && segments.length > 0
        ? `&& count((productSegments[@ in $segments])) > 0`
        : ""
    }] | order(name asc){
      ...,
      "categories": categories[]->title,
      "brand": brand->name,
      "categorySlug": categories[0]->slug.current
    }`
  );

  try {
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam: `${searchParam}*`,
        segments: segments || [],
      },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Utility functions
export const getProductSegmentLabel = (segment: string): string => {
  const labels: Record<string, string> = {
    "new-arrival": "New Arrival",
    "best-seller": "Best Seller",
    featured: "Featured",
    "special-offer": "Special Offer",
    "editors-choice": "Editor's Choice",
    trending: "Trending",
    "limited-edition": "Limited Edition",
    exclusive: "Exclusive",
  };
  return labels[segment] || segment;
};

export const calculateDiscountedPrice = (
  price: number,
  salePrice?: number,
  discount?: number
): number => {
  if (salePrice && salePrice > 0) {
    return salePrice;
  }
  if (discount && discount > 0) {
    return price * (1 - discount / 100);
  }
  return price;
};

export const isProductInStock = (
  stock?: number,
  trackInventory?: boolean
): boolean => {
  if (!trackInventory) return true;
  return stock !== undefined && stock > 0;
};

// Utility functions for slug-based product identification
export const getProductIdentifier = (product: any): string => {
  return product?.slug?.current || product?._id || "unknown";
};

export const getVariantIdentifier = (variant: any): string => {
  return (
    variant?.slug?.current ||
    variant?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "variant"
  );
};

export const generateProductSKU = (slug: string, prefix?: string): string => {
  const baseSlug = slug.replace(/[^a-z0-9-]/gi, "").toUpperCase();
  return prefix ? `${prefix}-${baseSlug}` : baseSlug;
};

export const getFullProductIdentifier = (
  product: any,
  includePrefix?: string
): string => {
  const slug = product?.slug?.current;
  if (!slug) return product?._id || "unknown";

  return generateProductSKU(slug, includePrefix);
};
