"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrolled / maxHeight) * 100, 100);
      setProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Call once to set initial value

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover z-50 origin-left"
      style={{ transformOrigin: "left" }}
    />
  );
};

export default ReadingProgress;
