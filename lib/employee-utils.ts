import { client } from "@/sanity/lib/client";

// Employee role type
export type EmployeeRole = 
  | "admin" 
  | "packer" 
  | "deliveryman" 
  | "accounts" 
  | "other" 
  | "none";

// Employee user interface
export interface EmployeeUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  clerkUserId: string;
  isEmployee: boolean;
  employeeRole: EmployeeRole;
  employeeId?: string;
  department?: string;
  isActive: boolean;
}

// Get user by Clerk ID
export async function getUserByClerkId(clerkUserId: string): Promise<EmployeeUser | null> {
  const query = `*[_type == "user" && clerkUserId == $clerkUserId][0]{
    _id,
    firstName,
    lastName,
    email,
    clerkUserId,
    isEmployee,
    employeeRole,
    employeeId,
    department,
    isActive
  }`;

  try {
    const user = await client.fetch(query, { clerkUserId });
    return user || null;
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return null;
  }
}

// Check if user has specific employee role
export function hasEmployeeRole(user: EmployeeUser, role: EmployeeRole): boolean {
  return user.isEmployee && user.employeeRole === role;
}

// Check if user has admin privileges
export function isEmployeeAdmin(user: EmployeeUser): boolean {
  return hasEmployeeRole(user, "admin");
}

// Check if user has employee access (any employee role)
export function hasEmployeeAccess(role: EmployeeRole): boolean {
  return role !== "none" && role !== "other";
}

// Check if user can access specific employee areas
export function canAccessEmployeeArea(user: EmployeeUser, area: string): boolean {
  if (!user.isEmployee || user.employeeRole === "none") {
    return false;
  }

  switch (area) {
    case "dashboard":
      return user.employeeRole === "admin";
    case "packer":
      return user.employeeRole === "packer" || user.employeeRole === "admin";
    case "deliveryman":
      return user.employeeRole === "deliveryman" || user.employeeRole === "admin";
    case "accounts":
      return user.employeeRole === "accounts" || user.employeeRole === "admin";
    default:
      return false;
  }
}

// Get employee role display name
export function getEmployeeRoleDisplayName(role: EmployeeRole): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "packer":
      return "Packer";
    case "deliveryman":
      return "Delivery Manager";
    case "accounts":
      return "Accounts Manager";
    case "other":
      return "Employee";
    case "none":
      return "No Role";
    default:
      return "Unknown";
  }
}

// Order status types for employee management
export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "packed" 
  | "delivering" 
  | "delivered" 
  | "cancelled";

// Check if employee can update order status
export function canUpdateOrderStatus(
  user: EmployeeUser, 
  currentStatus: OrderStatus, 
  newStatus: OrderStatus
): boolean {
  if (!user.isEmployee) return false;

  switch (user.employeeRole) {
    case "admin":
      return true; // Admin can update any status
    case "packer":
      return (
        (currentStatus === "pending" && newStatus === "confirmed") ||
        (currentStatus === "confirmed" && newStatus === "packed")
      );
    case "deliveryman":
      return (
        (currentStatus === "packed" && newStatus === "delivering") ||
        (currentStatus === "delivering" && newStatus === "delivered")
      );
    case "accounts":
      return newStatus === "cancelled"; // Can only cancel orders
    default:
      return false;
  }
}