import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import {
  Calendar,
  CreditCard,
  Download,
  ExternalLink,
  MapPin,
  Package,
  User,
  Mail,
  Clock,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

interface OrderDetailsSheetProps {
  order: any; // Using any to handle extended order properties
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-zamzam-primary/10 text-zamzam-primary border-zamzam-primary/30";
      case "processing":
      case "confirmed":
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "cod_pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto p-0"
      >
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <SheetHeader className="px-6 py-5">
            <SheetTitle className="text-2xl font-bold text-zamzam-text-dark flex items-center gap-3">
              <div className="p-2 bg-zamzam-primary/10 rounded-lg">
                <Package className="w-6 h-6 text-zamzam-primary" />
              </div>
              <div className="flex-1">
                <div>Order #{order.orderNumber}</div>
                <p className="text-xs font-normal text-zamzam-text-medium mt-1">
                  Quick view of your order details
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge
              className={`${getStatusColor(
                order.status
              )} px-4 py-2 text-sm font-semibold border-2`}
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {order.status
                ? order.status.charAt(0).toUpperCase() +
                  order.status.slice(1).replace(/_/g, " ")
                : "Unknown"}
            </Badge>
            <Badge
              className={`${getPaymentStatusColor(
                order.paymentStatus
              )} px-4 py-2 text-sm font-semibold border-2`}
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              {order.paymentStatus === "cod_pending"
                ? "COD Pending"
                : order.paymentStatus?.charAt(0).toUpperCase() +
                  order.paymentStatus?.slice(1)}
            </Badge>
          </div>

          {/* Order Summary Info */}
          <div className="bg-zamzam-surface rounded-xl p-5 space-y-4 border border-gray-100">
            <h3 className="text-base font-bold flex items-center gap-2 text-zamzam-text-dark">
              <Package className="w-4 h-4 text-zamzam-primary" />
              Order Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-zamzam-primary/5 rounded-lg">
                  <Calendar className="w-4 h-4 text-zamzam-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zamzam-text-light font-medium mb-0.5">
                    Order Date
                  </p>
                  <p className="font-semibold text-zamzam-text-dark truncate">
                    {order.orderDate &&
                      new Date(order.orderDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </p>
                  <p className="text-xs text-zamzam-text-medium">
                    {order.orderDate &&
                      new Date(order.orderDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zamzam-text-light font-medium mb-0.5">
                    Customer
                  </p>
                  <p className="font-semibold text-zamzam-text-dark truncate">
                    {order.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zamzam-text-light font-medium mb-0.5">
                    Email
                  </p>
                  <p className="font-semibold text-zamzam-text-dark text-xs truncate">
                    {order.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zamzam-text-light font-medium mb-0.5">
                    Payment
                  </p>
                  <p className="font-semibold text-zamzam-text-dark truncate">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-zamzam-surface rounded-xl p-5 border border-gray-100">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4 text-zamzam-text-dark">
                <div className="p-2 bg-zamzam-primary/5 rounded-lg">
                  <MapPin className="w-4 h-4 text-zamzam-primary" />
                </div>
                Shipping Address
              </h3>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="font-semibold text-zamzam-text-dark mb-2">
                  {order.address.name}
                </p>
                <p className="text-sm text-zamzam-text-medium leading-relaxed">
                  {order.address.address}
                  <br />
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.zip}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-zamzam-text-dark flex items-center gap-2">
              <div className="p-2 bg-zamzam-primary/5 rounded-lg">
                <Package className="w-4 h-4 text-zamzam-primary" />
              </div>
              Order Items ({order.products?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.products?.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-zamzam-primary/30 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={urlFor(item.product.images[0])
                          .width(64)
                          .height(64)
                          .url()}
                        alt={item.product.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-zamzam-text-dark text-sm mb-1 truncate">
                      {item.product?.name || "Product"}
                    </h4>
                    <p className="text-xs text-zamzam-text-medium">
                      Quantity:{" "}
                      <span className="font-semibold">{item.quantity}</span>
                    </p>
                    {item.product?.category?.name && (
                      <p className="text-xs text-zamzam-text-light">
                        {item.product.category.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <PriceFormatter
                      amount={(item.product?.price ?? 0) * item.quantity}
                      className="font-bold text-zamzam-primary text-sm"
                    />
                    <p className="text-xs text-zamzam-text-medium mt-0.5">
                      <PriceFormatter amount={item.product?.price ?? 0} /> each
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-linear-to-r from-zamzam-primary/5 to-zamzam-primary/10 rounded-xl p-5 border-2 border-zamzam-primary/20">
            <h3 className="text-base font-bold mb-4 text-zamzam-text-dark">
              Order Total
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zamzam-text-medium">Subtotal</span>
                <PriceFormatter
                  amount={order.subtotal || order.totalPrice}
                  className="font-semibold text-zamzam-text-dark"
                />
              </div>

              {order.taxAmount && order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-zamzam-text-medium">Tax</span>
                  <PriceFormatter
                    amount={order.taxAmount}
                    className="font-semibold text-zamzam-text-dark"
                  />
                </div>
              )}

              {order.shippingCost && order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-zamzam-text-medium">Shipping</span>
                  <PriceFormatter
                    amount={order.shippingCost}
                    className="font-semibold text-zamzam-text-dark"
                  />
                </div>
              )}

              {order.amountDiscount && order.amountDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-zamzam-text-medium">Discount</span>
                  <PriceFormatter
                    amount={-order.amountDiscount}
                    className="font-semibold text-green-600"
                  />
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-zamzam-text-dark text-base">
                  Total
                </span>
                <PriceFormatter
                  amount={order.totalPrice || 0}
                  className="text-2xl font-bold text-zamzam-primary"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 sticky bottom-0 bg-white pt-4 pb-2">
            <Button
              variant="default"
              asChild
              className="w-full gap-2 h-12 text-base shadow-lg hover:shadow-xl transition-all"
            >
              <Link href={`/user/orders/${order.orderNumber}`}>
                <ExternalLink className="w-4 h-4" />
                View Full Details
              </Link>
            </Button>

            {order.invoice?.hosted_invoice_url && (
              <Button
                variant="outline"
                asChild
                className="w-full gap-2 h-12 text-base"
              >
                <Link href={order.invoice.hosted_invoice_url} target="_blank">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Link>
              </Button>
            )}
          </div>

          {/* Invoice Info */}
          {order.invoice?.number && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-zamzam-text-light mb-1">
                Invoice Number
              </p>
              <p className="font-mono font-semibold text-zamzam-text-dark">
                {order.invoice.number}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
