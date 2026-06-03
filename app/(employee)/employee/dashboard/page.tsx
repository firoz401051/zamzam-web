import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, isEmployeeAdmin } from "@/lib/employee-utils";
import { EmployeeDashboardStats } from "@/components/employee/EmployeeDashboardStats";
import { EmployeeOrderOverview } from "@/components/employee/EmployeeOrderOverview";
import { EmployeeRecentActivity } from "@/components/employee/EmployeeRecentActivity";

export default async function EmployeeDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (!user || !isEmployeeAdmin(user)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Administrative overview of all employee activities and order management
        </p>
      </div>

      {/* Statistics Cards */}
      <EmployeeDashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Overview */}
        <EmployeeOrderOverview />

        {/* Recent Activity */}
        <EmployeeRecentActivity />
      </div>
    </div>
  );
}