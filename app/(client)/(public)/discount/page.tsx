"use client";

import Container from "@/components/Container";
import { motion } from "motion/react";
import {
  Tag,
  Percent,
  Star,
  Gift,
  Clock,
  Users,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Calendar,
  Bell,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

const featuredDeals = [
  {
    title: "Flash Sale Weekend",
    subtitle: "Up to 70% Off",
    description:
      "Limited time offers on selected fashion items. Don't miss out!",
    code: "FLASH70",
    discount: "70%",
    timeLeft: "2 days left",
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-50",
    icon: Zap,
  },
  {
    title: "New Customer Special",
    subtitle: "Welcome Bonus",
    description:
      "Exclusive discount for first-time shoppers. Start your journey!",
    code: "WELCOME25",
    discount: "25%",
    timeLeft: "Always available",
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-50",
    icon: Star,
  },
  {
    title: "VIP Member Exclusive",
    subtitle: "Premium Rewards",
    description:
      "Special pricing for our valued VIP members and loyal customers.",
    code: "VIP30",
    discount: "30%",
    timeLeft: "Member exclusive",
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-yellow-50",
    icon: Crown,
  },
];

const categories = [
  {
    name: "Fashion & Clothing",
    discount: "Up to 60%",
    items: "2,500+ items",
    image: "👕",
    deals: ["Summer Collection", "Winter Clearance", "Designer Brands"],
  },
  {
    name: "Electronics",
    discount: "Up to 45%",
    items: "850+ items",
    image: "📱",
    deals: ["Smart Devices", "Gaming Gear", "Audio Equipment"],
  },
  {
    name: "Home & Living",
    discount: "Up to 55%",
    items: "1,200+ items",
    image: "🏠",
    deals: ["Furniture", "Decor Items", "Kitchen Essentials"],
  },
  {
    name: "Beauty & Health",
    discount: "Up to 40%",
    items: "950+ items",
    image: "💄",
    deals: ["Skincare", "Makeup", "Wellness Products"],
  },
  {
    name: "Sports & Outdoor",
    discount: "Up to 50%",
    items: "680+ items",
    image: "⚽",
    deals: ["Activewear", "Equipment", "Outdoor Gear"],
  },
  {
    name: "Accessories",
    discount: "Up to 35%",
    items: "1,100+ items",
    image: "👜",
    deals: ["Bags & Purses", "Jewelry", "Watches"],
  },
];

const promotionalCodes = [
  {
    code: "SAVE20",
    description: "20% off on orders over $100",
    minOrder: "$100",
    validity: "Valid until Dec 31, 2024",
    category: "General",
  },
  {
    code: "FREESHIP",
    description: "Free shipping on all orders",
    minOrder: "No minimum",
    validity: "Valid until Dec 25, 2024",
    category: "Shipping",
  },
  {
    code: "BUNDLE50",
    description: "Buy 2 get 50% off on 3rd item",
    minOrder: "3+ items",
    validity: "Limited time offer",
    category: "Bundle",
  },
  {
    code: "STUDENT15",
    description: "15% off for students with valid ID",
    minOrder: "No minimum",
    validity: "Always available",
    category: "Student",
  },
  {
    code: "LOYALTY25",
    description: "25% off for returning customers",
    minOrder: "$75",
    validity: "Member exclusive",
    category: "Loyalty",
  },
  {
    code: "CLEARANCE",
    description: "Extra 30% off on sale items",
    minOrder: "Sale items only",
    validity: "While stocks last",
    category: "Clearance",
  },
];

const seasonalOffers = [
  {
    season: "Winter Sale",
    title: "Cozy Up & Save Big",
    description:
      "Warm up your wardrobe with incredible winter deals on jackets, sweaters, and boots.",
    discount: "Up to 65% OFF",
    ends: "January 31, 2024",
    image: "❄️",
  },
  {
    season: "Spring Collection",
    title: "Fresh Styles Ahead",
    description:
      "Welcome spring with new arrivals and seasonal favorites at special prices.",
    discount: "Up to 40% OFF",
    ends: "March 31, 2024",
    image: "🌸",
  },
  {
    season: "Summer Vibes",
    title: "Beat the Heat",
    description:
      "Stay cool and stylish with our summer collection of lightweight clothing and accessories.",
    discount: "Up to 55% OFF",
    ends: "August 31, 2024",
    image: "☀️",
  },
];

const stats = [
  { label: "Active Deals", value: "150+", icon: Tag },
  { label: "Average Savings", value: "35%", icon: Percent },
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Daily New Offers", value: "25+", icon: TrendingUp },
];

const DiscountPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [emailSubscription, setEmailSubscription] = useState("");

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", emailSubscription);
    setEmailSubscription("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-zamzam-primary-light via-white to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,50,77,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-bounce" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-zamzam-primary-light rounded-full opacity-30 animate-pulse" />
        <div
          className="absolute bottom-20 left-32 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "1s" }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-zamzam-primary/20 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-zamzam-primary animate-pulse" />
              <span className="text-zamzam-primary font-semibold">
                Amazing Deals & Discounts
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Save Big with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zamzam-primary via-yellow-500 to-orange-500">
                zamzam
              </span>{" "}
              Discounts
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover exclusive deals, promotional codes, and seasonal offers.
              Shop smarter and save more with our curated collection of
              discounts across all categories.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button className="bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Browse All Deals
              </button>
              <button className="border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Get Notifications
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-zamzam-primary-light to-yellow-100 rounded-2xl mb-4 group-hover:from-zamzam-primary group-hover:to-zamzam-primary-hover transition-all duration-300 shadow-md"
                >
                  <stat.icon className="w-8 h-8 text-zamzam-primary group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Featured Deals */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Featured Deals of the Day
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t miss these exclusive offers! Limited-time deals with
              incredible savings across popular categories.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <motion.div
                key={deal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div
                  className={`${deal.bgColor} p-8 rounded-3xl border-2 border-transparent group-hover:border-zamzam-primary transition-all duration-300 relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${deal.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${deal.color} rounded-2xl mb-6 shadow-lg`}
                    >
                      <deal.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {deal.title}
                        </h3>
                        <p className="text-lg font-semibold text-zamzam-primary">
                          {deal.subtitle}
                        </p>
                      </div>
                      <span className="text-3xl font-bold text-zamzam-primary">
                        {deal.discount}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {deal.description}
                    </p>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Promo Code
                          </p>
                          <p className="font-mono text-lg font-bold text-gray-900">
                            {deal.code}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(deal.code)}
                          className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          {copiedCode === deal.code ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {deal.timeLeft}
                      </span>
                      <button className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Discounts by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore amazing deals across all product categories. Find exactly
              what you&apos;re looking for at unbeatable prices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-zamzam-primary"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{category.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{category.items}</span>
                    <span className="font-semibold text-zamzam-primary">
                      {category.discount}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {category.deals.map((deal, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Tag className="w-3 h-3 text-zamzam-primary" />
                      {deal}
                    </div>
                  ))}
                </div>

                <button className="w-full bg-white hover:bg-zamzam-primary text-gray-900 hover:text-white border border-gray-200 hover:border-zamzam-primary py-3 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-md">
                  View Deals
                </button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Promotional Codes */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Active Promo Codes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Copy these exclusive promo codes and apply them at checkout to
              unlock instant savings on your orders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalCodes.map((promo, index) => (
              <motion.div
                key={promo.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-zamzam-primary transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      promo.category === "General"
                        ? "bg-blue-100 text-blue-700"
                        : promo.category === "Shipping"
                          ? "bg-green-100 text-green-700"
                          : promo.category === "Bundle"
                            ? "bg-purple-100 text-purple-700"
                            : promo.category === "Student"
                              ? "bg-yellow-100 text-yellow-700"
                              : promo.category === "Loyalty"
                                ? "bg-zamzam-primary-light text-zamzam-primary"
                                : "bg-red-100 text-red-700"
                    }`}
                  >
                    {promo.category}
                  </span>
                  <Gift className="w-5 h-5 text-gray-400 group-hover:text-zamzam-primary transition-colors duration-300" />
                </div>

                <div className="mb-4">
                  <h3 className="font-mono text-xl font-bold text-gray-900 mb-2">
                    {promo.code}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Min. Order:</span>
                    <span>{promo.minOrder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span>{promo.validity}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(promo.code)}
                  className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Seasonal Offers */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Seasonal Offers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrate every season with special discounts tailored to the time
              of year. Fresh deals for fresh seasons!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {seasonalOffers.map((offer, index) => (
              <motion.div
                key={offer.season}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 group-hover:border-zamzam-primary transition-all duration-300 hover:shadow-xl">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{offer.image}</div>
                    <span className="inline-block bg-zamzam-primary-light text-zamzam-primary px-4 py-2 rounded-full text-sm font-semibold mb-3">
                      {offer.season}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {offer.description}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6">
                      <p className="text-3xl font-bold text-zamzam-primary mb-1">
                        {offer.discount}
                      </p>
                      <p className="text-sm text-gray-600">On seasonal items</p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Ends: {offer.ends}
                      </span>
                    </div>

                    <button className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2">
                      Explore Collection
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-br from-zamzam-primary-light to-yellow-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-zamzam-primary rounded-3xl mb-8 shadow-lg"
            >
              <Bell className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Never Miss a Deal!
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Subscribe to our newsletter and be the first to know about
              exclusive discounts, flash sales, and special offers. Get up to{" "}
              <span className="font-bold text-zamzam-primary">
                40% extra savings
              </span>{" "}
              as a subscriber!
            </p>

            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            >
              <input
                type="email"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300 text-lg"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Subscribe Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.form>

            <p className="text-sm text-gray-600 mt-4">
              🎁 Get a{" "}
              <span className="font-semibold text-zamzam-primary">
                welcome bonus of 15%
              </span>{" "}
              on your first purchase after subscribing!
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default DiscountPage;
