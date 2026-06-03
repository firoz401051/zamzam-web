"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/Container";
import { faqsData } from "@/constants";
import { motion } from "motion/react";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useState } from "react";

const categories = [
  {
    id: "all",
    name: "All Questions",
    icon: HelpCircle,
    count: faqsData.length,
  },
  {
    id: "orders",
    name: "Orders & Shipping",
    icon: ShoppingBag,
    count: faqsData.filter((faq) => faq.category === "orders").length,
  },
  {
    id: "payment",
    name: "Payment & Billing",
    icon: CreditCard,
    count: faqsData.filter((faq) => faq.category === "payment").length,
  },
  {
    id: "returns",
    name: "Returns & Exchanges",
    icon: RotateCcw,
    count: faqsData.filter((faq) => faq.category === "returns").length,
  },
  {
    id: "account",
    name: "Account & Security",
    icon: Shield,
    count: faqsData.filter((faq) => faq.category === "account").length,
  },
];

const quickActions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    action: "Start Chat",
    available: "24/7",
  },
  {
    icon: Phone,
    title: "Call Support",
    description: "Speak directly with our experts",
    action: "Call Now",
    available: "Mon-Fri 9AM-6PM",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    action: "Send Email",
    available: "Response within 2 hours",
  },
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = faqsData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-zamzam-primary-light to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,50,77,0.1)_0%,transparent_50%)]" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-zamzam-primary/20"
            >
              <HelpCircle className="w-5 h-5 text-zamzam-primary" />
              <span className="text-zamzam-primary font-semibold">
                Help Center
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover">
                Questions
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Find quick answers to common questions about shopping, orders,
              returns, and more. We&apos;re here to help make your experience
              smooth and enjoyable.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300 shadow-lg"
              />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is
              ready to help you with personalized assistance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group text-center border border-gray-100"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-zamzam-primary-light rounded-2xl mb-4 group-hover:bg-zamzam-primary group-hover:text-white transition-colors duration-300"
                >
                  <action.icon className="w-8 h-8 text-zamzam-primary group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  {action.available}
                </div>
                <button className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                  {action.action}
                </button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-zamzam-primary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  {category.name}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedCategory === category.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
            >
              {filteredFAQs.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                  defaultValue="item-0"
                >
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <AccordionItem
                        value={`item-${index}`}
                        className="group border border-gray-200 rounded-2xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                      >
                        <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-zamzam-primary hover:no-underline py-6 [&[data-state=open]>svg]:rotate-180">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-2 h-2 bg-zamzam-primary rounded-full mt-3"></div>
                            <span className="flex-1">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed pb-6 pl-6">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No questions found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or browse different categories.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our friendly support team is here to help! Reach out through any
                of our support channels for personalized assistance.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </motion.button>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FAQPage;
