import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "../Container";
import { summerCollection } from "@/images";
import Image from "next/image";

const SpecialOfferBanner = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
      <Container>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
  Hot Deals of the Week
</h2>

<p className="text-xl font-semibold text-red-600 mb-6">
  Special Offers & Exclusive Discounts upto 50%
</p>
              <p className="text-gray-600 mb-8">
                Discover the latest trends in summer fashion. From casual wear
                to elegant dresses, find everything you need to stay stylish
                this season.
              </p>
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                <Link href="/deal">
  View Deals
</Link>
              </Button>
            </div>

            {/* Image */}
            <div className="relative h-96 lg:h-full bg-gradient-to-br from-orange-200 to-red-200">
              <div className="w-full h-full flex items-center justify-center text-orange-400 p-4">
                <Image
                  src={summerCollection}
                  alt="summerCollection"
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SpecialOfferBanner;
