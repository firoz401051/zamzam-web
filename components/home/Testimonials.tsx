"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Heart, Users } from "lucide-react";
import Title from "../Title";
import Container from "../Container";
import { motion } from "motion/react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "D Satheesan",
      role: "Fashion Blogger",
      avatar: "👩‍🎨",
      rating: 5,
      comment:
        "Zam zam fashion store has completely transformed my shopping experience! The quality is exceptional and the customer service is outstanding. I've found amazing pieces that I absolutely love.",
      verified: true,
    },
    {
      id: 2,
      name: "V. N. Reddy",
      role: "Tech Entrepreneur",
      avatar: "👨‍💻",
      rating: 5,
      comment:
        "Fast delivery, great prices, and excellent product quality. The website is user-friendly and the checkout process is seamless. Highly recommended for online shopping!",
      verified: true,
    },
    {
      id: 3,
      name: "Md Ashfak",
      role: "Marketing Manager",
      avatar: "👩‍💼",
      rating: 5,
      comment:
        "I've been shopping with Zam Zam Fashion Store for over a year now and they never disappoint. The product variety is amazing and the return policy gives me confidence in every purchase.",
      verified: true,
    },
    {
      id: 4,
      name: "Riza Afrin",
      role: "Creative Director",
      avatar: "👨‍🎨",
      rating: 5,
      comment:
        "Outstanding service and premium quality products. The attention to detail in packaging and the personalized shopping recommendations make every order special.",
      verified: true,
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-zamzam-surface to-zamzam-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-zamzam-primary rounded-full animate-pulse" />
        <div
          className="absolute bottom-20 right-16 w-16 h-16 bg-zamzam-primary-hover rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-zamzam-primary rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Container className="relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zamzam-primary-light rounded-full mb-4">
            <Heart className="w-4 h-4 text-zamzam-primary" />
            <span className="text-sm font-medium text-zamzam-primary">
              Customer Love
            </span>
            <Users className="w-4 h-4 text-zamzam-primary" />
          </div>
          <Title className="text-2xl lg:text-3xl font-bold text-zamzam-text-dark mb-3">
            What Our Customers Say
          </Title>
          <p className="text-zamzam-text-medium max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Zam Zam Fashion Store for their
            shopping needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="bg-zamzam-white shadow-sm hover:shadow-xl border border-zamzam-surface hover:border-zamzam-primary/20 transition-all duration-500 h-full relative overflow-hidden">
                {/* Quote Background */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-12 h-12 text-zamzam-primary" />
                </div>

                <CardContent className="p-6 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-zamzam-primary text-zamzam-primary"
                        />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-700 font-medium">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  <div className="flex-1 mb-6">
                    <p className="text-zamzam-text-medium text-sm leading-relaxed group-hover:text-zamzam-text-dark transition-colors duration-300">
                      "{testimonial.comment}"
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zamzam-surface">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zamzam-primary-light to-zamzam-surface flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-zamzam-text-muted">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-zamzam-primary/10 transition-colors duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-zamzam-white rounded-2xl p-8 border border-zamzam-surface shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-zamzam-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <p className="text-zamzam-text-medium font-medium">
                Happy Customers
              </p>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-zamzam-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <p className="text-zamzam-text-medium font-medium">
                Satisfaction Rate
              </p>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-zamzam-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                4.9★
              </div>
              <p className="text-zamzam-text-medium font-medium">
                Average Rating
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Testimonials;
