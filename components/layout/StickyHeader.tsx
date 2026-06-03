"use client";

import React, { useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";

interface StickyHeaderProps {
  topBar: React.ReactNode;
  children: React.ReactNode;
}

const StickyHeader = ({ topBar, children }: StickyHeaderProps) => {
  const { scrollY } = useScroll();
  const [showTopBar, setShowTopBar] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    
    // Always show if near top or scrolling up significantly
    if (latest < 50) {
      setShowTopBar(true);
    } else if (diff > 5) {
      // Scrolling down
      setShowTopBar(false);
    } else if (diff < -5) {
      // Scrolling up
      setShowTopBar(true);
    }
  });

  return (
    <header className="sticky top-0 z-50 bg-white shadow-none">
      <motion.div 
        className="bg-zamzam-text-dark overflow-hidden relative z-50"
        initial={false}
        animate={{ height: showTopBar ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <motion.div
          animate={{ y: showTopBar ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {topBar}
        </motion.div>
      </motion.div>
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm relative z-40 transition-shadow duration-300">
        {children}
      </div>
    </header>
  );
};

export default StickyHeader;
