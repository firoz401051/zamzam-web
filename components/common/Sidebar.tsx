import {
  X,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Phone,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "../layout/Logo";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import SocialMedia from "../layout/SocialMedia";
import { headerData } from "@/constants";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { signOut } = useAuth();

  const supportItems = [
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: Phone, label: "Contact Us", href: "/contact" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={sidebarRef}
            className="fixed top-0 left-0 z-[70] h-screen w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl border-r border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Logo compact className="text-zamzam-primary" />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <SignedIn>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-zamzam-primary/10 to-zamzam-primary-hover/10 rounded-lg">
                  <div className="w-10 h-10 bg-zamzam-primary/20 rounded-full flex items-center justify-center">
                    <User size={20} className="text-zamzam-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Welcome back!</p>
                    <p className="text-sm text-gray-600">Manage your account</p>
                  </div>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="space-y-2">
                  <Link
                    href="/sign-in"
                    onClick={onClose}
                    className="w-full bg-zamzam-primary text-white py-2.5 px-4 rounded-lg font-semibold text-center block hover:bg-zamzam-primary-hover transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={onClose}
                    className="w-full border-2 border-zamzam-primary text-zamzam-primary py-2.5 px-4 rounded-lg font-semibold text-center block hover:bg-zamzam-primary/5 transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </div>
              </SignedOut>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                Menu
              </h3>
              <div className="space-y-1">
                {headerData?.map((item, index) => (
                  <motion.div
                    key={item?.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      onClick={onClose}
                      href={item?.href}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        pathname === item?.href
                          ? "bg-zamzam-primary text-white shadow-lg"
                          : "text-gray-700 hover:bg-zamzam-primary/10 hover:text-zamzam-primary"
                      }`}
                    >
                      <span className="font-medium">{item?.title}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Support Section */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                  Support
                </h3>
                <div className="space-y-1">
                  {supportItems.map((item, index) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-zamzam-primary transition-all duration-200"
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-200">
              <SignedIn>
                <button
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="flex items-center justify-center w-full text-sm py-2 gap-2 text-zamzam-primary/80 hover:text-zamzam-primary duration-300 hover:cursor-pointer"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </SignedIn>

              <SocialMedia />

              {/* App Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">zamzam v2.0</p>
                <p className="text-xs text-gray-400 mt-1">
                  © 2024 All rights reserved
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
