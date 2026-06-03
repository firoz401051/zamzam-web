"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface PlaceOrderButtonProps {
  orderId: string;
  orderNumber: string;
  paymentMethod: "razorpay" | "cod";
  totalAmount: number;
}

const PlaceOrderButton = ({
  orderId,
  orderNumber,
  paymentMethod,
}: PlaceOrderButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      if (paymentMethod === "razorpay") {
        const res = await fetch("/api/razorpay/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, orderNumber }),
        });

        const data = await res.json();

        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: "INR",
          name: "Zam Zam Fashion Store",
          order_id: data.order.id,

          handler: async function (response: any) {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("Payment Successful ✅");
              router.push(`/success?orderNumber=${orderNumber}`);
            } else {
              toast.error("Verification failed ❌");
            }
          },
        };

        new (window as any).Razorpay(options).open();
      }

      if (paymentMethod === "cod") {
        await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "cod",
            paymentStatus: "pending",
            status: "confirmed",
          }),
        });

        toast.success("COD Order Confirmed ✅");
        router.push(`/user/orders/${orderNumber}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePlaceOrder}
      disabled={loading}
      className="w-full h-12"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </>
      ) : paymentMethod === "razorpay" ? (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Pay with Razorpay
        </>
      ) : (
        <>
          <Banknote className="w-4 h-4 mr-2" />
          Confirm COD
        </>
      )}
    </Button
