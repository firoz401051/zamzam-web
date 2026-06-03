import { useUser } from "@clerk/nextjs";

// Admin utility functions
export const getAdminEmails = (): string[] => {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  return adminEmails
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
};

export const isAdminEmail = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};

// Admin hook
export const useAdmin = () => {
  const { user, isLoaded } = useUser();

  const isAdmin =
    isLoaded && user
      ? isAdminEmail(user.emailAddresses[0]?.emailAddress || "")
      : false;

  return {
    isAdmin,
    isLoaded,
    user,
    adminEmails: getAdminEmails(),
  };
};

// Server-side admin check
export const checkAdminAccess = (userEmail: string): boolean => {
  return isAdminEmail(userEmail);
};

// Admin role types
export type AdminRole = "super_admin" | "admin" | "moderator";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
}

export interface AdminPermission {
  resource: "users" | "orders" | "products" | "analytics" | "settings";
  actions: ("create" | "read" | "update" | "delete")[];
}

// Default admin permissions
export const getDefaultAdminPermissions = (): AdminPermission[] => [
  {
    resource: "users",
    actions: ["create", "read", "update", "delete"],
  },
  {
    resource: "orders",
    actions: ["read", "update", "delete"],
  },
  {
    resource: "products",
    actions: ["create", "read", "update", "delete"],
  },
  {
    resource: "analytics",
    actions: ["read"],
  },
  {
    resource: "settings",
    actions: ["read", "update"],
  },
];
