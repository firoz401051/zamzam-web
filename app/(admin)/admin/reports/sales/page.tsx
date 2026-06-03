"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendClient } from "@/sanity/lib/backendClient";
import PriceFormatter from "@/components/PriceFormatter";
import { Loader2, Search, Calendar, CreditCard, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SaleRecord {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  _createdAt: string;
  status: string;
  paymentMethod: string;
}

const ITEMS_PER_PAGE = 10;

const SalesReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        
        // Construct filter based on search
        let filter = `_type == "order"`;
        const params: any = {};
        
        if (searchQuery) {
           filter += ` && (orderNumber match $search || customerName match $search || email match $search)`;
           params.search = `*${searchQuery}*`; // Wildcard search
        }

        const query = `{
          "orders": *[${filter}] | order(_createdAt desc) [${start}...${end}] {
            _id,
            orderNumber,
            customerName,
            email,
            totalPrice,
            _createdAt,
            status,
            paymentMethod
          },
          "total": count(*[${filter}])
        }`;

        const result = await backendClient.fetch(query, params);
        setSales(result.orders);
        setTotalOrders(result.total);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid too many requests
    const timeoutId = setTimeout(() => {
        fetchOrders();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery]);
  
  // Reset to page 1 when search changes
  useEffect(() => {
      setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Container>
      <div className="flex flex-col space-y-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-gray-600 mt-2">
                Detailed transaction history and sales records.
            </p>
            </div>
            <div className="w-full md:w-72 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                    placeholder="Search order #, name, email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions ({totalOrders})</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-zamzam-primary" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : sales.length > 0 ? (
                            sales.map((sale) => (
                            <TableRow key={sale._id}>
                                <TableCell className="font-medium">
                                    {sale.orderNumber}
                                </TableCell>
                                <TableCell>
                                     <div className="flex items-center text-sm text-gray-500">
                                         <Calendar className="w-3 h-3 mr-1.5"/>
                                         {new Date(sale._createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-400 pl-4.5">
                                        {new Date(sale._createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <User className="w-3 h-3 mr-1.5 text-gray-400"/>
                                            <span className="text-sm font-medium">{sale.customerName}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 pl-4.5">
                                            {sale.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                   <div className="capitalize flex items-center gap-1.5">
                                      <CreditCard className="w-3 h-3 text-gray-500"/>
                                      {sale.paymentMethod || "N/A"}
                                   </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${getStatusColor(sale.status)} border-none`}>
                                        {sale.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceFormatter amount={sale.totalPrice} className="font-semibold text-gray-900" />
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No sales found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
             </div>

             {/* Pagination Controls */}
             <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || loading}
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0 || loading}
                    >
                        Next
                    </button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default SalesReportPage;
