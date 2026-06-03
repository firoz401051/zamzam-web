"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  Package,
  Heart,
  LogOut,
  UserCircle,
  Shield,
} from "lucide-react";

import { useUser, useClerk } from "@clerk/nextjs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserDropdownProps {
  ordersCount?: number;
}

const UserDropdown = ({ ordersCount = 0 }: UserDropdownProps) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);

  // ✅ Fix Hydration Issue
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!user) return null;

  // ✅ Admin Check Safe After Mount
  const adminEmails =
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
      .split(",")
      .map((e) => e.trim());

  const userEmail = user.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail && adminEmails.includes(userEmail);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="User"
              className="w-8 h-8 rounded-full border"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-gray-400" />
          )}

          <span className="hidden lg:block text-sm font-medium">
            {user.firstName || "Account"}
          </span>
        </button>
      </PopoverTrigger>

      {/* Dropdown */}
      <PopoverContent className="w-72 p-0" align="end">
        {/* User Info */}
        <div className="p-4 border-b">
          <h3 className="font-semibold">{user.fullName}</h3>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>

        {/* Menu */}
        <div className="p-2 space-y-1">
          <Link
            href="/user/profile"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          <Link
            href="/user/orders"
            className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Orders
            </div>

            {ordersCount > 0 && (
              <span className="text-xs bg-black text-white px-2 rounded-full">
                {ordersCount}
              </span>
            )}
          </Link>

          <Link
            href="/user/wishlist"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <Heart className="w-4 h-4" />
            Wishlist
          </Link>

          <Link
            href="/user/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
            Dashboard
          </Link>

          {/* ✅ Admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-amber-100 text-amber-800 font-semibold"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserDropdown;