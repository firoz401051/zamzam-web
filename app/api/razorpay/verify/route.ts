import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

/* ✅ USE SERVER CLIENT (NOT backendClient) */
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID missing" },
        { status: 400 }
      );
    }

    // ✅ Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid Signature" },
        { status: 400 }
      );
    }

    // ✅ Update Order in Sanity
    await serverClient
      .patch(orderId)
      .set({
        status: "confirmed",
        paymentStatus: "paid",

        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      })
      .commit();

    return NextResponse.json({
      success: true,
      message: "Payment Verified Successfully ✅",
    });
  } catch (error: any) {
    console.error("❌ Verify Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Verification failed",
      },
      { status: 500 }
    );
  }
}
