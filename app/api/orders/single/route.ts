import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    console.log("✅ Single Order API Called");

    // ✅ Clerk Auth
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Get orderNumber from URL
    const { searchParams } = new URL(req.url);

    let orderNumber = searchParams.get("orderNumber");

    // ✅ Safety Fix (Very Important)
    if (!orderNumber || orderNumber.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Missing orderNumber" },
        { status: 400 }
      );
    }

    orderNumber = orderNumber.trim();

    console.log("✅ Fetching order:", orderNumber);

    // ✅ GROQ Query
    const query = `
      *[
        _type == "order" &&
        orderNumber == $orderNumber &&
        clerkUserId == $userId
      ][0]{
        _id,
        orderNumber,
        totalPrice,
        status,
        paymentStatus,
        paymentMethod,
        orderDate,

        products[]{
          _key,
          quantity,
          product->{
            _id,
            name,
            price,
            images
          }
        },

        address
      }
    `;

    // ✅ Fetch order from Sanity
    const order = await backendClient.fetch(query, {
      orderNumber,
      userId,
    });

    // ✅ If not found
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Success Response
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Single Order API Error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
