import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, canAccessEmployeeArea } from "@/lib/employee-utils";
import { AccountsStats } from "@/components/employee/AccountsStats";
import { AccountsOrderTable } from "@/components/employee/AccountsOrderTable";
import { RevenueChart } from "@/components/employee/RevenueChart";

export default async function AccountsDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (!user || !canAccessEmployeeArea(user, "accounts")) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accounts Dashboard</h1>
        <p className="text-gray-600">
          Financial oversight, revenue tracking, and order management
        </p>
      </div>

      {/* Financial Statistics */}
      <AccountsStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <RevenueChart />

        {/* All Orders Management */}
        <AccountsOrderTable />
      </div>
    </div>
  );
}