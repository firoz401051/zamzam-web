import React from "react";
import Container from "@/components/Container";
import Link from "next/link";
import { Package, Building2 } from "lucide-react";
import { getAllBrands } from "@/sanity/queries";
import BrandsHero from "@/components/brands/BrandsHero";
import BrandsGrid from "@/components/brands/BrandsGrid";

const BrandsPage = async () => {
  const brands = await getAllBrands();

  return (
    <div className="bg-zamzam-background min-h-screen">
      {/* Hero Header Section */}
      <BrandsHero brandsCount={brands?.length || 0} />

      {/* Brands Grid Section */}
      <Container>
        <div className="py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-zamzam-text-dark mb-4">
              Discover Premium Brands
            </h2>
            <p className="text-zamzam-text-muted text-lg max-w-2xl mx-auto">
              Explore our curated collection of trusted brands offering quality
              products across various categories.
            </p>
          </div>

          {brands && brands.length > 0 ? (
            <BrandsGrid brands={brands} />
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-zamzam-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-12 w-12 text-zamzam-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-zamzam-text-dark mb-3">
                No Brands Found
              </h3>
              <p className="text-zamzam-text-muted max-w-md mx-auto">
                Brands will appear here once they are added to our platform.
                Check back later!
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-zamzam-surface to-zamzam-white py-16 lg:py-20">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-zamzam-primary-light rounded-full px-6 py-3 mb-6">
              <Package className="h-5 w-5 text-zamzam-primary" />
              <span className="text-zamzam-primary font-medium">
                Shop by Brands
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-zamzam-text-dark mb-6">
              Find Your Favorite Brand
            </h2>
            <p className="text-zamzam-text-muted text-lg mb-8 max-w-2xl mx-auto">
              Browse through our extensive collection of brands or search for
              specific products from your preferred manufacturers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-zamzam-primary hover:bg-zamzam-primary-hover text-zamzam-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Package className="w-5 h-5" />
                Browse All Products
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-zamzam-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BrandsPage;
