"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EmployeeUser, getEmployeeRoleDisplayName, canAccessEmployeeArea } from "@/lib/employee-utils";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Calculator,
  User,
  LogOut
} from "lucide-react";

interface EmployeeSidebarProps {
  user: EmployeeUser;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
    area: "dashboard",
    description: "Admin overview"
  },
  {
    name: "Packer",
    href: "/employee/packer",
    icon: Package,
    area: "packer",
    description: "Order packing"
  },
  {
    name: "Delivery",
    href: "/employee/deliveryman",
    icon: Truck,
    area: "deliveryman",
    description: "Delivery management"
  },
  {
    name: "Accounts",
    href: "/employee/accounts",
    icon: Calculator,
    area: "accounts",
    description: "Financial oversight"
  },
];

export function EmployeeSidebar({ user }: EmployeeSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {getEmployeeRoleDisplayName(user.employeeRole)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const canAccess = canAccessEmployeeArea(user, item.area);
          
          if (!canAccess) return null;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <div className="flex-1">
                <div>{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}