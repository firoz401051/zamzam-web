import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    if (!user) return false;

    // Check admin emails from environment variable or metadata
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAdminByEmail = adminEmails.includes(
      user.emailAddresses[0]?.emailAddress || ""
    );
    const isAdminByMetadata = user.publicMetadata?.isAdmin === true;

    return isAdminByEmail || isAdminByMetadata;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminStatus = await isAdmin(userId);
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const targetUserId = id;

    // Fetch user from Clerk
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${targetUserId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!clerkResponse.ok) {
      if (clerkResponse.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw new Error("Failed to fetch user from Clerk");
    }

    const user = await clerkResponse.json();

    // Transform Clerk user data
    const transformedUser = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email:
        user.email_addresses?.find(
          (email: any) => email.id === user.primary_email_address_id
        )?.email_address || "",
      imageUrl: user.image_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastSignInAt: user.last_sign_in_at,
      banned: user.banned,
      locked: user.locked,
      emailVerified:
        user.email_addresses?.find(
          (email: any) => email.id === user.primary_email_address_id
        )?.verification?.status === "verified",
      phoneNumber: user.phone_numbers?.[0]?.phone_number || null,
      emailAddresses: user.email_addresses || [],
      phoneNumbers: user.phone_numbers || [],
      metadata: {
        publicMetadata: user.public_metadata,
        privateMetadata: user.private_metadata,
        unsafeMetadata: user.unsafe_metadata,
      },
    };

    return NextResponse.json({
      success: true,
      user: transformedUser,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminStatus = await isAdmin(userId);
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const targetUserId = id;
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      banned,
      locked,
      publicMetadata,
      privateMetadata,
    } = body;

    // Build update data
    const updateData: any = {};

    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (banned !== undefined) updateData.banned = banned;
    if (locked !== undefined) updateData.locked = locked;
    if (publicMetadata !== undefined)
      updateData.public_metadata = publicMetadata;
    if (privateMetadata !== undefined)
      updateData.private_metadata = privateMetadata;

    // Handle email update separately if needed
    if (email) {
      updateData.primary_email_address_id = email;
    }

    // Handle phone number update separately if needed
    if (phoneNumber) {
      updateData.primary_phone_number_id = phoneNumber;
    }

    // Update user in Clerk
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${targetUserId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json();
      throw new Error(
        errorData.errors?.[0]?.message || "Failed to update user"
      );
    }

    const updatedUser = await clerkResponse.json();

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email_addresses?.find(
          (email: any) => email.id === updatedUser.primary_email_address_id
        )?.email_address,
        banned: updatedUser.banned,
        locked: updatedUser.locked,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminStatus = await isAdmin(userId);
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const targetUserId = params.id;

    // Prevent admin from deleting themselves
    if (targetUserId === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user from Clerk
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${targetUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!clerkResponse.ok) {
      if (clerkResponse.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const errorData = await clerkResponse.json();
      throw new Error(
        errorData.errors?.[0]?.message || "Failed to delete user"
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
