"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/image";
import { ExtendedCategory, CategoryGridProps } from "@/types/components";

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
      {categories.map((category: ExtendedCategory, index: number) => (
        <motion.div
          key={category._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          className="group"
        >
          <Link href={`/products?category=${category.slug?.current}`}>
            <Card className="h-full bg-zamzam-white border-2 border-zamzam-surface hover:border-zamzam-primary shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:bg-zamzam-primary-light/5">
              <CardContent className="p-6">
                {/* Header with Image and Badges */}
                <div className="flex items-start justify-between mb-4">
                  {/* Category Image - Smaller Size */}
                  <div className="relative">
                    {category.image ? (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-zamzam-surface group-hover:border-zamzam-primary/40 shadow-sm">
                        <img
                          src={urlFor(category.image).url()}
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center text-white border-2 border-zamzam-surface group-hover:border-zamzam-primary/40 shadow-sm"
                        style={{
                          backgroundColor: category.color || "#fa324d",
                          background: `linear-gradient(135deg, ${category.color || "#fa324d"} 0%, ${category.color || "#fa324d"}dd 100%)`,
                        }}
                      >
                        <Package className="h-8 w-8 lg:h-10 lg:w-10 opacity-90" />
                      </div>
                    )}

                    {/* Featured Badge - Small */}
                    {category.featured && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-zamzam-primary rounded-full flex items-center justify-center shadow-sm">
                          <Star className="w-3 h-3 text-zamzam-white fill-current" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Count Badge */}
                  <Badge className="bg-zamzam-surface text-zamzam-text-muted border-0 text-xs">
                    {category.productCount || 0} items
                  </Badge>
                </div>

                {/* Category Content */}
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors duration-300 line-clamp-2 leading-tight">
                      {category.title}
                    </h3>
                  </div>

                  {/* Short Description */}
                  {category.shortDescription && (
                    <p className="text-zamzam-text-muted text-sm line-clamp-2 leading-relaxed">
                      {category.shortDescription}
                    </p>
                  )}

                  {/* Bottom Section with Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-zamzam-surface">
                    <span className="text-sm text-zamzam-text-muted font-medium group-hover:text-zamzam-primary transition-colors duration-300">
                      Explore Category
                    </span>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-zamzam-text-light group-hover:text-zamzam-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryGrid;
