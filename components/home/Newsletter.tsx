"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Gift, Bell, Sparkles } from "lucide-react";
import Container from "../Container";
import { motion } from "motion/react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      console.log("Newsletter subscription:", email);
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const benefits = [
    {
      icon: Gift,
      text: "Exclusive Offers",
    },
    {
      icon: Bell,
      text: "New Arrivals",
    },
    {
      icon: Sparkles,
      text: "Special Deals",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-zamzam-primary via-zamzam-primary-hover to-zamzam-primary-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg"
          >
            <Mail className="w-10 h-10 animate-pulse" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold mb-4"
          >
            Stay Updated with Zam Zam Fashion Store
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-white/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Get the latest updates on new products, exclusive deals, and special
            offers. Join our community and never miss out on amazing savings!
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8 mb-8 flex-wrap"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <benefit.icon className="w-5 h-5 text-white/80" />
                <span className="text-white/90 font-medium">
                  {benefit.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            {!isSubscribed ? (
              <div className="flex gap-3 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder:text-white/70 focus:ring-0 text-base"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-zamzam-primary hover:bg-white/90 font-semibold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Subscribe
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-white" />
                  <span className="text-xl font-bold">Welcome aboard!</span>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/90">
                  Thank you for subscribing to our newsletter!
                </p>
              </motion.div>
            )}
          </motion.form>

          {/* Privacy Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-white/70 text-sm mt-6"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.div>
      </Container>
    </div>
  );
};

export default Newsletter;
