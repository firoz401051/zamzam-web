"use client";

import { motion } from "motion/react";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

const serviceFeatures = [
  {
    title: "Free Delivery",
    description: "Free shipping over $100",
    icon: Truck,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Free Return",
    description: "30 days return policy",
    icon: GitCompareArrows,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    title: "24/7 Support",
    description: "Friendly customer support",
    icon: Headset,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    title: "Money Back",
    description: "100% money back guarantee",
    icon: ShieldCheck,
    color: "from-zamzam-primary to-zamzam-primary-hover",
    bgColor: "bg-zamzam-primary-light",
    textColor: "text-zamzam-primary",
  },
];

const AnimatedServiceFeatures = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {serviceFeatures.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group cursor-pointer"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-zamzam-surface transition-colors duration-300">
            <div
              className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className={`w-6 h-6 ${feature.textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors duration-300 mb-1">
                {feature.title}
              </h4>
              <p className="text-sm text-zamzam-text-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedServiceFeatures;
