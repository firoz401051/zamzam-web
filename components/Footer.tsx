"use client";

import Link from "next/link";
import FooterTop from "./layout/FooterTop";
import SocialMedia from "./layout/SocialMedia";
import Container from "./Container";
import { Category } from "@/sanity.types";
import { MapPin, Mail, Phone, ChevronRight } from "lucide-react";
import {
  FaCcVisa,
  FaCcDiscover,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
} from "react-icons/fa";

const Footer = ({ categories }: { categories: Category[] }) => {
  return (
    <footer className="bg-zamzam-footerbg text-zamzam-white pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14 mb-16">
          {/* Contact Info (Logo Part) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-wide uppercase text-zamzam-white">
              Zam Zam Fashion <br />
                 Store
            </h2>
            <p className="text-zamzam-text-light text-sm leading-relaxed mb-6">
              Discover stylish sarees,<br />
              quality fashion,<br /> 
              affordable prices,<br /> 
              and trusted service.
            </p>
            
            <div className="pt-2">
              <SocialMedia
                className="text-zamzam-white gap-4"
                iconClassName="bg-zamzam-white/5 border-none text-zamzam-white hover:bg-zamzam-primary hover:text-zamzam-white transition-all duration-300 w-10 h-10"
                tooltipClassName="bg-zamzam-primary text-zamzam-white"
              />
            </div>
          </div>


          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold text-zamzam-white mb-8 pb-2 border-b border-zamzam-text-white inline-block min-w-[50px]">
              Useful Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/faqs", label: "FAQ" },
                { href: "/location", label: "Location" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zamzam-text-light text-sm hover:text-zamzam-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-zamzam-text-light group-hover:text-zamzam-primary transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

           {/* My Account */}
           <div>
            <h3 className="text-lg font-semibold text-zamzam-white mb-8 pb-2 border-b border-zamzam-text-white inline-block min-w-[50px]">
              My Account
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/account", label: "My Account" },
                { href: "/discount", label: "Discount" },
                { href: "/returns", label: "Returns" },
                { href: "/orders", label: "Orders History" },
                { href: "/tracking", label: "Order Tracking" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                     className="text-zamzam-text-light text-sm hover:text-zamzam-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-zamzam-text-light group-hover:text-zamzam-primary transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-zamzam-white mb-8 pb-2 border-b border-zamzam-text-white inline-block min-w-[50px]">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.slice(0, 5).map((category) => (
                <li key={category?._id}>
                  <Link
                    href={{
                      pathname: "/products",
                      query: { category: category?.slug?.current },
                    }}
                    className="text-zamzam-text-light text-sm hover:text-zamzam-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-zamzam-text-light group-hover:text-zamzam-primary transition-colors duration-300" />
                    {category?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-zamzam-white mb-8 pb-2 border-b border-zamzam-text-white inline-block min-w-[50px]">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                 <div className="mt-1 text-zamzam-primary">
                    <MapPin size={20} />
                 </div>
                <p className="text-zamzam-text-light text-sm group-hover:text-zamzam-white transition-colors duration-300">
                  A.S. Complex, Meithi Nagar, Palacode, Dharmapuri, Tamil Nadu 636808
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="text-zamzam-primary">
                    <Mail size={20} />
                </div>
                <a
                  href="mailto:zamzamfashionstore@gmail.com"
                  className="text-zamzam-text-light text-sm group-hover:text-zamzam-white transition-colors duration-300"
                >
                  zamzamfashionstore@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-4 group">
                 <div className="text-zamzam-primary">
                    <Phone size={20} />
                 </div>
                <p className="text-zamzam-text-light text-sm group-hover:text-zamzam-white transition-colors duration-300">
                  +91 9739625092
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zamzam-text-dark pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <Link href="https://www.reactbd.com/">
            <p className="text-zamzam-text-light text-sm">
                © 2026 All Rights Reserved by <span className="text-zamzam-primary hover:text-white cursor-pointer transition-colors">ZamZamFashionStore</span>
            </p></Link>


            <div className="flex items-center gap-2">
              {[
                { icon: <FaCcVisa size={20} />, name: "Visa" },
                { icon: <FaCcDiscover size={20} />, name: "Discover" },
                { icon: <FaCcMastercard size={20} />, name: "MasterCard" },
                { icon: <FaCcPaypal size={20} />, name: "PayPal" },
                { icon: <FaCcAmex size={20} />, name: "American Express" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-zamzam-white/10 w-10 h-7 rounded flex items-center justify-center hover:bg-zamzam-primary hover:text-white transition-all duration-300 cursor-pointer text-zamzam-white/80"
                  title={item.name}
                >
                  {item.icon}
                </div>
              ))}
            </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
