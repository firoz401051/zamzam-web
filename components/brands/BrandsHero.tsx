"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import Container from "@/components/Container";

interface BrandsHeroProps {
  brandsCount: number;
}

const BrandsHero = ({ brandsCount }: BrandsHeroProps) => {
  return (
    <div className="relative bg-gradient-to-br from-zamzam-primary via-zamzam-primary-hover to-zamzam-primary-dark py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-zamzam-white rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-zamzam-white rounded-full translate-x-40 translate-y-40"></div>
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 bg-zamzam-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Building2 className="h-6 w-6 text-zamzam-white" />
            <span className="text-zamzam-white font-medium">
              Trusted Brands
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zamzam-white mb-6 leading-tight">
            Discover{" "}
            <span className="text-zamzam-primary-light">Premium Brands</span>
          </h1>
          <p className="text-xl text-zamzam-white/90 max-w-3xl mx-auto leading-relaxed">
            Explore our curated collection of trusted brands offering quality
            products across diverse categories. Find your favorite brands and
            discover new ones.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-zamzam-white">
                {brandsCount}
              </div>
              <div className="text-zamzam-white/80">Brands</div>
            </div>
            <div className="w-px h-12 bg-zamzam-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zamzam-white">100%</div>
              <div className="text-zamzam-white/80">Authentic</div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default BrandsHero;
