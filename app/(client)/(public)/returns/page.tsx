"use client";

import Container from "@/components/Container";
import { motion } from "motion/react";
import {
  Package,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  Calendar,
  PhoneCall,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const returnSteps = [
  {
    step: "01",
    title: "Initiate Return",
    description:
      "Contact us within 30 days via phone, email, or our online form to start your return process.",
    icon: PhoneCall,
    timeframe: "Within 30 days",
  },
  {
    step: "02",
    title: "Get Authorization",
    description:
      "Receive your Return Authorization (RA) number and prepaid shipping label via email.",
    icon: CheckCircle,
    timeframe: "Within 24 hours",
  },
  {
    step: "03",
    title: "Package & Ship",
    description:
      "Securely package your item with all original tags and ship using our prepaid label.",
    icon: Package,
    timeframe: "Within 7 days",
  },
  {
    step: "04",
    title: "Processing",
    description:
      "We inspect your return and process your refund or exchange within 3-5 business days.",
    icon: Truck,
    timeframe: "3-5 business days",
  },
];

const returnPolicy = [
  {
    icon: Calendar,
    title: "30-Day Return Window",
    description:
      "Items can be returned within 30 days of purchase for a full refund or exchange.",
    details: [
      "Must be in original condition",
      "All tags attached",
      "Original packaging included",
    ],
  },
  {
    icon: Shield,
    title: "Free Return Shipping",
    description:
      "We provide free return shipping labels for all eligible returns within the US.",
    details: [
      "Prepaid shipping labels",
      "No deduction from refund",
      "Fast processing",
    ],
  },
  {
    icon: CreditCard,
    title: "Full Refunds",
    description:
      "Get your money back to the original payment method within 3-5 business days.",
    details: [
      "Original payment method",
      "Processing fees refunded",
      "No restocking fees",
    ],
  },
  {
    icon: RotateCcw,
    title: "Easy Exchanges",
    description:
      "Exchange for a different size or color with expedited processing.",
    details: ["Size exchanges", "Color variations", "Style upgrades available"],
  },
];

const eligibilityItems = [
  {
    item: "Clothing & Accessories",
    status: "eligible",
    note: "With original tags",
  },
  { item: "Shoes", status: "eligible", note: "Unworn condition" },
  {
    item: "Electronics",
    status: "eligible",
    note: "Original packaging required",
  },
  {
    item: "Beauty Products",
    status: "restricted",
    note: "Unopened items only",
  },
  {
    item: "Underwear & Swimwear",
    status: "restricted",
    note: "Hygiene sealed items",
  },
  {
    item: "Custom/Personalized Items",
    status: "not-eligible",
    note: "Final sale only",
  },
  {
    item: "Sale Items (>50% off)",
    status: "restricted",
    note: "Store credit only",
  },
  { item: "Gift Cards", status: "not-eligible", note: "Non-returnable" },
];

const faqs = [
  {
    question: "How long do I have to return an item?",
    answer:
      "You have 30 days from the date of purchase to return most items. Sale items may have different return periods.",
  },
  {
    question: "Do I need to pay for return shipping?",
    answer:
      "No, we provide free return shipping labels for all eligible returns within the United States.",
  },
  {
    question: "How long does it take to process my refund?",
    answer:
      "Once we receive your return, we process refunds within 3-5 business days. It may take an additional 3-7 business days to appear on your statement.",
  },
  {
    question: "Can I exchange an item instead of returning it?",
    answer:
      "Yes! We offer exchanges for different sizes, colors, or styles. Exchanges are processed faster than returns.",
  },
  {
    question: "What if I received a damaged or incorrect item?",
    answer:
      "Contact us immediately at returns@zamzam.com. We'll arrange for immediate replacement and cover all shipping costs.",
  },
];

const ReturnsPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [returnForm, setReturnForm] = useState({
    orderNumber: "",
    email: "",
    reason: "",
    comments: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setReturnForm({
      ...returnForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Return request submitted:", returnForm);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-zamzam-primary-light to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(250,50,77,0.1)_0%,transparent_50%)]" />

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
              <RotateCcw className="w-5 h-5 text-zamzam-primary" />
              <span className="text-zamzam-primary font-semibold">
                Hassle-Free Returns
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Returns &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover">
                Exchange Policy
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We want you to love your purchase! If you&apos;re not completely
              satisfied, our simple return process makes it easy to get a refund
              or exchange.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                Start Return Process
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Contact Support
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Return Policy Highlights */}
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
              Our Return Policy Highlights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;ve made returning items as simple and convenient as
              possible with these customer-friendly policies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {returnPolicy.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-zamzam-primary-light rounded-2xl mb-6 group-hover:bg-zamzam-primary group-hover:text-white transition-colors duration-300"
                >
                  <policy.icon className="w-8 h-8 text-zamzam-primary group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {policy.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {policy.description}
                </p>
                <ul className="space-y-2">
                  {policy.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Return Process */}
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
              How to Return Your Items
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to return your purchase. The entire
              process typically takes 7-10 business days.
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-32 left-0 right-0">
              <div className="flex justify-between items-center px-20">
                <div className="flex-1 h-0.5 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover mx-8" />
                <div className="flex-1 h-0.5 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover mx-8" />
                <div className="flex-1 h-0.5 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover mx-8" />
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {returnSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6 border-4 border-zamzam-primary-light group-hover:border-zamzam-primary transition-all duration-300"
                  >
                    <step.icon className="w-10 h-10 text-zamzam-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-zamzam-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {step.step}
                      </span>
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {step.description}
                  </p>
                  <span className="inline-block bg-zamzam-primary-light text-zamzam-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {step.timeframe}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Eligibility Table */}
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
              Return Eligibility Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check the return eligibility for different product categories to
              understand our policy better.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <div className="space-y-4">
              {eligibilityItems.map((item, index) => (
                <motion.div
                  key={item.item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zamzam-primary-light rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-zamzam-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.item}
                      </h4>
                      <p className="text-sm text-gray-600">{item.note}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "eligible" && (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 font-semibold">
                          Eligible
                        </span>
                      </>
                    )}
                    {item.status === "restricted" && (
                      <>
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-600 font-semibold">
                          Restricted
                        </span>
                      </>
                    )}
                    {item.status === "not-eligible" && (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-red-600 font-semibold">
                          Not Eligible
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Return Request Form */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Start Your Return Request
              </h2>
              <p className="text-xl text-gray-600">
                Fill out this form to begin the return process. You&apos;ll
                receive a return authorization number within 24 hours.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Order Number *
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={returnForm.orderNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                      placeholder="SW123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={returnForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Return Reason *
                  </label>
                  <select
                    name="reason"
                    value={returnForm.reason}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a reason</option>
                    <option value="size">Wrong Size</option>
                    <option value="color">Different Color</option>
                    <option value="defective">Defective Item</option>
                    <option value="not-as-described">Not as Described</option>
                    <option value="changed-mind">Changed My Mind</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    name="comments"
                    value={returnForm.comments}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                    placeholder="Please provide any additional details about your return..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Submit Return Request
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our return and exchange
              process.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left hover:bg-gray-100 transition-colors duration-300 flex items-center justify-between"
                >
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-zamzam-primary-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Need More Help?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our customer support team is here to help with any questions about
              returns, exchanges, or refunds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              >
                <PhoneCall className="w-5 h-5" />
                Call Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </motion.button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default ReturnsPage;
