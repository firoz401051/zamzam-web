import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    console.log("✅ COD Razorpay Route Called");

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId, orderNumber } = await req.json();

    if (!orderId || !orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order ID and Order Number required" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay keys not configured" },
        { status: 500 }
      );
    }

    const order = await backendClient.fetch(
      `*[_type=="order" && _id==$orderId][0]{
        _id,
        clerkUserId,
        totalPrice
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: 500 * 100,
      currency: "INR",
      receipt: `${orderNumber}-COD`,
      notes: {
        orderId: order._id,
        paymentType: "cod_advance",
      },
    });

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: keyId,
    });
  } catch (error: any) {
    console.error("❌ COD Checkout Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}