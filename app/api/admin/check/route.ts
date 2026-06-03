import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is admin based on environment variable or metadata
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAdminByEmail = adminEmails.includes(
      user.emailAddresses[0]?.emailAddress || ""
    );
    const isAdminByMetadata = user.publicMetadata?.isAdmin === true;

    const isAdmin = isAdminByEmail || isAdminByMetadata;

    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
