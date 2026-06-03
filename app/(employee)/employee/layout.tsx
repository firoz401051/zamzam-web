import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EmployeeSidebar } from "@/components/employee/EmployeeSidebar";
import { EmployeeTopNavigation } from "@/components/employee/EmployeeTopNavigation";
import { getUserByClerkId } from "@/lib/employee-utils";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user from Sanity to check employee role
  const user = await getUserByClerkId(userId);

  if (!user || !user.isEmployee || user.employeeRole === "none") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <EmployeeSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <EmployeeTopNavigation user={user} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}