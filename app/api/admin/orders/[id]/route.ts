
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

// PATCH /api/admin/orders/[id] - Update order details (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await checkAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status || 401 }
      );
    }

    const { id } = await params;
    const orderId = id;
    const updates = await request.json();

    console.log("Admin updating order:", orderId, "with updates:", updates);

    // Verify the order exists
    const existingOrder = await writeClient.getDocument(orderId);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order
    const updatedOrder = await writeClient.patch(orderId).set(updates).commit();

    console.log("Order updated successfully by admin:", updatedOrder._id);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        error: "Failed to update order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders/[id] - Delete order (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await checkAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status || 401 }
      );
    }

    const { id } = await params;
    const orderId = id;

    console.log("Admin deleting order:", orderId);

    // Verify the order exists
    const existingOrder = await writeClient.getDocument(orderId);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Delete the order
    await writeClient.delete(orderId);

    console.log("Order deleted successfully by admin:", orderId);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      {
        error: "Failed to delete order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
