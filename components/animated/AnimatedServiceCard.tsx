"use client";

import { motion } from "motion/react";
import { Truck, RotateCcw, Headphones, Shield } from "lucide-react";

type IconName = "truck" | "rotateCcw" | "headphones" | "shield";

interface ServiceFeature {
  iconName: IconName;
  title: string;
  description: string;
  gradient: string;
  bgColor: string;
  iconColor: string;
}

interface AnimatedServiceCardProps {
  feature: ServiceFeature;
  index: number;
}

const AnimatedServiceCard = ({ feature, index }: AnimatedServiceCardProps) => {
  const iconMap = {
    truck: Truck,
    rotateCcw: RotateCcw,
    headphones: Headphones,
    shield: Shield,
  };

  const IconComponent = iconMap[feature.iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-zamzam-white rounded-2xl p-6 border border-zamzam-surface hover:border-zamzam-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 text-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
      />

      {/* Icon */}
      <div
        className={`relative inline-flex items-center justify-center w-20 h-20 ${feature.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-lg`}
      >
        <IconComponent
          className={`w-10 h-10 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
        />

        {/* Floating particles effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className={`absolute w-2 h-2 ${feature.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping`}
            style={{ top: "20%", right: "15%", animationDelay: "0.5s" }}
          />
          <div
            className={`absolute w-1.5 h-1.5 ${feature.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping`}
            style={{ bottom: "25%", left: "20%", animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-xl font-bold text-zamzam-text-dark mb-3 group-hover:text-zamzam-primary transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-zamzam-text-medium text-sm leading-relaxed group-hover:text-zamzam-text-dark transition-colors duration-300">
          {feature.description}
        </p>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-zamzam-primary/20 transition-colors duration-500" />
    </motion.div>
  );
};

export default AnimatedServiceCard;
