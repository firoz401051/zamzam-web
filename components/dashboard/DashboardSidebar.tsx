"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  User,
  MapPin,
  Settings,
  Bell,
  Shield,
  Download,
  CreditCard,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/user/dashboard",
    icon: LayoutDashboard,
    description: "Dashboard overview",
  },

  {
    title: "Orders",
    href: "/user/orders",
    icon: Package,
    description: "View your orders",
  },
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
    description: "Edit your profile",
  },
  {
    title: "Addresses",
    href: "/user/addresses",
    icon: MapPin,
    description: "Manage addresses",
  },
  {
    title: "Payment Methods",
    href: "/user/payments",
    icon: CreditCard,
    description: "Saved payment methods",
  },
  {
    title: "Reviews",
    href: "/user/reviews",
    icon: Star,
    description: "Your reviews",
  },
  {
    title: "Settings",
    href: "/user/settings",
    icon: Settings,
    description: "Account settings",
  },
  {
    title: "My Cart",
    href: "/cart",
    icon: ShoppingCart,
    description: "Shopping cart items",
  },
  {
    title: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    description: "Saved for later",
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="block lg:hidden mb-4">
        <Button
          onClick={toggleMenu}
          variant="outline"
          className="w-full justify-between gap-3 p-4 hover:bg-zamzam-primary/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">Dashboard Menu</span>
          </div>
          <motion.div
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      {/* Desktop Sidebar - Always visible on large screens */}
      <Card
        className={cn(
          "p-5 bg-white shadow-sm border border-gray-100 sticky top-32",
          "hidden lg:block"
        )}
      >
        <h3 className="font-semibold text-zamzam-text-dark mb-5 text-base">
          Dashboard
        </h3>

        <nav className="space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2.5 h-auto py-2.5 px-3 group transition-all",
                    isActive
                      ? "bg-zamzam-primary text-white hover:bg-zamzam-primary/90 shadow-sm"
                      : "text-zamzam-text-dark hover:bg-zamzam-surface"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-all",
                      isActive
                        ? "text-white"
                        : "text-zamzam-text-medium group-hover:text-zamzam-primary"
                    )}
                  />
                  <div className="text-left overflow-hidden">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors truncate",
                        isActive
                          ? "text-white"
                          : "text-zamzam-text-dark group-hover:text-zamzam-primary"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p
                        className={cn(
                          "text-xs transition-colors truncate",
                          isActive
                            ? "text-white/80"
                            : "text-zamzam-text-muted group-hover:text-zamzam-primary/80"
                        )}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions Section */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h4 className="font-medium text-zamzam-text-dark mb-3 text-xs uppercase tracking-wide">
            Quick Actions
          </h4>
          <div className="space-y-1.5">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2.5 h-auto py-2 text-xs hover:bg-zamzam-primary/5"
            >
              <Bell className="w-3.5 h-3.5" />
              Notifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2.5 h-auto py-2 text-xs hover:bg-zamzam-primary/5"
            >
              <Shield className="w-3.5 h-3.5" />
              Privacy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2.5 h-auto py-2 text-xs hover:bg-zamzam-primary/5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Mobile Accordion Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="block lg:hidden bg-white shadow-lg border border-gray-100">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                {/* Close Button */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-semibold text-zamzam-text-dark">
                    Menu
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <nav className="space-y-1">
                  {sidebarItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3 h-auto py-2.5 px-3 group",
                              isActive
                                ? "bg-zamzam-primary text-white hover:bg-zamzam-primary/90"
                                : "text-zamzam-text-dark hover:bg-zamzam-surface"
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-4 h-4 shrink-0",
                                isActive
                                  ? "text-white"
                                  : "text-zamzam-text-dark"
                              )}
                            />
                            <div className="text-left">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isActive
                                    ? "text-white"
                                    : "text-zamzam-text-dark"
                                )}
                              >
                                {item.title}
                              </p>
                            </div>
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Quick Actions Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <h4 className="font-medium text-zamzam-text-dark mb-3 text-xs uppercase tracking-wide">
                    Quick Actions
                  </h4>
                  <div className="space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-3 h-auto py-2 hover:bg-zamzam-primary/5"
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-3 h-auto py-2 hover:bg-zamzam-primary/5"
                    >
                      <Shield className="w-4 h-4" />
                      Privacy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-3 h-auto py-2 hover:bg-zamzam-primary/5"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
