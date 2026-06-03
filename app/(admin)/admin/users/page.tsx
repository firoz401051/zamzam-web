import { Suspense } from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import UsersManagementClient from "@/components/admin/UsersManagementClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  createdAt: string;
  lastSignIn?: string;
  emailVerified: boolean;
  isAdmin: boolean;
  orders: number;
  totalSpent: number;
  status: "active" | "suspended" | "pending";
}

// Server-side admin check
async function checkAdminAccess() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    if (!user) {
      return false;
    }

    // Check admin emails from environment variable
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAdminByEmail = adminEmails.includes(
      user.emailAddresses[0]?.emailAddress || ""
    );
    const isAdminByMetadata = user.publicMetadata?.isAdmin === true;

    return isAdminByEmail || isAdminByMetadata;
  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
}

// Server-side function to fetch initial users data
async function getInitialUsers() {
  try {
    const clerk = await clerkClient();

    const response = await clerk.users.getUserList({
      limit: 10,
    });

    // Transform Clerk users to our User interface
    const users: User[] = response.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt).toISOString(),
      lastSignIn: user.lastSignInAt
        ? new Date(user.lastSignInAt).toISOString()
        : undefined,
      emailVerified:
        user.emailAddresses[0]?.verification?.status === "verified",
      isAdmin: user.publicMetadata?.isAdmin === true,
      orders: 0, // Would come from your order system
      totalSpent: 0, // Would come from your order system
      status: user.banned
        ? "suspended"
        : ("active" as "active" | "suspended" | "pending"),
    }));

    return {
      users,
      total: response.totalCount,
      totalPages: Math.ceil(response.totalCount / 10),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export default async function AdminUsersPage() {
  // Check admin access on server
  const isAdmin = await checkAdminAccess();

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch initial data on server
  const initialData = await getInitialUsers();

  return (
    <Container>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">Manage all registered users</p>
          </div>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users ({initialData.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
            >
              <UsersManagementClient
                initialUsers={initialData.users}
                initialTotal={initialData.total}
                initialTotalPages={initialData.totalPages}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
