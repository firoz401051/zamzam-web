import React from "react";
import { Metadata } from "next";
import AdminProtected from "@/components/admin/AdminProtected";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | zamzam",
  description: "Admin dashboard for managing zamzam e-commerce platform.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <span className="font-bold text-lg">Admin Panel</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 border-r">
               <div className="h-full overflow-y-auto p-4">
                  <AdminSidebar />
               </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-80 border-r bg-white min-h-screen p-6 sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </AdminProtected>
  );
}
