import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, canAccessEmployeeArea } from "@/lib/employee-utils";
import { DeliverymanStats } from "@/components/employee/DeliverymanStats";
import { DeliveryOrderTable } from "@/components/employee/DeliveryOrderTable";

export default async function DeliverymanDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (!user || !canAccessEmployeeArea(user, "deliveryman")) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-600">
          Manage delivery routes and order completion
        </p>
      </div>

      {/* Delivery Statistics */}
      <DeliverymanStats />

      {/* Delivery Orders Table */}
      <DeliveryOrderTable />
    </div>
  );
}