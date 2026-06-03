"use client";

import React, { useEffect, useState, ReactNode } from "react";

interface HeaderScrollEffectProps {
  children: ReactNode;
}

const HeaderScrollEffect = ({ children }: HeaderScrollEffectProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0;

      setScrollY(currentScrollY);
      setScrollProgress(progress);
      setIsScrolled(currentScrollY > 10);
    };

    // Initial scroll position check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`relative transition-all duration-500 ease-out ${
        isScrolled ? "py-2 md:py-3" : "py-5"
      }`}
      style={{
        background: isScrolled
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.7)",
        backdropFilter: isScrolled ? "blur(20px)" : "blur(8px)",
        boxShadow: isScrolled
          ? "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(229, 231, 235, 0.5)"
          : "none",
      }}
    >
      {/* Subtle parallax background effect */}
      {/* <div
        className={`absolute inset-0 bg-gradient-to-b from-zamzam-primary/2 to-transparent transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      /> */}

      <div
        className={`relative transition-all duration-300 ease-out ${
          isScrolled ? "scale-[0.99]" : "scale-100"
        }`}
      >
        {/* Enhanced content wrapper with subtle glow */}
        <div
          className={`relative ${isScrolled ? "filter drop-shadow-sm" : ""}`}
        >
          {children}
        </div>

        {/* Scroll progress gradient line */}
        <div className="absolute -bottom-2.5 md:-bottom-3 left-0 right-0 h-[1px] overflow-hidden">
          <div
            className="h-full bg-zamzam-primary transition-all duration-300 ease-out"
            style={{
              width: `${scrollProgress}%`,
              opacity: isScrolled ? 1 : 0,
            }}
          />
        </div>

        {/* Subtle top highlight when scrolled */}
        <div
          className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Dynamic shadow underneath when scrolled */}
      <div
        className={`absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-b from-black/5 to-transparent transition-opacity duration-500 pointer-events-none ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default HeaderScrollEffect;
