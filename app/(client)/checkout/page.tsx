import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CheckoutSkeleton from "@/components/CheckoutSkeleton";
import { getOrderWithProducts } from "@/lib/server-orders";
import CheckoutContent from "@/components/checkout/CheckoutContent";

interface CheckoutPageProps {
  searchParams: Promise<{
    orderId?: string;
    orderNumber?: string;
  }>;
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { orderId, orderNumber } = await searchParams;

  if (!orderId || !orderNumber) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zamzam-background to-zamzam-surface py-8">
      <Container className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/user/orders/${orderNumber}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              View Order Details
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutPageContent
            orderId={orderId}
            orderNumber={orderNumber}
            user={user}
          />
        </Suspense>
      </Container>
    </div>
  );
};

// Server component that fetches order data
const CheckoutPageContent = async ({
  orderId,
  orderNumber,
  user,
}: {
  orderId: string;
  orderNumber: string;
  user: any;
}) => {
  try {
    const orderData = await getOrderWithProducts(orderId);

    if (!orderData) {
      redirect("/cart");
    }

    // Verify the order belongs to the current user
    const userEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;

    if (orderData.email !== userEmail) {
      redirect("/cart");
    }

    // Serialize the user data for client component
    const serializedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      primaryEmailAddress: user.primaryEmailAddress
        ? {
            emailAddress: user.primaryEmailAddress.emailAddress,
          }
        : null,
      emailAddresses:
        user.emailAddresses?.map((email: any) => ({
          emailAddress: email.emailAddress,
        })) || [],
    };

    // Serialize the order data for client component
    const serializedOrderData = {
      _id: orderData._id,
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      email: orderData.email,
      currency: orderData.currency,
      amountDiscount: orderData.amountDiscount,
      totalPrice: orderData.totalPrice,
      subtotal: orderData.subtotal,
      taxAmount: orderData.taxAmount,
      shippingCost: orderData.shippingCost,
      status: orderData.status,
      paymentStatus: orderData.paymentStatus,
      paymentMethod: orderData.paymentMethod,
      address: orderData.address,
      orderDate: orderData.orderDate,
      products:
        orderData.products?.map((item) => ({
          _key: item._key,
          quantity: item.quantity,
          product: item.product
            ? {
                _id: item.product._id,
                name: item.product.name,
                description:
                  typeof item.product.description === "string"
                    ? item.product.description
                    : Array.isArray(item.product.description)
                    ? item.product.description
                        .map(
                          (block) =>
                            block.children
                              ?.map((child: any) => child.text)
                              .join("") || ""
                        )
                        .join(" ")
                    : "",
                price: item.product.price,
                discount: item.product.discount,
                images: item.product.images,
                category: item.product.category,
              }
            : null,
        })) || [],
    };

    return (
      <CheckoutContent
        orderData={serializedOrderData}
        orderNumber={orderNumber}
        user={serializedUser}
      />
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    redirect("/cart");
  }
};

export default CheckoutPage;
