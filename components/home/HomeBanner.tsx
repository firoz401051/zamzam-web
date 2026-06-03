import React from "react";
import Container from "../Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import bannerOne from "@/public/images/banner/banner_1.jpg";
import bannerTwo from "@/public/images/banner/banner_2.jpg";
import bannerThree from "@/public/images/banner/banner_3.jpg";

const HomeBanner = () => {
  return (
    <div className="bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 py-10 relative overflow-hidden">
      {/* Gentle Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating circles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-40 animate-float-gentle"></div>
        <div
          className="absolute bottom-32 left-16 w-40 h-40 bg-blue-200 rounded-full opacity-30 animate-float-reverse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-200 rounded-full opacity-50 animate-fade-scale"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Medium floating shapes */}
        <div
          className="absolute top-40 left-1/3 w-20 h-20 bg-indigo-200 rounded-full opacity-35 animate-float-gentle"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-28 h-28 bg-cyan-200 rounded-full opacity-40 animate-float-reverse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Small floating dots */}
        <div className="absolute top-32 left-20 w-12 h-12 bg-rose-200 rounded-full opacity-45 animate-fade-scale"></div>
        <div
          className="absolute bottom-40 right-32 w-16 h-16 bg-emerald-200 rounded-full opacity-35 animate-float-gentle"
          style={{ animationDelay: "5s" }}
        ></div>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Banner - Women Fashion */}
          <div className="lg:col-span-2 bg-linear-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[350px] sm:min-h-[400px] flex items-center shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="relative z-20 w-full max-w-xs sm:max-w-sm lg:max-w-md animate-fade-in-up space-y-4">
              <p className="text-xs sm:text-sm font-bold text-purple-700 bg-white/90 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm inline-block">
                🔥 Get up to 50% off Today Only!
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Woman Fashion
              </h1>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm sm:max-w-md">
                Discover the latest trends in women's fashion. From casual wear
                to elegant dresses that make you shine.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-2.5 sm:px-10 sm:py-6 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2"
                  >
                    SHOP NOW
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Enhanced Image Section */}
            <div className="absolute right-0 top-0 h-full w-2/5 sm:w-1/2 lg:w-5/12">
              <div className="relative h-full rounded-r-3xl overflow-hidden">
                <Image
                  src={bannerOne}
                  alt="Woman Fashion"
                  fill
                  className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-pink-100/60"></div>

                <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
                  NEW ARRIVALS
                </div>
              </div>
            </div>
          </div>

          {/* Side Banners */}
          <div className="flex flex-col gap-6">
            {/* New Collection Banner */}
            <div className="bg-linear-to-br from-blue-100 via-cyan-100 to-teal-100 rounded-3xl p-6 relative overflow-hidden h-44 sm:h-48 lg:h-56 xl:h-64 flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative z-10 space-y-2 max-w-[65%]">
                <p className="text-xs font-bold text-blue-700 bg-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm inline-block">
                  🎯 Super Sale
                </p>
                <h3 className="text-xl sm:text-2xl font-black bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                  New Collection
                </h3>
                <Button
                  asChild
                  size="sm"
                  className="bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border-0 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 mt-2 font-bold"
                >
                  <Link href="/products" className="flex items-center gap-1">
                    Shop Now
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </Link>
                </Button>
              </div>

              <div className="absolute -right-2 -top-2 w-24 sm:w-28 lg:w-32 xl:w-36 h-28 sm:h-32 lg:h-36 xl:h-40">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-500 rotate-12 group-hover:rotate-6">
                  <Image
                    src={bannerTwo}
                    alt="Fashion Accessories"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 128px, 160px"
                  />
                  <div className="absolute inset-0 ring-inset ring-2 ring-black/5 rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* Men's Fashion Banner */}
            <div className="bg-linear-to-br from-green-100 via-emerald-100 to-teal-100 rounded-3xl p-6 relative overflow-hidden h-44 sm:h-48 lg:h-56 xl:h-64 flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative z-10 space-y-2 max-w-[65%]">
                <p className="text-xs font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm inline-block">
                  👔 For Him
                </p>
                <h3 className="text-xl sm:text-2xl font-black bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
                  Men's Fashion
                </h3>
                 <Button
                  asChild
                  size="sm"
                  className="bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border-0 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 mt-2 font-bold"
                >
                  <Link
                    href="/category/men"
                    className="flex items-center gap-1"
                  >
                    Shop Now
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </Link>
                </Button>
              </div>

              <div className="absolute -right-2 bottom-0 w-24 sm:w-28 lg:w-32 xl:w-36 h-28 sm:h-32 lg:h-36 xl:h-40">
                 <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-500 -rotate-12 group-hover:-rotate-6">
                  <Image
                    src={bannerThree}
                    alt="Men Fashion"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 128px, 160px"
                  />
                  <div className="absolute inset-0 ring-inset ring-2 ring-black/5 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Banner Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Kids Fashion */}
          <div className="bg-linear-to-r from-yellow-50 via-orange-50 to-red-50 rounded-3xl p-6 relative overflow-hidden h-32 sm:h-40 flex items-center shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer border border-white/60">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-300/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-300/30 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 w-[65%] pl-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/80 backdrop-blur-sm text-orange-600 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-orange-100">
                  30% OFF
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black mb-2 bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-none">
                Kids World
              </h4>
              <Link
                href="/category/kids"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors"
              >
                Explore Now 
                <span className="text-xs group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            {/* Enhanced Icon/Image Area */}
            <div className="absolute right-0 top-0 h-full w-[35%] flex items-center justify-center">
               <div className="relative w-20 h-20 sm:w-24 sm:h-24 group-hover:scale-110 transition-transform duration-500 ease-out">
                 <div className="absolute inset-0 bg-orange-200/40 rounded-full blur-xl animate-pulse"></div>
                 <div className="relative w-full h-full flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl drop-shadow-md transform group-hover:rotate-12 transition-transform duration-500">
                      👶
                    </span>
                 </div>
               </div>
            </div>
          </div>

          {/* Accessories */}
          <div className="bg-linear-to-r from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-6 relative overflow-hidden h-32 sm:h-40 flex items-center shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer border border-white/60">
             <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-300/30 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 w-[60%] pl-2">
               <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/80 backdrop-blur-sm text-purple-600 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-purple-100">
                  NEW ARRIVALS
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black mb-2 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                Accessories
              </h4>
              <Link
                href="/category/accessories"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors"
              >
                Shop Now
                <span className="text-xs group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

             <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <div className="absolute inset-0 bg-white rounded-full opacity-60 blur-md group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-500 group-hover:shadow-pink-200/50">
                    <Image
                      src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=120&h=120&fit=crop&crop=center"
                      alt="Accessories"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  {/* Floating badge effect */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-100 rounded-full border-2 border-white z-10"></div>
              </div>
            </div>
          </div>

          {/* Shoes */}
          <div className="bg-linear-to-r from-gray-50 via-slate-50 to-zinc-50 rounded-3xl p-6 relative overflow-hidden h-32 sm:h-40 flex items-center shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer border border-white/60">
             <div className="absolute inset-0 opacity-40">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-200/40 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 w-[60%] pl-2">
               <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/80 backdrop-blur-sm text-gray-600 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-gray-100">
                  TRENDING
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black mb-2 bg-linear-to-r from-gray-700 to-slate-600 bg-clip-text text-transparent leading-none">
                Footwear
              </h4>
               <Link
                href="/category/shoes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors"
              >
                Discover
                <span className="text-xs group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
               <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <div className="absolute inset-0 bg-white rounded-full opacity-60 blur-md group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-500 group-hover:shadow-gray-300/50">
                    <Image
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&crop=center"
                      alt="Shoes"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gray-200 rounded-full border-2 border-white z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeBanner;
