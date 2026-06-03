"use client";

import Container from "@/components/Container";
import { motion } from "motion/react";
import { Users, Target, Heart, Award, ShoppingBag, Globe } from "lucide-react";

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Products", value: "10K+", icon: ShoppingBag },
  { label: "Country", value: "India", icon: Globe },
  { label: "Awards Won", value: "15+", icon: Award },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide high-quality fashion and lifestyle products that inspire confidence and express individual style.",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description:
      "To be the world's most loved and trusted fashion destination, making style accessible to everyone.",
  },
  {
    icon: Award,
    title: "Our Values",
    description:
      "Quality, integrity, innovation, and customer satisfaction are at the heart of everything we do.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
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
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              About <span className="text-zamzam-primary">ZamZam</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We&apos;re passionate about bringing you the finest fashion and
              lifestyle products. Since our founding, we&apos;ve been dedicated
              to quality, style, and exceptional customer service.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-zamzam-primary-light rounded-full mb-4 group-hover:bg-zamzam-primary group-hover:text-white transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-zamzam-primary group-hover:text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our core principles guide everything we do, from product selection
              to customer service.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-zamzam-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zamzam-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-8 h-8 text-zamzam-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Discover our latest collections and find your perfect style with
              ZamZam.
            </p>
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-zamzam-primary font-bold rounded-xl hover:bg-gray-50 transition-colors duration-300"
            >
              Shop Now
              <ShoppingBag className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
