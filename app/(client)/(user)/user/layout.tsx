import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-zamzam-background">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zamzam-text-dark mb-2">
            Welcome back, {user.firstName || "User"}!
          </h1>
          <p className="text-zamzam-text-muted">
            Manage your account and view your activity.
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Narrower on large screens */}
          <div className="lg:col-span-3 xl:col-span-2">
            <DashboardSidebar />
          </div>

          {/* Main Content - Takes more space with white background */}
          <div className="lg:col-span-9 xl:col-span-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {children}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardLayout;
