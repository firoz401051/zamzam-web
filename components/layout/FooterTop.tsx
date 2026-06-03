"use client";

import { Clock, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href?: string;
  isExternal?: boolean;
}

const data: ContactItemData[] = [
  {
    title: "Visit Our Store",
    subtitle: "New Orleans, USA",
    icon: (
      <MapPin className="h-7 w-7 text-zamzam-primary group-hover:text-zamzam-primary-hover transition-all duration-300" />
    ),
    href: "https://maps.google.com",
    isExternal: true,
  },
  {
    title: "Call Us Now",
    subtitle: "+1 (295) 864-8597",
    icon: (
      <Phone className="h-7 w-7 text-zamzam-primary group-hover:text-zamzam-primary-hover transition-all duration-300" />
    ),
    href: "tel:+12958648597",
  },
  {
    title: "Business Hours",
    subtitle: "Mon - Sat: 10:00 - 19:00",
    icon: (
      <Clock className="h-7 w-7 text-zamzam-primary group-hover:text-zamzam-primary-hover transition-all duration-300" />
    ),
  },
  {
    title: "Email Support",
    subtitle: "support@zamzam.com",
    icon: (
      <Mail className="h-7 w-7 text-zamzam-primary group-hover:text-zamzam-primary-hover transition-all duration-300" />
    ),
    href: "mailto:support@zamzam.com",
  },
];

const FooterTop = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,50,77,0.05)_0%,transparent_50%)]" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12 px-6">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <ContactItem
              icon={item.icon}
              title={item.title}
              content={item.subtitle}
              href={item.href}
              isExternal={item.isExternal}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom Border with Gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </motion.div>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
  isExternal?: boolean;
}

const ContactItem = ({
  icon,
  title,
  content,
  href,
  isExternal,
}: ContactItemProps) => {
  const ItemContent = () => (
    <div className="flex items-start gap-4 group cursor-pointer">
      {/* Icon Container with Enhanced Styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-zamzam-primary/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
        <div className="relative p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-zamzam-primary/20 transition-all duration-300">
          {icon}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-zamzam-primary transition-colors duration-300 text-lg">
            {title}
          </h3>
          {href && isExternal && (
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-zamzam-primary transition-colors duration-300" />
          )}
        </div>
        <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
          {content}
        </p>

        {/* Hover Indicator */}
        <div className="mt-2 h-0.5 w-0 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover group-hover:w-full transition-all duration-300 rounded-full" />
      </div>
    </div>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:border-zamzam-primary/20 transition-all duration-300 group"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <ItemContent />
      </motion.a>
    );
  }

  return (
    <motion.div
      className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:border-zamzam-primary/20 transition-all duration-300 group"
      whileHover={{ y: -2 }}
    >
      <ItemContent />
    </motion.div>
  );
};

export default FooterTop;
