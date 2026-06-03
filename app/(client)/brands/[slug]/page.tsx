import React from "react";
import Container from "@/components/Container";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrand, getProductsByBrand } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";

interface SingleBrandProps {
  params: {
    slug: string;
  };
}

const SingleBrand = async ({ params }: SingleBrandProps) => {
  const { slug } = await params;

  // Get brand details and brand products
  const [brand, brandProducts] = await Promise.all([
    getBrand(slug),
    getProductsByBrand(slug),
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <div className="bg-zamzam-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-zamzam-white border-b border-zamzam-surface">
        <Container>
          <div className="py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-zamzam-text-muted hover:text-zamzam-primary transition-colors"
              >
                Home
              </Link>
              <span className="text-zamzam-text-light">/</span>
              <Link
                href="/brands"
                className="text-zamzam-text-muted hover:text-zamzam-primary transition-colors"
              >
                Brands
              </Link>
              <span className="text-zamzam-text-light">/</span>
              <span className="text-zamzam-text-dark font-medium">
                {brand.title}
              </span>
            </nav>
          </div>
        </Container>
      </div>

      {/* Brand Header */}
      <div className="bg-gradient-to-br from-zamzam-white to-zamzam-surface py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Brand Logo and Info */}
            <div className="text-center lg:text-left">
              {brand.logo && (
                <div className="mb-6">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 bg-zamzam-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                    <img
                      src={urlFor(brand.logo).url()}
                      alt={brand.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <h1 className="text-3xl lg:text-4xl font-bold text-zamzam-text-dark">
                    {brand.title}
                  </h1>
                  {brand.status === "active" && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  )}
                </div>

                {brand.tagline && (
                  <p className="text-xl text-zamzam-text-muted italic">
                    "{brand.tagline}"
                  </p>
                )}

                {brand.shortDescription && (
                  <p className="text-zamzam-text-medium leading-relaxed">
                    {brand.shortDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Brand Stats */}
            <div className="space-y-6">
              <Card className="bg-zamzam-white border-zamzam-surface">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-zamzam-text-dark mb-4">
                    Brand Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-zamzam-surface rounded-xl">
                      <div className="text-2xl font-bold text-zamzam-primary">
                        {brandProducts.length}
                      </div>
                      <div className="text-sm text-zamzam-text-muted">
                        Products
                      </div>
                    </div>
                    <div className="text-center p-4 bg-zamzam-surface rounded-xl">
                      <div className="text-2xl font-bold text-zamzam-primary">
                        {brand.brandCode || "N/A"}
                      </div>
                      <div className="text-sm text-zamzam-text-muted">
                        Brand Code
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/products?brand=${brand.slug?.current}`}>
                    <Package className="w-4 h-4 mr-2" />
                    View All Products
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/brands">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Brands
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Brand Products */}
      <Container>
        <div className="py-16 lg:py-20">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-zamzam-text-dark mb-4">
              Products from {brand.title}
            </h2>
            <p className="text-zamzam-text-muted text-lg">
              Discover our complete collection of {brand.title} products
            </p>
          </div>

          {brandProducts.length > 0 ? (
            <ProductGrid products={brandProducts} />
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-zamzam-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-zamzam-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-zamzam-text-dark mb-3">
                No Products Available
              </h3>
              <p className="text-zamzam-text-muted max-w-md mx-auto mb-6">
                This brand doesn't have any products available at the moment.
                Check back later for updates!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/brands">View Other Brands</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SingleBrand;
