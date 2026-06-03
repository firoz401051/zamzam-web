import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "./Container";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showContainer?: boolean;
}

export const Breadcrumb = ({
  items,
  className = "",
  showContainer = true,
}: BreadcrumbProps) => {
  const breadcrumbContent = (
    <div
      className={`flex items-center gap-2 py-2 text-xs text-zamzam-text-dark/80 ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="hover:text-orange-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`${
                item.isActive ? "text-gray-800 font-medium" : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={14} className="text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (showContainer) {
    return <Container>{breadcrumbContent}</Container>;
  }

  return breadcrumbContent;
};

// Utility function to generate common breadcrumb patterns
export const createBreadcrumbs = {
  // For product pages
  product: (
    productName: string,
    categoryTitle?: string,
    categorySlug?: string
  ): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(categoryTitle && categorySlug
      ? [{ label: categoryTitle, href: `/category/${categorySlug}` }]
      : []),
    { label: productName, isActive: true },
  ],

  // For category pages
  category: (categoryName: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: categoryName, isActive: true },
  ],

  // For products page
  products: (): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Products", isActive: true },
  ],

  // For brand pages
  brand: (brandName: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Brands", href: "/brands" },
    { label: brandName, isActive: true },
  ],

  // For blog pages
  blog: (postTitle?: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(postTitle ? [{ label: postTitle, isActive: true }] : []),
  ],

  // For account pages
  account: (pageName: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/account" },
    { label: pageName, isActive: true },
  ],

  // Custom breadcrumb builder
  custom: (items: BreadcrumbItem[]): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    ...items,
  ],
};

export default Breadcrumb;
