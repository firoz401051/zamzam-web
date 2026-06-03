"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/sanity.types";
import { ProductGridProps } from "@/types/components";

const ProductGrid = ({ products, className = "" }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 ${className}`}
    >
      {products.map((product: Product, index: number) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
