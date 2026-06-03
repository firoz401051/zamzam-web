"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Clock,
  Package,
  Truck,
  Home,
  X,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface OrderTimelineProps {
  status: string;
  paymentStatus?: string;
  orderDate: string;
  orderNumber?: string;
  orderId?: string;
  paymentMethod?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
  }>;
}

const OrderTimeline = ({
  status,
  paymentStatus,
  orderDate,
  orderNumber,
  orderId,
  paymentMethod,
  statusHistory,
}: OrderTimelineProps) => {
  const [loading, setLoading] = useState(false);
  // Helper to get timestamp for a specific status
  const getStatusTimestamp = (statusId: string) => {
    if (statusId === "pending") return orderDate;

    // If we have status history, find the timestamp
    if (statusHistory) {
      const historyItem = statusHistory.find(
        (h) => h.status.toLowerCase() === statusId.toLowerCase()
      );
      if (historyItem) return historyItem.timestamp;
    }

    return null;
  };

  const getOrderTimeline = () => {
    const timeline = [
      {
        id: "pending",
        label: "Order Placed",
        icon: Clock,
        date: getStatusTimestamp("pending"),
        description: "Order has been received",
      },
      {
        id: "confirmed",
        label: "Order Confirmed",
        icon: Check,
        date: getStatusTimestamp("confirmed"),
        description: "We've confirmed your order",
      },
      {
        id: "processing",
        label: "Processing",
        icon: Package,
        date: getStatusTimestamp("processing"),
        description: "Your order is being prepared",
      },
      {
        id: "shipped",
        label: "Shipped",
        icon: Truck,
        date: getStatusTimestamp("shipped"),
        description: "Package is on the way",
      },
      {
        id: "out_for_delivery",
        label: "Out for Delivery",
        icon: Truck,
        date: getStatusTimestamp("out_for_delivery"),
        description: "Delivery in progress",
      },
      {
        id: "delivered",
        label: "Delivered",
        icon: Home,
        date: getStatusTimestamp("delivered"),
        description: "Order delivered successfully",
      },
    ];

    // Handle cancelled status
    if (status === "cancelled") {
      return [
        {
          id: "pending",
          label: "Order Placed",
          icon: Clock,
          date: orderDate,
          completed: true,
        },
        {
          id: "cancelled",
          label: "Order Cancelled",
          icon: X,
          date: null,
          completed: true,
          cancelled: true,
        },
      ];
    }

    // Map status to timeline
    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    const currentStatusIndex = statusOrder.indexOf(
      status?.toLowerCase() || "pending"
    );

    return timeline.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      current: index === currentStatusIndex,
    }));

  };

  const handlePayNow = async () => {
    if (!orderId || !orderNumber) {
      toast.error("Order information missing");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          orderNumber: orderNumber,
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
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error(
        error.message || "Failed to initiate payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const timelineSteps = getOrderTimeline();

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="bg-linear-to-r from-zamzam-primary/5 to-zamzam-primary/10 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-zamzam-text-dark">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Package className="w-5 h-5 text-zamzam-primary" />
          </div>
          <div>
            <div className="text-lg font-bold">Order Status Timeline</div>
            <div className="text-xs font-normal text-zamzam-text-medium mt-0.5">
              Track your order progress
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 pb-6">
        {/* Horizontal Timeline for Desktop */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  timelineSteps.some((s: any) => s.cancelled)
                    ? "bg-red-500"
                    : "bg-linear-to-r from-green-500 to-zamzam-primary"
                )}
                style={{
                  width: `${
                    (timelineSteps.filter((s: any) => s.completed).length /
                      timelineSteps.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* Timeline Steps */}
            <div className="relative flex justify-between">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                const isCancelled = (step as any).cancelled;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center"
                    style={{ width: `${100 / timelineSteps.length}%` }}
                  >
                    {/* Icon Circle */}
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white transition-all duration-300 shadow-md",
                        (step as any).completed
                          ? isCancelled
                            ? "border-red-500 shadow-red-200"
                            : (step as any).current
                            ? "border-green-500 shadow-green-200 ring-4 ring-green-100"
                            : step.id === "pending"
                            ? "border-zamzam-primary shadow-zamzam-primary/30 ring-4 ring-zamzam-primary/20"
                            : "border-green-500 shadow-green-100"
                          : (step as any).current
                          ? "border-zamzam-primary animate-pulse shadow-zamzam-primary/30 ring-4 ring-zamzam-primary/20"
                          : "border-gray-300"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-all",
                          (step as any).completed
                            ? isCancelled
                              ? "text-red-500"
                              : step.id === "pending"
                              ? "text-zamzam-primary"
                              : "text-green-500"
                            : (step as any).current
                            ? "text-zamzam-primary"
                            : "text-gray-400"
                        )}
                      />
                      {(step as any).current && !isCancelled && (
                        <div className="absolute -inset-1 bg-zamzam-primary/20 rounded-full animate-ping" />
                      )}
                      {step.id === "pending" && (step as any).completed && (
                        <div className="absolute -inset-1 bg-zamzam-primary/10 rounded-full" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="mt-3 text-center">
                      <div
                        className={cn(
                          "text-sm font-semibold mb-1",
                          (step as any).completed
                            ? isCancelled
                              ? "text-red-600"
                              : (step as any).current
                              ? "text-green-600"
                              : step.id === "pending"
                              ? "text-zamzam-primary font-bold"
                              : "text-green-600"
                            : (step as any).current
                            ? "text-zamzam-primary"
                            : "text-gray-500"
                        )}
                      >
                        {step.label}
                      </div>
                      {step.date && (
                        <div
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded border inline-block mb-1",
                            step.id === "pending" && (step as any).completed
                              ? "text-zamzam-primary bg-zamzam-primary/10 border-zamzam-primary/30 font-semibold"
                              : "text-zamzam-text-dark bg-white border-gray-200"
                          )}
                        >
                          {new Date(step.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                      <div
                        className={cn(
                          "text-xs mt-1 px-2 py-1 rounded",
                          (step as any).completed
                            ? isCancelled
                              ? "text-red-600 bg-red-50"
                              : (step as any).current
                              ? "text-green-700 bg-green-50 font-medium"
                              : step.id === "pending"
                              ? "text-zamzam-primary bg-zamzam-primary/10 font-semibold"
                              : "text-green-600 bg-green-50/50"
                            : (step as any).current
                            ? "text-zamzam-primary bg-zamzam-primary/10 font-medium animate-pulse"
                            : "text-gray-500"
                        )}
                      >
                        {(step as any).completed
                          ? isCancelled
                            ? "Cancelled"
                            : (step as any).current
                            ? "✓ Just Completed"
                            : "✓ Done"
                          : (step as any).current
                          ? "● In Progress"
                          : "Pending"}
                      </div>
                      {(step as any).current && (step as any).description && (
                        <p className="text-xs text-zamzam-text-medium mt-1">
                          {(step as any).description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vertical Timeline for Mobile */}
        <div className="md:hidden relative">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === timelineSteps.length - 1;
            const isCancelled = (step as any).cancelled;

            return (
              <div key={step.id} className="relative pb-8 last:pb-0">
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-5 top-12 w-1 h-full -ml-px rounded-full",
                      (step as any).completed
                        ? isCancelled
                          ? "bg-red-300"
                          : "bg-linear-to-b from-green-500 to-zamzam-primary"
                        : "bg-gray-200"
                    )}
                  />
                )}

                {/* Timeline Item */}
                <div
                  className={cn(
                    "relative flex items-start gap-4 transition-all duration-300",
                    (step as any).current &&
                      "bg-zamzam-primary/5 -mx-4 px-4 py-3 rounded-lg border-l-4 border-zamzam-primary"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 bg-white transition-all shadow-sm z-10 relative",
                      (step as any).completed
                        ? isCancelled
                          ? "border-red-500 shadow-red-200"
                          : (step as any).current
                          ? "border-green-500 shadow-green-200"
                          : step.id === "pending"
                          ? "border-zamzam-primary shadow-zamzam-primary/30"
                          : "border-green-500"
                        : (step as any).current
                        ? "border-zamzam-primary animate-pulse shadow-zamzam-primary/30"
                        : "border-gray-300"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        (step as any).completed
                          ? isCancelled
                            ? "text-red-500"
                            : step.id === "pending"
                            ? "text-zamzam-primary"
                            : "text-green-500"
                          : (step as any).current
                          ? "text-zamzam-primary"
                          : "text-gray-400"
                      )}
                    />
                    {(step as any).current && !isCancelled && (
                      <div className="absolute -inset-1 bg-zamzam-primary/20 rounded-full animate-ping" />
                    )}
                    {step.id === "pending" && (step as any).completed && (
                      <div className="absolute -inset-1 bg-zamzam-primary/10 rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={cn(
                          "font-semibold text-sm",
                          (step as any).completed
                            ? isCancelled
                              ? "text-red-600"
                              : (step as any).current
                              ? "text-green-600"
                              : step.id === "pending"
                              ? "text-zamzam-primary font-bold"
                              : "text-green-600"
                            : (step as any).current
                            ? "text-zamzam-primary"
                            : "text-gray-500"
                        )}
                      >
                        {step.label}
                        {(step as any).current && (
                          <span className="ml-2 text-xs bg-zamzam-primary/10 text-zamzam-primary px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </h4>
                      {step.date && (
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-1 rounded border",
                            step.id === "pending" && (step as any).completed
                              ? "text-zamzam-primary bg-zamzam-primary/10 border-zamzam-primary/30"
                              : "text-zamzam-text-dark bg-white border-gray-200"
                          )}
                        >
                          {new Date(step.date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        (step as any).completed
                          ? isCancelled
                            ? "text-red-600"
                            : (step as any).current
                            ? "text-green-700 font-medium"
                            : step.id === "pending"
                            ? "text-zamzam-primary font-semibold"
                            : "text-green-600"
                          : (step as any).current
                          ? "text-zamzam-primary font-medium"
                          : "text-gray-500"
                      )}
                    >
                      {(step as any).completed
                        ? isCancelled
                          ? "This order has been cancelled"
                          : (step as any).current
                          ? `✓ ${(step as any).description || "Just completed"}`
                          : "✓ Completed"
                        : (step as any).current
                        ? `● ${
                            (step as any).description || "Currently in progress"
                          }`
                        : "Waiting to start"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Status */}
        {paymentStatus && (
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            {/* Payment Info */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 transition-all",
                paymentStatus === "paid"
                  ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-200"
                  : paymentStatus === "cod_pending"
                  ? "bg-linear-to-r from-orange-50 to-amber-50 border-orange-200"
                  : paymentStatus === "pending"
                  ? "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200"
                  : "bg-linear-to-r from-red-50 to-rose-50 border-red-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg shadow-sm",
                    paymentStatus === "paid"
                      ? "bg-green-100"
                      : paymentStatus === "cod_pending"
                      ? "bg-orange-100"
                      : paymentStatus === "pending"
                      ? "bg-blue-100"
                      : "bg-red-100"
                  )}
                >
                  <CreditCard
                    className={cn(
                      "w-5 h-5",
                      paymentStatus === "paid"
                        ? "text-green-600"
                        : paymentStatus === "cod_pending"
                        ? "text-orange-600"
                        : paymentStatus === "pending"
                        ? "text-blue-600"
                        : "text-red-600"
                    )}
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-zamzam-text-dark block">
                    Payment Status
                  </span>
                  <span className="text-xs text-zamzam-text-medium">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold shadow-sm",
                  paymentStatus === "paid"
                    ? "bg-green-600 text-white"
                    : paymentStatus === "cod_pending"
                    ? "bg-orange-500 text-white"
                    : paymentStatus === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-red-500 text-white"
                )}
              >
                {paymentStatus === "cod_pending"
                  ? "COD - Pay on Delivery"
                  : paymentStatus === "pending"
                  ? "Payment Pending"
                  : paymentStatus.charAt(0).toUpperCase() +
                    paymentStatus.slice(1)}
              </span>
            </div>

            {/* Pay Now Button - Show if payment is pending and order is not delivered */}
            {(paymentStatus === "pending" || paymentStatus === "cod_pending") &&
              status.toLowerCase() !== "delivered" &&
              status.toLowerCase() !== "cancelled" &&
              paymentMethod !== "cod" && (
                <div className="p-4 bg-linear-to-r from-zamzam-primary/5 to-zamzam-primary/10 border-2 border-zamzam-primary/30 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-1.5 bg-zamzam-primary/20 rounded-full mt-0.5">
                      <svg
                        className="w-4 h-4 text-zamzam-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-zamzam-text-dark text-sm mb-1">
                        Complete Your Payment
                      </h4>
                      <p className="text-xs text-zamzam-text-medium mb-3">
                        Your order is confirmed but payment is pending. Complete
                        payment to avoid any delays in processing.
                      </p>
                      <Button
                        onClick={handlePayNow}
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center h-auto"
                      >
                        <CreditCard className="w-4 h-4" />
                        {loading ? "Processing..." : "Pay Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            {/* COD Payment Info */}
            {paymentStatus === "cod_pending" &&
              status.toLowerCase() !== "cancelled" && (
                <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-orange-100 rounded-full mt-0.5">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 text-sm mb-1">
                        Cash on Delivery Selected
                      </h4>
                      <p className="text-xs text-orange-800">
                        {status.toLowerCase() === "delivered"
                          ? "Payment should be collected by delivery person upon delivery."
                          : "Please keep the exact amount ready. You can pay the delivery person when your order arrives."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTimeline;
