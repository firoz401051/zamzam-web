"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { Package } from "lucide-react";
import { Brand } from "@/sanity.types";

interface AnimatedBrandCardProps {
  brand: Brand;
  index: number;
}

const AnimatedBrandCard = ({ brand, index }: AnimatedBrandCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/brands/${brand.slug?.current}`} className="block group">
        <div className="bg-zamzam-white rounded-xl p-4 border border-zamzam-surface hover:border-zamzam-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 aspect-square flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zamzam-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {brand?.logo ? (
            <Image
              src={urlFor(brand?.logo).url()}
              alt={brand?.title || "Brand"}
              width={120}
              height={80}
              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 filter group-hover:brightness-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zamzam-surface to-zamzam-primary-light rounded-lg">
              <Package className="w-8 h-8 text-zamzam-primary" />
            </div>
          )}

          {/* Brand Name Overlay */}
          {brand?.title && (
            <div className="absolute bottom-2 left-2 right-2 bg-zamzam-white/90 backdrop-blur-sm rounded px-2 py-1 transition-opacity duration-300">
              <p className="text-xs font-medium text-zamzam-text-dark text-center truncate group-hover:text-zamzam-primary hoverEffect">
                {brand.title}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default AnimatedBrandCard;
