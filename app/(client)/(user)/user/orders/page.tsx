import OrdersComponent from "@/components/OrdersComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/sanity/helpers";
import { auth } from "@clerk/nextjs/server";
import { FileX, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const OrdersPage = async () => {
  const { userId } = await auth();

  // ✅ Redirect if user not logged in
  if (!userId) {
    return redirect("/");
  }

  // ✅ Fetch orders from Sanity
  const orders = await getMyOrders(userId);

  return (
    <div className="space-y-6">
      {/* ✅ Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zamzam-primary/10 rounded-lg">
            <Package className="w-5 h-5 text-zamzam-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-zamzam-text-dark">
              My Orders
            </h2>
            <p className="text-zamzam-text-medium">
              {orders?.length || 0}{" "}
              {orders?.length === 1 ? "order" : "orders"} in total
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Orders Found */}
      {orders?.length ? (
        <Card className="w-full shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl">Order History</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] sm:w-[150px]">
                      Order Number
                    </TableHead>

                    <TableHead className="text-right">Total</TableHead>

                    <TableHead className="text-center">Status</TableHead>

                    <TableHead className="hidden sm:table-cell text-center">
                      Payment Status
                    </TableHead>

                    <TableHead className="text-left w-[120px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {/* ✅ Orders Table Rows */}
                <OrdersComponent orders={orders} />
              </Table>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        /* ✅ No Orders Found */
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FileX className="h-16 w-16 text-gray-400" />
            </div>

            <h2 className="text-2xl font-semibold text-zamzam-text-dark mb-2">
              No orders found
            </h2>

            <p className="text-zamzam-text-medium text-center max-w-md mb-6">
              It looks like you haven&apos;t placed any orders yet.
              Start shopping to see your orders here!
            </p>

            <Button asChild size="lg" className="gap-2">
              <Link href="/products">
                <Package className="w-4 h-4" />
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;
