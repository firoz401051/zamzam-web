"use client";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import PriceFormatter from "./PriceFormatter";
import { Order } from "@/sanity.types";
import OrderDetailsSheet from "./OrderDetailsSheet";
import { format } from "date-fns";
import { Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const OrdersComponent = ({ orders }: { orders: Order[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  return (
    <>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order?.orderNumber}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleOrderClick(order)}
          >
            {/* Order Number */}
            <TableCell className="font-medium">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  #{order.orderNumber?.slice(-8) ?? "N/A"}
                </span>
                <span className="text-xs text-gray-500 block sm:hidden">
                  {order?.orderDate &&
                    format(new Date(order.orderDate), "dd/MM/yyyy")}
                </span>
              </div>
            </TableCell>

            {/* Total */}
            <TableCell className="text-right">
              <PriceFormatter
                amount={order?.totalPrice}
                className="text-black font-semibold"
              />
            </TableCell>

            {/* Status */}
            <TableCell className="text-center">
              {order?.status && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order?.status.charAt(0).toUpperCase() +
                    order?.status.slice(1)}
                </span>
              )}
            </TableCell>

            {/* Invoice Number */}
            <TableCell className="hidden sm:table-cell text-center">
              {order?.invoice ? (
                <span className="text-sm font-mono text-gray-700">
                  {order?.invoice?.number}
                </span>
              ) : (
                <span className="text-xs text-gray-400">Not generated</span>
              )}
            </TableCell>

            {/* Action Buttons */}
            <TableCell
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderClick(order);
                  }}
                  className="h-8 text-xs px-2 w-full sm:w-auto"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Quick View</span>
                  <span className="sm:hidden">View</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs px-2 w-full sm:w-auto"
                >
                  <Link href={`/user/orders/${order.orderNumber}`}>
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Details
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
};

export default OrdersComponent;
