import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    console.log("✅ Razorpay Checkout Route Called");

    // ✅ Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Parse request
    const { orderId, orderNumber } = await req.json();

    if (!orderId || !orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order ID and Order Number required" },
        { status: 400 }
      );
    }

    // ✅ ENV CHECK (Most Important Fix)
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("❌ Razorpay keys missing in .env.local");
      return NextResponse.json(
        { success: false, error: "Razorpay keys not configured" },
        { status: 500 }
      );
    }

    // ✅ Fetch order from Sanity
    const order = await backendClient.fetch(
      `*[_type=="order" && _id==$orderId][0]{
        _id,
        clerkUserId,
        totalPrice,
        customerName,
        email
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Ownership check
    if (order.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // ✅ Amount validation
    const totalPrice = Number(order.totalPrice);
    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount" },
        { status: 400 }
      );
    }

    // ✅ Razorpay instance
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // ✅ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: {
        orderId: order._id,
        clerkUserId: userId,
      },
    });

    console.log("✅ Razorpay Order Created:", razorpayOrder.id);

    // ✅ Return correct PUBLIC KEY
    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: keyId, // ✅ FIXED (No mismatch)
    });
  } catch (error: any) {
    console.error("❌ Razorpay Checkout Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Razorpay order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
