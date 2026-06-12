import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    console.log("✅ Order Create API Called");

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      items,
      total,
      subtotal,
      taxAmount,
      shippingCost,
      address,
      customerName,
      customerEmail,
      paymentMethod = "pending",
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderNumber = `SW-${Math.floor(
      100000 + Math.random() * 900000
    )}-${Date.now().toString().slice(-4)}`;

    const order = await backendClient.create({
      _type: "order",
      orderNumber,
      clerkUserId: userId,

      customerName: customerName || "Customer",
      email: customerEmail || "",

      subtotal: subtotal || 0,
      taxAmount: taxAmount || 0,
      shippingCost: shippingCost || 0,
      totalPrice: total || 0,

      paymentStatus: "pending",
      paymentMethod,

      status: "pending",
      orderDate: new Date().toISOString(),

      address: address || null,

      products: items.map((item: any) => ({
        _key: crypto.randomUUID(),
        quantity: item.quantity,
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
      })),
    });

    console.log("✅ Order Created:", orderNumber);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("❌ ORDER CREATE ERROR:", err);

    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
