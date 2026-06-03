import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, canAccessEmployeeArea } from "@/lib/employee-utils";
import { PackerOrderTable } from "@/components/employee/PackerOrderTable";
import { PackerStats } from "@/components/employee/PackerStats";

export default async function PackerDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (!user || !canAccessEmployeeArea(user, "packer")) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Packer Dashboard</h1>
        <p className="text-gray-600">
          Manage order packing and confirmation workflows
        </p>
      </div>

      {/* Packer Statistics */}
      <PackerStats />

      {/* Orders Table */}
      <PackerOrderTable />
    </div>
  );
}