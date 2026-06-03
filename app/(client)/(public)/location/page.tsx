"use client";

import Container from "@/components/Container";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Store,
  Car,
  Users,
  Star,
  Calendar,
  ExternalLink,
  Accessibility,
  Wifi,
  CreditCard,
  ParkingMeter,
} from "lucide-react";
import { useState } from "react";

const locations = [
  {
    id: 1,
    name: "Zam Zam Fashion Store Palacode",
    address: "A.S. Complex, Meithi Nagar",
    city: "Palacode Dharmapuri",
    phone: "+91 9739625092",
    email: "zamzamfashionstore@gmail.com",
    hours: {
      weekdays: "9:00 AM - 9:00 PM",
      saturday: "9:00 AM - 10:00 PM",
      sunday: "10:00 AM - 8:00 PM",
    },
    features: [
      "Free Parking",
      "Wheelchair Access",
      "Free WiFi",
      "Personal Shopping",
    ],
    image: "🏢",
    manager: "Haji Salman",
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 2,
    name: "Zam Zam Fashion Store Dharmapuri",
    address: "DNC Multiplex, Four Road",
    city: "Dharmapuri T.N.",
    phone: "+91 9343779840",
    email: "zamzamfashionstore@gmail.com",
    hours: {
      weekdays: "10:00 AM - 10:00 PM",
      saturday: "10:00 AM - 11:00 PM",
      sunday: "11:00 AM - 9:00 PM",
    },
    features: [
      "Valet Parking",
      "Wheelchair Access",
      "Free WiFi",
      "Style Consultation",
    ],
    image: "🛍️",
    manager: "Sharukh Asif",
    rating: 4.9,
    reviews: 312,
  },
];

const services = [
  {
    icon: Store,
    title: "In-Store Shopping",
    description:
      "Browse our complete collection with expert assistance from our style consultants.",
  },
  {
    icon: Car,
    title: "Curbside Pickup",
    description:
      "Order online and pick up from your car. We'll bring your items directly to you.",
  },
  {
    icon: Users,
    title: "Personal Styling",
    description:
      "Book a one-on-one session with our professional stylists for personalized recommendations.",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description:
      "Return or exchange items at any of our locations with your receipt or order confirmation.",
  },
];

const amenities = [
  { icon: ParkingMeter, name: "Free Parking", available: true },
  { icon: Accessibility, name: "Wheelchair Access", available: true },
  { icon: Wifi, name: "Free WiFi", available: true },
  { icon: Users, name: "Personal Shopping", available: true },
  { icon: CreditCard, name: "All Payment Methods", available: true },
  { icon: Store, name: "Try Before You Buy", available: true },
];

const LocationPage = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
  };

  const getDirections = (address: string, city: string) => {
    const fullAddress = `${address}, ${city}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(
      `https://www.google.com/maps/search/${encodedAddress}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-zamzam-primary-light to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(250,50,77,0.1)_0%,transparent_50%)]" />

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
              <MapPin className="w-5 h-5 text-zamzam-primary" />
              <span className="text-zamzam-primary font-semibold">
                Visit Our Stores
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Find a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover">
                Zam Zam Fashion Store
              </span>{" "}
              Store Near You
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience shopping like never before at our premium locations.
              From personalized styling to convenient services, we&apos;re here
              to make your shopping journey exceptional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Find Nearest Store
              </button>
              <button className="border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Book Appointment
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Store Locations */}
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
              Our Store Locations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit any of our premium locations for an exceptional shopping
              experience with personalized service and exclusive in-store
              benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-zamzam-primary"
              >
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    {location.image}
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {location.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(location.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {location.rating} ({location.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-zamzam-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            {location.address}
                          </p>
                          <p className="text-gray-600">{location.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-zamzam-primary flex-shrink-0" />
                        <p className="text-gray-900">{location.phone}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-zamzam-primary flex-shrink-0" />
                        <p className="text-gray-900">{location.email}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-zamzam-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            Store Hours
                          </p>
                          <p className="text-sm text-gray-600">
                            Mon-Fri: {location.hours.weekdays}
                          </p>
                          <p className="text-sm text-gray-600">
                            Saturday: {location.hours.saturday}
                          </p>
                          <p className="text-sm text-gray-600">
                            Sunday: {location.hours.sunday}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Store Manager: {location.manager}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {location.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-zamzam-primary-light text-zamzam-primary px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          getDirections(location.address, location.city)
                        }
                        className="flex-1 bg-zamzam-primary hover:bg-zamzam-primary-hover text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Get Directions
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
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
              In-Store Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of your visit with our premium services designed to
              enhance your shopping experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group text-center border border-gray-100"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-zamzam-primary-light rounded-2xl mb-4 group-hover:bg-zamzam-primary group-hover:text-white transition-colors duration-300"
                >
                  <service.icon className="w-8 h-8 text-zamzam-primary group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Amenities */}
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
              Store Amenities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enjoy a comfortable and convenient shopping experience with all
              the amenities you need.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
                    amenity.available
                      ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <amenity.icon className="w-8 h-8" />
                </motion.div>
                <p
                  className={`text-sm font-medium ${amenity.available ? "text-gray-900" : "text-gray-500"}`}
                >
                  {amenity.name}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form */}
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
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Have questions about our stores or services? We&apos;d love to
                hear from you!
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Preferred Location
                    </label>
                    <select
                      name="location"
                      value={contactForm.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zamzam-primary focus:border-transparent transition-all duration-300"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Call-to-Action */}
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
              Ready to Visit Us?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Book an appointment for personalized styling, schedule a fitting,
              or simply visit us for the ultimate shopping experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-zamzam-primary text-zamzam-primary hover:bg-zamzam-primary hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <ExternalLink className="w-5 h-5" />
                View on Map
              </motion.button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default LocationPage;
