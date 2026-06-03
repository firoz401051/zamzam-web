"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedBlogContentProps {
  children: ReactNode;
  delay?: number;
}

const AnimatedBlogContent = ({
  children,
  delay = 0,
}: AnimatedBlogContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="prose prose-lg max-w-none"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedBlogContent;
