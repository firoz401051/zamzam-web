"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, ArrowRight, Star, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/image";
import { Brand } from "@/sanity.types";
import { BrandsGridProps } from "@/types/components";

const BrandsGrid = ({ brands }: BrandsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
      {brands.map((brand: Brand, index: number) => (
        <motion.div
          key={brand._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          className="group"
        >
          <Link href={`/brands/${brand.slug?.current}`}>
            <Card className="h-full bg-zamzam-white border-2 border-zamzam-surface hover:border-zamzam-primary shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:bg-zamzam-primary-light/5">
              <CardContent className="p-6">
                {/* Header with Logo and Status */}
                <div className="flex items-start justify-between mb-4">
                  {/* Brand Logo */}
                  <div className="relative">
                    {brand.logo ? (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-zamzam-surface group-hover:border-zamzam-primary/40 shadow-sm bg-zamzam-white">
                        <img
                          src={urlFor(brand.logo).url()}
                          alt={brand.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-zamzam-primary-light to-zamzam-surface border-2 border-zamzam-surface group-hover:border-zamzam-primary/40 shadow-sm">
                        <Building2 className="h-8 w-8 lg:h-10 lg:w-10 text-zamzam-primary opacity-90" />
                      </div>
                    )}

                    {/* Status Badge */}
                    {brand.status === "active" && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brand Code Badge */}
                  {brand.brandCode && (
                    <Badge className="bg-zamzam-surface text-zamzam-text-muted border-0 text-xs font-mono">
                      {brand.brandCode}
                    </Badge>
                  )}
                </div>

                {/* Brand Content */}
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors duration-300 line-clamp-2 leading-tight">
                      {brand.title}
                    </h3>
                    {brand.tagline && (
                      <p className="text-sm text-zamzam-text-muted italic line-clamp-1 mt-1">
                        {brand.tagline}
                      </p>
                    )}
                  </div>

                  {/* Short Description */}
                  {brand.shortDescription && (
                    <p className="text-zamzam-text-muted text-sm line-clamp-2 leading-relaxed">
                      {brand.shortDescription}
                    </p>
                  )}

                  {/* Bottom Section with Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-zamzam-surface">
                    <span className="text-sm text-zamzam-text-muted font-medium group-hover:text-zamzam-primary transition-colors duration-300">
                      View Brand
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

export default BrandsGrid;
