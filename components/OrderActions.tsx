"use client";

import { Button } from "@/components/ui/button";
import { Download, Package, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { urlFor } from "@/sanity/image";

interface OrderActionsProps {
  order: any; // Using any for simplicity here, but should ideally use the Order type
}

const OrderActions = ({ order }: OrderActionsProps) => {
  return (
    <div className="space-y-3">
      {order.invoice?.hosted_invoice_url && (
        <Button asChild className="w-full gap-2" size="lg" variant="outline">
          <Link href={order.invoice.hosted_invoice_url} target="_blank">
            <Download className="w-4 h-4" />
            Download Invoice
          </Link>
        </Button>
      )}

      <Button variant="outline" asChild className="w-full gap-2">
        <Link href="/user/orders">
          <Package className="w-4 h-4" />
          View All Orders
        </Link>
      </Button>

      <Button variant="outline" asChild className="w-full gap-2">
        <Link href="/products">
          <Truck className="w-4 h-4" />
          Continue Shopping
        </Link>
      </Button>
    </div>
  );
};

export default OrderActions;
