"use client";

import Logo from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Home,
  Search,
  ShoppingBag,
  Heart,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Sparkles,
  Star,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home", icon: Home, description: "Back to homepage" },
  {
    href: "/products",
    label: "Products",
    icon: ShoppingBag,
    description: "Browse all products",
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
    description: "Your saved items",
  },
  {
    href: "/account",
    label: "Account",
    icon: User,
    description: "Manage your profile",
  },
];

const popularCategories = [
  { href: "/category/men", label: "Men's Fashion" },
  { href: "/category/woman", label: "Women's Fashion" },
  { href: "/category/kids", label: "Kids Collection" },
  { href: "/best-seller", label: "Best Sellers" },
  { href: "/new-arrivals", label: "New Arrivals" },
];

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-zamzam-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zamzam-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Logo />
          </motion.div>

          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-gray-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-zamzam-primary animate-pulse" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off. Don't
              worry, let's get you back to shopping for amazing products!
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-zamzam-primary text-white font-semibold rounded-xl hover:bg-zamzam-primary-hover transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-zamzam-primary/20 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-zamzam-primary-light rounded-xl flex items-center justify-center mb-3 group-hover:bg-zamzam-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      <link.icon className="w-6 h-6 text-zamzam-primary group-hover:text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {link.label}
                    </h4>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-zamzam-primary hover:bg-zamzam-primary-light transition-all duration-300 group"
                >
                  <Star className="w-4 h-4 text-gray-400 group-hover:text-zamzam-primary" />
                  <span className="font-medium text-gray-700 group-hover:text-zamzam-primary">
                    {category.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to assist you with any questions or
              concerns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <Search className="w-5 h-5" />
                Browse FAQ
              </Link>
              <a
                href="tel:+12958648597"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <Phone className="w-5 h-5" />
                Call Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
