"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/image";
import useCartStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyCart from "@/components/EmptyCart";
import { motion, AnimatePresence } from "framer-motion";
import { Address } from "@/sanity.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CartAddressManager from "@/components/CartAddressManager";
import {
  CartPageSkeleton,
  CartItemSkeleton,
  OrderSummarySkeleton,
  AddressSelectionSkeleton,
} from "@/components/cart/CartSkeletons";
import { calculateProductPrice } from "@/lib/pricing-utils";
import OrderCreationLoader from "@/components/OrderCreationLoader";

const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getItemCount, resetCart } =
    useCartStore();

  const groupedItems = useCartStore((state) => state.getGroupedItems());

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // ✅ Client load fix
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      setIsInitialLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Skeleton during hydration
  if (!isClient || isInitialLoading) {
    return <CartPageSkeleton />;
  }

  // ✅ Checkout Handler (FINAL FIX)
  const handleCheckout = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in first");
      router.push("/sign-in");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select delivery address");
      return;
    }

    if (!user) {
      toast.error("User info missing");
      return;
    }

    // ✅ Freeze cart items BEFORE loading starts
    const frozenCartItems = groupedItems.map(({ product }) => ({
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
      },
      quantity: getItemCount(product._id),
    }));

    if (!frozenCartItems.length) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    setIsCreatingOrder(true);

    try {
      const toastId = toast.loading("Creating your order...");

      // ✅ Calculate totals
      const subtotal = frozenCartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const taxAmount = 0;
      const shippingCost = 0;
      const total = subtotal + taxAmount + shippingCost;

      // ✅ Create Order API Call
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: frozenCartItems,
          customerName:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          customerEmail:
            user.primaryEmailAddress?.emailAddress ||
            user.emailAddresses?.[0]?.emailAddress ||
            "",
          address: selectedAddress,
          subtotal,
          taxAmount,
          shippingCost,
          total,
          paymentMethod: "pending",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      toast.dismiss(toastId);

      const orderId = data.order._id;
      const orderNumber = data.order.orderNumber;

      toast.success("Order Created Successfully ✅");

      // ✅ Clear cart AFTER success
      resetCart();

      router.push(`/checkout?orderId=${orderId}&orderNumber=${orderNumber}`);
    } catch (err: any) {
      console.error("Checkout Error:", err);
      toast.error(err.message || "Something went wrong");

      setLoading(false);
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <Container>
        {groupedItems.length ? (
          <div className="grid lg:grid-cols-3 gap-8 py-10">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-5">
              <h1 className="text-3xl font-bold flex gap-2 items-center">
                <ShoppingBag />
                Shopping Cart
              </h1>

              <AnimatePresence>
                {loading &&
                  [...Array(2)].map((_, i) => (
                    <CartItemSkeleton key={i} index={i} />
                  ))}

                {!loading &&
                  groupedItems.map(({ product }) => {
                    const qty = getItemCount(product._id);
                    const { displayPrice } = calculateProductPrice(product);

                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card>
                          <CardContent className="p-5 flex gap-4">
                            <Image
                              src={urlFor(product.images?.[0]).url()}
                              alt={product.name}
                              width={90}
                              height={90}
                              className="rounded-lg border"
                            />

                            <div className="flex-1">
                              <h2 className="font-semibold">
                                {product.name}
                              </h2>
                              <p className="text-sm text-gray-500">
                                Qty: {qty}
                              </p>

                              <PriceFormatter
                                amount={displayPrice * qty}
                                className="font-bold text-lg"
                              />
                            </div>

                            <button
                              onClick={() => deleteCartProduct(product._id)}
                            >
                              <Trash className="text-red-500" />
                            </button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {loading ? (
                <AddressSelectionSkeleton />
              ) : (
                <CartAddressManager
                  selectedAddress={selectedAddress}
                  onAddressSelect={setSelectedAddress}
                />
              )}

              {loading ? (
                <OrderSummarySkeleton />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <PriceFormatter amount={getTotalPrice()} />
                    </div>

                    <Separator />

                    <Button
                      onClick={handleCheckout}
                      className="w-full"
                      disabled={!selectedAddress || loading}
                    >
                      Place Order
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!selectedAddress && (
                <div className="p-3 bg-orange-50 border rounded text-sm text-orange-600 flex gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Select address to continue
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </Container>

      {/* Loader Overlay */}
      {isCreatingOrder && <OrderCreationLoader isVisible />}
    </div>
  );
};

export default CartPage;
