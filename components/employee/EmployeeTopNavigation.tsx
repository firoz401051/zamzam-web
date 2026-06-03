"use client";

import { EmployeeUser, getEmployeeRoleDisplayName } from "@/lib/employee-utils";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmployeeTopNavigationProps {
  user: EmployeeUser;
}

export function EmployeeTopNavigation({ user }: EmployeeTopNavigationProps) {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Employee Portal
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user.firstName}
          </p>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders, customers..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side - User info and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <Badge variant="outline" className="text-xs">
                {getEmployeeRoleDisplayName(user.employeeRole)}
              </Badge>
            </div>
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}