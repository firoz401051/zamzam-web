
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";

// Helper function to check admin access
async function checkAdmin() {
  const user = await currentUser();
  
  if (!user) {
    return { authorized: false, status: 401, error: "Unauthorized - Please sign in" };
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  
  const isAdmin = userEmail && adminEmails.includes(userEmail.toLowerCase());

  if (!isAdmin) {
    return { authorized: false, status: 403, error: "Unauthorized - Admin access required" };
  }

  return { authorized: true };
}

// POST /api/admin/orders/bulk-delete - Delete multiple orders (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status || 401 }
      );
    }

    const { orderIds } = await request.json();

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request - orderIds array required" },
        { status: 400 }
      );
    }

    console.log("Admin bulk deleting orders:", orderIds.length);

    // Perform bulk delete using Sanity transaction
    const transaction = writeClient.transaction();
    
    orderIds.forEach((id) => {
      transaction.delete(id);
    });

    await transaction.commit();

    console.log("Bulk delete successful");

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${orderIds.length} orders`,
      deletedCount: orderIds.length
    });
  } catch (error: any) {
    console.error("Error performing bulk delete:", error);
    return NextResponse.json(
      {
        error: "Failed to delete orders",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
