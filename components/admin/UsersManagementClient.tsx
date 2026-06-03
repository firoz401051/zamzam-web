"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  Download,
  UserPlus,
  RefreshCw,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";

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

interface UsersManagementClientProps {
  initialUsers?: User[];
  initialTotal?: number;
  initialTotalPages?: number;
}

export default function UsersManagementClient({
  initialUsers = [],
  initialTotal = 0,
  initialTotalPages = 0,
}: UsersManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(initialTotal || 0);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    isAdmin: false,
  });
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "active" as "active" | "suspended" | "pending",
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterStatus]);

  // Add search debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus]);

  const refreshUsers = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((users || []).filter((user) => user.id !== userToDelete.id));
        setTotalUsers((prev) => prev - 1);
        toast.success("User deleted successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    const user = (users || []).find((u) => u.id === userId);
    if (!user) return;

    const newStatus = user.status === "suspended" ? "active" : "suspended";

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          banned: newStatus === "suspended",
        }),
      });

      if (response.ok) {
        setUsers(
          (users || []).map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: newStatus as "active" | "suspended" | "pending",
                }
              : user
          )
        );
        toast.success(
          `User ${
            newStatus === "suspended" ? "suspended" : "activated"
          } successfully`
        );
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user status");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsCreatingUser(true);
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          publicMetadata: {
            isAdmin: newUser.isAdmin,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers([data.user, ...(users || [])]);
        setTotalUsers((prev) => prev + 1);
        toast.success("User created successfully");
        setIsAddUserOpen(false);
        setNewUser({ email: "", firstName: "", lastName: "", isAdmin: false });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdatingUser(true);
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: editUser.firstName,
          lastName: editUser.lastName,
          banned: editUser.status === "suspended",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(
          (users || []).map((user) =>
            user.id === selectedUser.id
              ? { ...user, ...data.user, status: editUser.status }
              : user
          )
        );
        toast.success("User updated successfully");
        setIsEditUserOpen(false);
        setSelectedUser(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const openEditSidebar = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
    });
    setIsEditUserOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add User Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <p className="text-gray-600">Manage and view all user accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={refreshUsers} disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Sheet open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <SheetTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96 sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Add New User</SheetTitle>
                <SheetDescription>
                  Create a new user account with admin or regular user access.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={newUser.firstName}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={newUser.lastName}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role">User Role</Label>
                  <select
                    id="role"
                    value={newUser.isAdmin ? "admin" : "user"}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        isAdmin: e.target.value === "admin",
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Administrators have full access to the admin panel
                  </p>
                </div>
              </div>
              <SheetFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddUserOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  disabled={isCreatingUser}
                  className="w-full sm:w-auto"
                >
                  {isCreatingUser ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end space-x-2">
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : users && users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="h-12 w-12 mb-4" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  (users || []).map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "suspended"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {user.isAdmin && (
                            <Shield className="h-4 w-4 mr-1 text-amber-500" />
                          )}
                          <span
                            className={
                              user.isAdmin ? "text-amber-600 font-medium" : ""
                            }
                          >
                            {user.isAdmin ? "Admin" : "User"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{user.orders}</span>
                      </TableCell>
                      <TableCell>
                        <PriceFormatter
                          amount={user.totalSpent}
                          className="font-medium"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditSidebar(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            {user.status === "suspended"
                              ? "Activate"
                              : "Suspend"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent side="right" className="w-96 sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user information and account settings.
            </SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="space-y-6 py-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedUser.firstName.charAt(0)}
                  {selectedUser.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "default"
                        : selectedUser.status === "suspended"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mt-1"
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input
                      id="editFirstName"
                      value={editUser.firstName}
                      onChange={(e) =>
                        setEditUser((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input
                      id="editLastName"
                      value={editUser.lastName}
                      onChange={(e) =>
                        setEditUser((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editEmail">Email Address</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editUser.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email addresses cannot be changed
                  </p>
                </div>
                <div>
                  <Label htmlFor="editStatus">Account Status</Label>
                  <select
                    id="editStatus"
                    value={editUser.status}
                    onChange={(e) =>
                      setEditUser((prev) => ({
                        ...prev,
                        status: e.target.value as
                          | "active"
                          | "suspended"
                          | "pending",
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedUser.orders}
                    </p>
                    <p className="text-xs text-blue-600">Total Orders</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      <PriceFormatter amount={selectedUser.totalSpent} />
                    </p>
                    <p className="text-xs text-green-600">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <SheetFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditUserOpen(false);
                setSelectedUser(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={isUpdatingUser}
              className="w-full sm:w-auto"
            >
              {isUpdatingUser ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
            )}
          >
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            {userToDelete && (
              <div className="py-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-red-100">
                  <div className="w-10 h-10 bg-linear-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                    {userToDelete.firstName.charAt(0)}
                    {userToDelete.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {userToDelete.firstName} {userToDelete.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userToDelete.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setUserToDelete(null);
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteUser}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </DialogFooter>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
