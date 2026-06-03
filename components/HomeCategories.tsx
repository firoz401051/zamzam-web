"use client";

import { Category } from "@/sanity.types";
import Container from "./Container";
import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { motion } from "motion/react";
import { ArrowRight, Package } from "lucide-react";

interface Props {
  categories: Category[];
}

const HomeCategories = ({ categories }: Props) => {
  return (
    <Container className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-zamzam-white to-zamzam-surface border border-zamzam-primary/10 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-center justify-between mb-8">
          <Title className="text-2xl lg:text-3xl font-bold text-zamzam-text-dark">
            Featured Categories
          </Title>
          <Link
            href="/category"
            className="group flex items-center gap-2 text-zamzam-primary hover:text-zamzam-primary-hover font-medium transition-colors duration-300"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories?.slice(0, 10).map((category, index) => (
            <motion.div
              key={category?._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={{
                  pathname: "/products",
                  query: { category: category?.slug?.current },
                }}
              >
                <div className="bg-zamzam-white rounded-xl p-4 lg:p-5 border-2 border-zamzam-surface hover:border-zamzam-primary shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden relative h-full">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-zamzam-primary/5 to-transparent rounded-bl-full" />

                  <div className="flex flex-col items-center text-center gap-3 lg:gap-4 relative h-full">
                    {/* Image Container */}
                    {category?.image ? (
                      <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-zamzam-surface group-hover:border-zamzam-primary/40 transition-colors duration-300 bg-zamzam-surface flex-shrink-0">
                        <Image
                          src={urlFor(category?.image).url()}
                          alt={category?.title || "Category"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-zamzam-primary/0 group-hover:bg-zamzam-primary/5 transition-colors duration-300" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-zamzam-primary-light to-zamzam-surface flex items-center justify-center border-2 border-zamzam-surface group-hover:border-zamzam-primary/40 transition-colors duration-300 flex-shrink-0">
                        <Package className="w-8 h-8 text-zamzam-primary" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <h3 className="font-bold text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors duration-300 text-sm lg:text-base leading-tight mb-2 line-clamp-2">
                        {category?.title}
                      </h3>

                      {/* Product Count */}
                      {(category as any)?.productCount !== undefined && (
                        <span className="text-xs text-zamzam-text-muted">
                          {(category as any).productCount} products
                        </span>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <ArrowRight className="w-4 h-4 text-zamzam-text-light group-hover:text-zamzam-primary group-hover:translate-y-1 transition-all duration-300 absolute bottom-2 right-2" />
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {(!categories || categories.length === 0) && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-zamzam-text-light mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zamzam-text-medium mb-2">
              No Categories Available
            </h3>
            <p className="text-zamzam-text-muted">
              Check back later for popular categories.
            </p>
          </div>
        )}
      </motion.div>
    </Container>
  );
};

export default HomeCategories;
