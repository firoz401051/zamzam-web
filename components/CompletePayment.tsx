"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CompletePaymentProps {
  order: any;
}

const CompletePayment = ({ order }: CompletePaymentProps) => {
  const [loading, setLoading] = useState(false);

  if (order.paymentStatus !== "pending") return null;

  const handlePayNow = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          orderNumber: order.orderNumber,
        }),
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
              orderId: order._id,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success("Payment Completed ✅");
            window.location.reload();
          } else {
            toast.error("Verification failed ❌");
          }
        },
      };

      new (window as any).Razorpay(options).open();
    } catch (err: any) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-zamzam-primary/20">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <CreditCard />
          Complete Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handlePayNow} disabled={loading} className="w-full">
          {loading ? "Processing..." : "Pay Now with Razorpay"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompletePayment;
