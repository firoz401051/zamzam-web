import React from "react";
import Container from "./Container";
import { getAllBrands } from "@/sanity/queries";
import Title from "./Title";
import Link from "next/link";
import { ArrowRight, Star, Package } from "lucide-react";
import AnimatedContainer from "./animated/AnimatedContainer";
import AnimatedBrandCard from "./animated/AnimatedBrandCard";
import { Brand } from "@/sanity.types";

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  return (
    <Container className="mt-10 lg:mt-20">
      <AnimatedContainer className="bg-gradient-to-br from-zamzam-background to-zamzam-surface rounded-2xl p-6 lg:p-8 border border-zamzam-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Title className="text-2xl lg:text-3xl font-bold text-zamzam-text-dark mb-2">
              Shop By Brands
            </Title>
            <p className="text-zamzam-text-medium">
              Discover products from your favorite brands
            </p>
          </div>
          <Link
            href="/brands"
            className="group flex items-center gap-2 px-4 py-2 bg-zamzam-white border border-zamzam-primary/20 rounded-xl text-zamzam-primary hover:bg-zamzam-primary hover:text-white font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
          {brands && brands.length > 0 ? (
            brands.map((brand: Brand, index: number) => (
              <AnimatedBrandCard key={brand?._id} brand={brand} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-zamzam-text-light mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zamzam-text-medium mb-2">
                No Brands Available
              </h3>
              <p className="text-zamzam-text-muted">
                Check back later for brand collections.
              </p>
            </div>
          )}
        </div>

        {/* Brand Statistics & Highlights */}
        <div className="bg-zamzam-white rounded-xl p-6 border border-zamzam-surface">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-zamzam-primary" />
            <h3 className="text-lg font-bold text-zamzam-text-dark">
              Premium Brand Collection
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand Count */}
            <div className="text-center p-4 bg-zamzam-surface rounded-xl hover:bg-zamzam-primary-light transition-colors duration-300 group">
              <div className="text-2xl lg:text-3xl font-bold text-zamzam-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {brands?.length || 0}+
              </div>
              <h4 className="font-semibold text-zamzam-text-dark mb-1">
                Trusted Brands
              </h4>
              <p className="text-sm text-zamzam-text-medium">
                Carefully curated premium brands for quality assurance
              </p>
            </div>

            {/* Quality Guarantee */}
            <div className="text-center p-4 bg-zamzam-surface rounded-xl hover:bg-zamzam-primary-light transition-colors duration-300 group">
              <div className="text-2xl lg:text-3xl font-bold text-zamzam-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <h4 className="font-semibold text-zamzam-text-dark mb-1">
                Authentic Products
              </h4>
              <p className="text-sm text-zamzam-text-medium">
                Direct partnerships ensuring genuine brand products
              </p>
            </div>

            {/* Global Reach */}
            <div className="text-center p-4 bg-zamzam-surface rounded-xl hover:bg-zamzam-primary-light transition-colors duration-300 group">
              <div className="text-2xl lg:text-3xl font-bold text-zamzam-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <h4 className="font-semibold text-zamzam-text-dark mb-1">
                Countries Served
              </h4>
              <p className="text-sm text-zamzam-text-medium">
                International brands from around the world
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 p-4 bg-gradient-to-r from-zamzam-primary/5 to-zamzam-primary-light rounded-xl border border-zamzam-primary/10">
            <div className="text-center">
              <h4 className="font-bold text-zamzam-text-dark mb-2">
                Can't find your favorite brand?
              </h4>
              <p className="text-zamzam-text-medium mb-4 text-sm">
                We're constantly adding new brands to our collection. Let us
                know what you're looking for!
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2 bg-zamzam-primary text-white rounded-lg hover:bg-zamzam-primary-hover font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Suggest a Brand
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </Container>
  );
};

export default ShopByBrands;
