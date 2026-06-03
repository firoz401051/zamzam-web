"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  Database,
  TrendingUp,
  FileText,
  Bell,
  Brain,
  Activity,
  Gift,
  MessageSquare
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminSidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
  section: string;
}

const adminSidebarItems: AdminSidebarItem[] = [
  // Dashboard Section
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Admin dashboard overview",
    section: "Dashboard",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Sales and user analytics",
    section: "Dashboard",
  },

  // User Management Section
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage all users",
    section: "User Management",
  },
  {
    title: "Product Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
    description: "Moderate reviews",
    section: "User Management",
  },
  {
    title: "Loyalty Points",
    href: "/admin/loyalty",
    icon: Gift,
    description: "Loyalty program management",
    section: "User Management",
  },

  // Commerce Section
  {
    title: "Orders",
    href: "/admin/orders",
    icon: Package,
    description: "Manage orders",
    section: "Commerce",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: ShoppingCart,
    description: "Manage products",
    section: "Commerce",
  },

  // Business Intelligence Section
  {
    title: "Business Intelligence",
    href: "/admin/business-intelligence",
    icon: Brain,
    description: "Advanced analytics & insights",
    section: "Business Intelligence",
  },
  {
    title: "System Monitoring",
    href: "/admin/monitoring",
    icon: Activity,
    description: "System health & performance",
    section: "Business Intelligence",
  },

  // Reports Section
  {
    title: "Sales Reports",
    href: "/admin/reports/sales",
    icon: TrendingUp,
    description: "Sales performance",
    section: "Reports",
  },
  {
    title: "User Reports",
    href: "/admin/reports/users",
    icon: FileText,
    description: "User activity reports",
    section: "Reports",
  },

  // System Section
  {
    title: "Database",
    href: "/admin/database",
    icon: Database,
    description: "Database management",
    section: "System",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System settings",
    section: "System",
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  // Group items by section
  const groupedItems = adminSidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, AdminSidebarItem[]>);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-gray-900">Admin Panel</h3>
      </div>

      <nav className="space-y-6">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section}
            </h4>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3 px-4 group",
                        isActive
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive ? "text-white" : "text-gray-500"
                        )}
                      />
                      <div className="text-left flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isActive ? "text-white" : "text-gray-900"
                            )}
                          >
                            {item.title}
                          </p>
                          {item.badge && (
                            <Badge
                              variant={isActive ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p
                            className={cn(
                              "text-xs",
                              isActive ? "text-red-100" : "text-gray-500"
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
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link href="/user/dashboard">
          <Button variant="outline" className="w-full">
            Switch to User View
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
