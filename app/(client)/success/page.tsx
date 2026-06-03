"use client";

import useCartStore from "@/store";
import {
  Check,
  ShoppingBag,
  Truck,
  Copy,
  CheckCircle,
  Loader2,
  Box,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

interface OrderData {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  products: Array<{
    _key: string;
    quantity: number;
    product: {
      _id: string;
      name: string;
      price: number;
      images?: Array<any>;
    };
  }>;
}

export default function SuccessPage() {
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const clearCart = useCartStore((state) => state.resetCart);
  const { user } = useUser();

  // ✅ Clear cart once after success
  useEffect(() => {
    if (orderNumber) clearCart();
  }, [orderNumber, clearCart]);

  // ✅ Fetch Single Order Safely
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user?.id || !orderNumber) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Correct API endpoint
        const res = await fetch(
          `/api/orders/single?orderNumber=${orderNumber}`
        );

        // ✅ Safety check before parsing JSON
        const text = await res.text();

        if (!res.ok) {
          console.error("API Error:", text);
          throw new Error("Order fetch failed");
        }

        const result = JSON.parse(text);

        if (result.success) {
          setCurrentOrder(result.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, user?.id]);

  const copyOrderNumber = async () => {
    if (!orderNumber) return;
    await navigator.clipboard.writeText(orderNumber);

    setCopied(true);
    toast.success("Order number copied ✅");

    setTimeout(() => setCopied(false), 2000);
  };

  const getEstimatedDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-zamzam-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* ✅ Success Header */}
          <motion.div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold">Payment Successful ✅</h1>

            <div className="mt-5 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border">
              <span className="font-mono font-bold">{orderNumber}</span>

              <button onClick={copyOrderNumber}>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </motion.div>

          {/* ✅ Order Summary */}
          {currentOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <ShoppingBag className="w-5 h-5" />
                  Items Ordered
                </CardTitle>

                <CardDescription>
                  {currentOrder.products.length} items purchased
                </CardDescription>
              </CardHeader>

              <CardContent>
                {currentOrder.products.map((item) => (
                  <div key={item._key} className="flex gap-4 py-4 border-b">
                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                      {item.product.images?.[0] ? (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Box className="w-10 h-10 text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <PriceFormatter
                        amount={item.product.price * item.quantity}
                        className="font-bold"
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-6 flex justify-between font-bold text-xl">
                  <span>Total Paid:</span>
                  <PriceFormatter amount={currentOrder.totalPrice} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ✅ Delivery Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Truck className="w-5 h-5" />
                Estimated Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              Expected by:{" "}
              <span className="font-semibold">{getEstimatedDeliveryDate()}</span>
            </CardContent>
          </Card>

          {/* ✅ Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>

            {orderNumber && (
              <Button variant="outline" asChild>
                <Link href={`/user/orders/${orderNumber}`}>
                  View Order Details
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
