import React from "react";
import { Star, Zap } from "lucide-react";
import Container from "../Container";
import AnimatedServiceCard from "../animated/AnimatedServiceCard";

const ServiceFeatures = () => {
  const features = [
    {
      iconName: "truck" as const,
      title: "Free Delivery",
      description:
        "Free shipping on orders over $100. Fast and reliable delivery service.",
      gradient: "from-zamzam-primary to-zamzam-primary-hover",
      bgColor: "bg-zamzam-primary-light",
      iconColor: "text-zamzam-primary",
    },
    {
      iconName: "rotateCcw" as const,
      title: "30 Day Return",
      description:
        "Easy returns within 30 days. No questions asked return policy.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      iconName: "headphones" as const,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support. We're here to help anytime.",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      iconName: "shield" as const,
      title: "Secure Payment",
      description:
        "100% secure transactions. Your payment information is protected.",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-zamzam-background to-zamzam-surface border-t border-zamzam-primary/10">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zamzam-primary-light rounded-full mb-4">
            <Star className="w-4 h-4 text-zamzam-primary" />
            <span className="text-sm font-medium text-zamzam-primary">
              Why Choose Us
            </span>
            <Zap className="w-4 h-4 text-zamzam-primary" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-zamzam-text-dark mb-3">
            Premium Service Features
          </h2>
          <p className="text-zamzam-text-medium max-w-2xl mx-auto">
            Experience the zamzam difference with our exceptional service
            standards and customer-first approach.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedServiceCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ServiceFeatures;
