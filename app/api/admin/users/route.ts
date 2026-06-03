import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Type definitions
interface ClerkEmailAddress {
  id: string;
  email_address: string;
  verification: {
    status: "verified" | "unverified";
  };
}

interface ClerkPhoneNumber {
  id: string;
  phone_number: string;
}

interface ClerkUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkEmailAddress[];
  phone_numbers: ClerkPhoneNumber[];
  primary_email_address_id: string | null;
  image_url: string;
  created_at: number;
  updated_at: number;
  last_sign_in_at: number | null;
  banned: boolean;
  locked: boolean;
  public_metadata: Record<string, any>;
  private_metadata: Record<string, any>;
}

interface CreateUserRequestBody {
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  password?: string;
  phoneNumber?: string;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
}

interface CreateUserData {
  emailAddress: string[];
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string[];
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
}

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

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
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

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // Fetch users from Clerk
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users?limit=${limit}&offset=${
        (page - 1) * limit
      }${search ? `&query=${encodeURIComponent(search)}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!clerkResponse.ok) {
      throw new Error("Failed to fetch users from Clerk");
    }

    const clerkData: ClerkUser[] = await clerkResponse.json();

    // Transform Clerk user data to our format
    const users = clerkData.map((user: ClerkUser) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email:
        user.email_addresses?.find(
          (email: ClerkEmailAddress) =>
            email.id === user.primary_email_address_id
        )?.email_address || "",
      imageUrl: user.image_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastSignInAt: user.last_sign_in_at,
      banned: user.banned,
      locked: user.locked,
      emailVerified:
        user.email_addresses?.find(
          (email: ClerkEmailAddress) =>
            email.id === user.primary_email_address_id
        )?.verification?.status === "verified",
      phoneNumber: user.phone_numbers?.[0]?.phone_number || null,
      metadata: {
        publicMetadata: user.public_metadata,
        privateMetadata: user.private_metadata,
      },
    }));

    // Filter by status if provided
    let filteredUsers = users;
    if (status === "active") {
      filteredUsers = users.filter((user) => !user.banned && !user.locked);
    } else if (status === "banned") {
      filteredUsers = users.filter((user) => user.banned);
    } else if (status === "locked") {
      filteredUsers = users.filter((user) => user.locked);
    }

    // Get total count for pagination
    const totalResponse = await fetch("https://api.clerk.com/v1/users/count", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const totalData = await totalResponse.json();
    const totalUsers =
      totalData.object === "total_count" ? totalData.total_count : 0;

    return NextResponse.json({
      success: true,
      users: filteredUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
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

    const body: CreateUserRequestBody = await request.json();
    const {
      firstName,
      lastName,
      emailAddress, // Changed from 'email' to match frontend
      password,
      phoneNumber,
      publicMetadata,
      privateMetadata,
    } = body;

    // Validate required fields
    if (!emailAddress) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      // Use Clerk client instead of direct fetch
      const clerk = await clerkClient();

      const createUserData: CreateUserData = {
        emailAddress: [emailAddress], // Clerk expects array format
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      };

      if (password) {
        createUserData.password = password;
      }

      if (phoneNumber) {
        createUserData.phoneNumber = [phoneNumber];
      }

      if (publicMetadata) {
        createUserData.publicMetadata = publicMetadata;
      }

      if (privateMetadata) {
        createUserData.privateMetadata = privateMetadata;
      }

      // Create user using Clerk client
      const newUser = await clerk.users.createUser(createUserData);

      return NextResponse.json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.emailAddresses?.[0]?.emailAddress,
          imageUrl: newUser.imageUrl,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Error in POST /api/admin/users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
