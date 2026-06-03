import React from "react";
import Container from "@/components/Container";
import {
  getAllProducts,
  getAllCategories,
  getAllBrands,
} from "@/sanity/queries";
import { Breadcrumb, createBreadcrumbs } from "@/components/Breadcrumb";
import ProductsPageClient from "@/components/ProductsPageClient";

export const metadata = {
  title: "All Products - zamzam",
  description:
    "Browse our complete collection of products. Find the perfect items with our advanced filtering and search options.",
};

const ProductPage = async () => {
  // Fetch initial data
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  // Generate breadcrumbs
  const breadcrumbItems = createBreadcrumbs.products();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <Container className="py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-zamzam-text-dark mb-2">
            All Products
          </h1>
          <p className="text-zamzam-text-muted text-lg">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Products with filtering */}
        <ProductsPageClient
          initialProducts={products || []}
          categories={categories || []}
          brands={brands || []}
        />
      </Container>
    </div>
  );
};

export default ProductPage;
