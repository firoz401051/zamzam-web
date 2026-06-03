"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import {
  CreditCard,
  Banknote,
  ArrowLeft,
  Lock,
  Calculator,
} from "lucide-react";
import PriceFormatter from "@/components/PriceFormatter";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { ServerOrder } from "@/lib/server-orders";
import { calculateProductPrice } from "@/lib/pricing-utils";

interface CheckoutClientProps {
  order: ServerOrder;
}

const CheckoutClient: React.FC<CheckoutClientProps> = ({ order }) => {
  const router = useRouter();
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
    "stripe"
  );
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!order) {
      toast.error("No order found. Please create order from cart first.");
      router.push("/cart");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "stripe") {
        // Create Stripe checkout session
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order._id,
            orderNumber: order.orderNumber,
            items: order.products.map((item) => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.images?.[0]
                ? urlFor(item.product.images[0]).url()
                : null,
            })),
            customer: {
              name: order.customerName,
              email: order.email,
            },
            address: order.address,
            totals: {
              subtotal: order.subtotal,
              taxAmount: order.taxAmount,
              shippingCost: order.shippingCost,
              total: order.totalPrice,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned");
        }
      } else {
        // Update order to COD payment method
        const response = await fetch(`/api/orders/${order._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "cod",
            paymentStatus: "pending",
            status: "confirmed",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update order for COD");
        }

        toast.success("Order confirmed! You'll pay cash on delivery.");
        router.push(`/user/orders/${order.orderNumber}`);
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error(
        error.message || "Failed to process payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const itemCount = order.products.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Order Summary */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "stripe" | "cod")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label
                  htmlFor="stripe"
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">
                      Secure payment with Stripe
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="cod" id="cod" />
                <Label
                  htmlFor="cod"
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <Banknote className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">
                      Pay when your order arrives
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.address.address}</p>
              <p className="text-sm text-gray-600">
                {order.address.city}, {order.address.state} {order.address.zip}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">
                Order Items ({itemCount})
              </p>
              {order.products.map((item) => (
                <div key={item._key} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                    {item.product.images && item.product.images[0] && (
                      <Image
                        src={urlFor(item.product.images[0])
                          .width(48)
                          .height(48)
                          .url()}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      <PriceFormatter
                        amount={
                          calculateProductPrice(item.product).displayPrice *
                          item.quantity
                        }
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <PriceFormatter amount={order.subtotal} />
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <PriceFormatter amount={order.shippingCost} />
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <PriceFormatter amount={order.taxAmount} />
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <PriceFormatter amount={order.totalPrice} />
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "stripe"
                ? "Proceed to Payment"
                : "Confirm Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutClient;
