"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Lock, Calculator } from "lucide-react";
import PriceFormatter from "@/components/PriceFormatter";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { calculateProductPrice } from "@/lib/pricing-utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CheckoutContentProps {
  orderData: any;
  orderNumber: string;
  user: any;
}

const CheckoutContent = ({ orderData, orderNumber }: CheckoutContentProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const totals = {
    subtotal: orderData.subtotal || 0,
    taxAmount: orderData.taxAmount || 0,
    shippingCost: orderData.shippingCost || 0,
    total: orderData.totalPrice || 0,
  };

  const itemCount =
    orderData.products?.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    ) || 0;

  // ✅ Ensure Razorpay is Loaded before opening
  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ✅ Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    setLoading(true);

    try {
      // ✅ Step 0: Ensure Razorpay SDK Loaded
      const sdkLoaded = await loadRazorpay();

      if (!sdkLoaded) {
        toast.error("Razorpay SDK failed to load. Disable AdBlock or try again.");
        setLoading(false);
        return;
      }

      // ✅ Step 1: Create Razorpay Order
      const response = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData._id,
          orderNumber,
        }),
      });

      const data = await response.json();

console.log("Razorpay Key Received:", data.key);
console.log("Full Response:", data);



      if (!response.ok) {
        throw new Error(data.error || "Failed to create Razorpay order");
      }

      // ✅ Step 2: Popup Options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Zam Zam Fashion Store",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async function (paymentResponse: any) {
          // ✅ Step 3: Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...paymentResponse,
              orderId: orderData._id,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success("Payment Successful ✅");
            router.push(`/success?orderNumber=${orderNumber}`);
          } else {
            toast.error("Payment verification failed ❌");
          }
        },

        theme: {
          color: "#fa324d",
        },
      };

      // ✅ Step 4: Open Razorpay Popup Safely
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Razorpay Payment Error:", error);
      toast.error(error.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Order Items */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Items ({itemCount})</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {orderData.products?.map((item: any, index: number) => {
                const {
                  displayPrice,
                  originalPrice,
                  hasDiscount,
                  discountPercentage,
                } = calculateProductPrice(item.product);

                return (
                  <div
                    key={item._key || index}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product?.images?.[0] && (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm">
                        {item.product?.name}
                      </h4>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        <PriceFormatter
                          amount={displayPrice}
                          className="font-bold text-zamzam-primary"
                        />
                        {hasDiscount && (
                          <>
                            <PriceFormatter
                              amount={originalPrice}
                              className="text-xs text-gray-400 line-through"
                            />
                            <span className="text-xs bg-red-100 text-red-600 px-2 rounded">
                              -{discountPercentage}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Calculator className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total</span>
              <PriceFormatter amount={totals.total} />
            </div>

            <Separator />

            {/* Razorpay Payment */}
            <Button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full h-12 bg-zamzam-primary"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay with Razorpay
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <Lock className="inline w-3 h-3 mr-1" />
              Secure Razorpay Payment Gateway
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutContent;
