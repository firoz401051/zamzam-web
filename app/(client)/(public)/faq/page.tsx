"use client";

import Container from "@/components/Container";
import { motion } from "motion/react";
import {
  ChevronDown,
  Search,
  CreditCard,
  Truck,
  RotateCcw,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";

const faqCategories = [
  { id: "general", label: "General", icon: MessageCircle },
  { id: "orders", label: "Orders & Shipping", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
];

const faqs = [
  {
    category: "general",
    question: "What is Zam Zam Fashion Store?",
    answer:
      "Zam Zam Fashion Store is your ultimate destination for fashion and lifestyle products. We offer a curated selection of high-quality items from trusted brands, with a focus on style, quality, and customer satisfaction.",
  },
  {
    category: "general",
    question: "How do I create an account?",
    answer:
      "You can create an account by clicking the 'Sign Up' button in the top right corner of our website. Fill in your details, verify your email, and you're ready to start shopping!",
  },
  {
    category: "general",
    question: "Do you offer customer support?",
    answer:
      "Yes! Our customer support team is available Monday through Saturday, 10 AM to 7 PM. You can reach us via email at zamzamfashionstore@gmail.com or call us at +91 9739625092.",
  },
  {
    category: "orders",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-7 business days within the US. Express shipping (1-3 business days) and international shipping options are also available. You'll receive tracking information once your order ships.",
  },
  {
    category: "orders",
    question: "Can I track my order?",
    answer:
      "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your orders by logging into your account and visiting the 'Order History' section.",
  },
  {
    category: "orders",
    question: "Do you ship internationally?",
    answer:
      "No, Right now we are focussing in India only. International shipping costs and delivery times vary by location. Check our shipping page for specific details about your country.",
  },
  {
    category: "payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and digital wallets like Apple Pay and Google Pay. All transactions are secure and encrypted.",
  },
  {
    category: "payments",
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete card details on our servers, and all transactions are processed through secure payment gateways.",
  },
  {
    category: "payments",
    question: "Can I save my payment information?",
    answer:
      "Yes, you can securely save your payment methods to your account for faster checkout. You can manage your saved payment methods in your account settings.",
  },
  {
    category: "returns",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Items must be unworn, in original condition with tags attached. Some items like intimate apparel and final sale items are not eligible for return.",
  },
  {
    category: "returns",
    question: "How do I return an item?",
    answer:
      "To return an item, log into your account, go to 'Order History', select the item you want to return, and follow the return instructions. We'll provide a prepaid return label for your convenience.",
  },
  {
    category: "returns",
    question: "How long do refunds take?",
    answer:
      "Once we receive your returned item, refunds are processed within 3-5 business days. The refund will be credited back to your original payment method.",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.category === activeCategory &&
      (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-zamzam-primary-light to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(250,50,77,0.1)_0%,transparent_50%)]" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked{" "}
              <span className="text-zamzam-primary">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Find answers to common questions about shopping, orders, payments,
              and more.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative max-w-md mx-auto"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent outline-none transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-6">Categories</h3>
                <div className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-zamzam-primary text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50 hover:text-zamzam-primary"
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FAQ Items */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600">
                      Try searching with different keywords or browse other
                      categories.
                    </p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                      >
                        <h3 className="font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                            openItems.includes(index) ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: openItems.includes(index) ? "auto" : 0,
                          opacity: openItems.includes(index) ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Can&apos;t find what you&apos;re looking for? Our customer support
              team is here to help!
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.a
                href="mailto:zamzamfashionstore@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-zamzam-primary-light transition-colors duration-300 group"
              >
                <Mail className="w-8 h-8 text-zamzam-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600 text-sm">zamzamfashionstore@gmail.com</p>
              </motion.a>

              <motion.a
                href="tel:+919739625092"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-zamzam-primary-light transition-colors duration-300 group"
              >
                <Phone className="w-8 h-8 text-zamzam-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600 text-sm">+91 9739625092</p>
              </motion.a>

              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-zamzam-primary-light transition-colors duration-300 group"
              >
                <MessageCircle className="w-8 h-8 text-zamzam-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  Contact Form
                </h3>
                <p className="text-gray-600 text-sm">Send us a message</p>
              </motion.a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
