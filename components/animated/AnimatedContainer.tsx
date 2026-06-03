"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
}

const AnimatedContainer = ({
  children,
  className = "",
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
