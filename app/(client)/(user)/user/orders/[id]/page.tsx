import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, CreditCard, MapPin, Package } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { urlFor } from "@/sanity/image";

/* ✅ IMPORTANT: Use backendClient (Server Side Only) */
import { backendClient } from "@/sanity/lib/backendClient";

import OrderTimeline from "@/components/OrderTimeline";
import OrderActions from "@/components/OrderActions";
import CompletePayment from "@/components/CompletePayment";

interface OrderPageProps {
  params: {
    id: string;
  };
}

/* ✅ FIXED ORDER FETCH */
async function getOrderByOrderNumber(orderNumber: string, userId: string) {
  try {
    const query = `
      *[
        _type == "order" &&
        orderNumber == $orderNumber &&
        clerkUserId == $userId
      ][0]{
        _id,
        orderNumber,
        customerName,
        email,
        totalPrice,
        subtotal,
        taxAmount,
        shippingCost,
        amountDiscount,
        status,
        paymentStatus,
        paymentMethod,
        address,
        orderDate,
        statusHistory,

        "products": products[]{
          _key,
          quantity,
          "product": product->{
            _id,
            name,
            price,
            images
          }
        }
      }
    `;

    // ✅ DEBUG (Very Important)
    console.log("✅ Fetch Order Params:", {
      orderNumber,
      userId,
    });

    // ✅ FORCE string (Fixes Sanity param missing issue)
    return await backendClient.fetch(query, {
      orderNumber: String(orderNumber),
      userId: String(userId),
    });
  } catch (error) {
    console.error("❌ Sanity Fetch Error:", error);
    return null;
  }
}

const OrderDetailsPage = async (props: OrderPageProps) => {
  const params = await props.params;
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  // ✅ SAFE FIX: params.id sometimes becomes undefined/array
  const orderNumber = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  if (!orderNumber) return notFound();

  const order = await getOrderByOrderNumber(orderNumber, userId);

  if (!order) return notFound();

  return (
    <Container>
      <div className="py-10 space-y-8">
        {/* ✅ HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/user/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        </div>

        {/* ✅ TIMELINE */}
        <OrderTimeline
          status={order.status}
          paymentStatus={order.paymentStatus}
          orderDate={order.orderDate}
          orderNumber={order.orderNumber}
          orderId={order._id}
          paymentMethod={order.paymentMethod}
          statusHistory={order.statusHistory}
        />

        {/* ✅ GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✅ LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* ✅ PRODUCTS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-zamzam-primary" />
                  Items Ordered
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {order.products?.map((item: any) => (
                  <div
                    key={item._key}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    {/* IMAGE */}
                    <div className="relative w-20 h-20">
                      {item.product.images?.[0] && (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* NAME + QTY */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* PRICE */}
                    <PriceFormatter
                      amount={item.product.price * item.quantity}
                      className="font-bold"
                    />
                  </div>
                ))}

                <Separator />

                {/* TOTAL */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <PriceFormatter
                    amount={order.totalPrice}
                    className="text-zamzam-primary text-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ✅ SHIPPING */}
            {order.address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="font-semibold">{order.address.name}</p>
                  <p className="text-gray-600">
                    {order.address.address}, {order.address.city}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ✅ RIGHT SIDE */}
          <div className="space-y-6">
            {/* ✅ PAYMENT */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Info</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="flex gap-2 items-center">
                  <CreditCard className="w-4 h-4" />
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment (Razorpay)"}
                </p>

                <p className="mt-2 font-bold">
                  Status: {order.paymentStatus}
                </p>
              </CardContent>
            </Card>

            {/* ✅ COMPLETE PAYMENT */}
            <CompletePayment order={order} />

            {/* ✅ ACTIONS */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderActions order={order} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderDetailsPage;
