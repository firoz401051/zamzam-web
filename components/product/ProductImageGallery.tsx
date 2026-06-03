"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { urlFor } from "@/sanity/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImageGalleryProps } from "@/types/components";

export const ProductImageGallery = ({
  images,
  productName,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  // No additional state needed for simple click-to-zoom

  // Handle click to open full zoom modal
  const handleImageClick = () => {
    setIsZoomed(true);
  };

  // Handle escape key to close zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  // Prevent body scroll when zoom modal is open
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isZoomed]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnail column - horizontal on mobile, vertical on desktop */}
      <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
        {images?.slice(0, 6).map((img, index) => (
          <div
            key={index}
            className={`w-16 h-16 shrink-0 border-2 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all duration-200 p-1 bg-white ${
              selectedImage === index
                ? "border-orange-500 shadow-lg"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(index)}
            onMouseEnter={() => setSelectedImage(index)}
          >
            <img
              src={urlFor(img).size(80, 90).url()}
              alt={`${productName} view ${index + 1}`}
              className="w-full h-full object-contain transition-transform duration-200 hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 order-1 md:order-2">
        <div
          className="relative bg-white border border-gray-100 rounded-lg p-6 max-w-lg mx-auto md:mx-0 cursor-zoom-in group overflow-hidden"
          onClick={handleImageClick}
        >
          <img
            src={urlFor(images[selectedImage]).url()}
            alt={productName}
            className="w-full h-auto max-h-[600px] object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />

          {/* Zoom Icon */}
          <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ZoomIn className="h-5 w-5 text-gray-600" />
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-75 transition-opacity duration-200">
            Click to zoom
          </div>
        </div>
      </div>

      {/* Full Screen Zoom Modal */}
      {isZoomed &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
            }}
          >
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
              {/* Close button */}
              <button
                className="absolute top-6 right-6 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-3 transition-all duration-200 z-[10000] border border-white/20 shadow-lg hover:scale-110"
                onClick={() => setIsZoomed(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-4 transition-all duration-200 z-10 border border-white/20 shadow-lg hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        selectedImage > 0
                          ? selectedImage - 1
                          : images.length - 1
                      );
                    }}
                  >
                    <ChevronLeft className="h-7 w-7 text-white" />
                  </button>
                  <button
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-4 transition-all duration-200 z-10 border border-white/20 shadow-lg hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        selectedImage < images.length - 1
                          ? selectedImage + 1
                          : 0
                      );
                    }}
                  >
                    <ChevronRight className="h-7 w-7 text-white" />
                  </button>
                </>
              )}

              {/* Full size image */}
              <img
                src={urlFor(images[selectedImage]).size(1600, 1600).url()}
                alt={productName}
                className="w-full h-full max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image counter */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 shadow-lg z-[100000]">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
