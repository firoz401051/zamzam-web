import Container from "@/components/Container";
import { getProductBySlug } from "@/sanity/queries";
import { getProductReviews } from "@/sanity/helpers/reviewHelpers";


import { Award } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { urlFor } from "@/sanity/image";
import Link from "next/link";
import PriceFormatter from "@/components/PriceFormatter";
import { calculateProductPrice } from "@/lib/pricing-utils";

// Import client components
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { RatingStars } from "@/components/product/RatingStars";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { Breadcrumb, createBreadcrumbs } from "@/components/Breadcrumb";
import ProductReviews from "@/components/reviews/ProductReviews";


const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const reviews = product ? await getProductReviews(product._id) : [];


  if (!product) {
    return notFound();
  }

  // Ensure price is undefined if null
  const productForPricing = {
    ...product,
    price: product?.price ?? undefined,
    salePrice: product?.salePrice ?? undefined,
    discount: product?.discount ?? undefined,
  };

  // Calculate pricing using utility function
  const {
    displayPrice,
    originalPrice,
    hasDiscount,
    discountPercentage,
    savingsAmount,
  } = calculateProductPrice(productForPricing);

  // Generate breadcrumbs
  const breadcrumbItems = createBreadcrumbs.product(
    product?.name || "Product",
    (product as any)?.categories?.[0]?.title,
    (product as any)?.categories?.[0]?.slug?.current
  );

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              {product?.images && (
              <ProductImageGallery
                  images={product.images}
                  productName={product.name || ""}
                />
              )}
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className="lg:col-span-4 space-y-4" data-product-details>
            {/* Brand */}
            {(product as any)?.brand && (
              <div className="text-sm">
                <span className="text-gray-600">Brand: </span>
                <Link
                  href={`/brands/${(product as any).brand.slug?.current}`}
                  className="text-blue-600 hover:text-orange-600"
                >
                  {(product as any).brand.title}
                </Link>
              </div>
            )}

            {/* Product Title */}
            <h1 className="text-2xl font-bold leading-tight text-zamzam-text-dark">
              {product?.name}
            </h1>

            {/* Rating */}
            <RatingStars
              rating={product?.averageRating || undefined}
              totalReviews={product?.totalReviews || undefined}
            />

            {/* zamzam's Choice Badge */}
            {(product as any)?.zamzamChoice && (
              <div className="flex items-center gap-2 bg-orange-100 border border-orange-200 rounded p-2">
                <Award size={16} className="text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-orange-800">
                    zamzam's Choice
                  </div>
                  <div className="text-xs text-orange-600">
                    Highly rated, well-priced products available to ship
                    immediately
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-600">Price:</span>
                <PriceFormatter
                  amount={displayPrice}
                  className="text-2xl font-normal text-red-700"
                />
                {hasDiscount && (
                  <PriceFormatter
                    amount={originalPrice}
                    className="text-sm text-gray-500 line-through"
                  />
                )}
              </div>
              {hasDiscount && (
                <div className="text-sm text-red-700">
                  You save{" "}
                  <PriceFormatter
                    amount={savingsAmount}
                    className="inline font-medium"
                  />{" "}
                  ({discountPercentage}%)
                </div>
              )}
            </div>

            {/* Short Description */}
            {product?.shortDescription && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Specifications */}
            {(product as any)?.specifications &&
              (product as any).specifications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-zamzam-text-dark">
                    Product details
                  </h3>
                  <div className="space-y-2 w-full">
                    {(product as any).specifications.map(
                      (spec: any, index: number) => (
                        <div
                          key={index}
                          className="flex text-sm items-center justify-between"
                        >
                          <span className="w-32 text-zamzam-text-dark shrink-0 font-semibold">
                            {spec.attribute}:
                          </span>
                          <span className="text-gray-900 flex-1">{spec.value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Key Features */}
            {(product as any)?.keyFeatures &&
              (product as any).keyFeatures.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-zamzam-text-dark">
                    Key Features
                  </h3>
                  <ul className="space-y-1">
                    {(product as any).keyFeatures.map(
                      (item: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-zamzam-text-dark/80 font-medium"
                        >
                          <span className="w-1.5 h-1.5 bg-zamzam-text-dark rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* About this item */}
            {(product as any)?.aboutThisItem &&
              (product as any).aboutThisItem.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-zamzam-text-dark">
                    About this item
                  </h3>
                  <ul className="space-y-1">
                    {(product as any).aboutThisItem.map(
                      (item: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-zamzam-text-dark/80 font-medium"
                        >
                          <span className="w-1.5 h-1.5 bg-zamzam-text-dark rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* ASIN */}
            {(product as any)?.asin && (
              <div className="text-sm text-gray-600">
                ASIN:{" "}
                <span className="text-gray-900">{(product as any).asin}</span>
              </div>
            )}
          </div>

          {/* Right Column - Purchase Options */}
          <div className="lg:col-span-3">
            <div className="self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <PurchasePanel
                product={product}
                displayPrice={displayPrice}
                hasDiscount={!!hasDiscount}
                discountPercentage={discountPercentage}
                originalPrice={originalPrice}
              />
            </div>
          </div>
        </div>

        {(product as any)?.relatedProducts &&
          (product as any).relatedProducts.length > 0 && (
            <div className="py-8 border-t">
              <h2 className="text-xl font-medium mb-4">Related products</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {(product as any).relatedProducts.map((relatedProduct: any) => (
                  <Link
                    key={relatedProduct._id}
                    href={`/products/${relatedProduct.slug?.current}`}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    {relatedProduct.images?.[0] && (
                      <div className="aspect-4/3 flex items-center justify-center p-2 mb-2">
                        <img
                          src={urlFor(relatedProduct.images[0]).url()}
                          alt={relatedProduct.name || ""}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-sm">
                      <RatingStars
                        rating={relatedProduct.averageRating || undefined}
                        showText={false}
                        size={12}
                      />
                    </div>
                    <div className="text-lg font-medium text-red-700 mt-1">
                      <PriceFormatter
                        amount={
                          calculateProductPrice(relatedProduct).displayPrice
                        }
                        className="text-lg font-medium text-red-700"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* Reviews Section */}
        <div className="py-12 border-t">
           <ProductReviews productId={product._id} reviews={reviews} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
