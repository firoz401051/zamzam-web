"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendClient } from "@/sanity/lib/backendClient";
import PriceFormatter from "@/components/PriceFormatter";
import { Loader2, Mail, ShoppingBag, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  _createdAt: string;
}

interface UserReport {
  email: string;
  name: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  firstOrderDate: string;
}

const UserReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<UserReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "order"] | order(_createdAt desc) {
          _id,
          orderNumber,
          customerName,
          email,
          totalPrice,
          _createdAt
        }`;

        const orders: OrderData[] = await backendClient.fetch(query);

        // Aggregate data by email
        const userMap = new Map<string, UserReport>();

        orders.forEach((order) => {
          if (!order.email) return;

          const existing = userMap.get(order.email);
          if (existing) {
            existing.totalOrders += 1;
            existing.totalSpend += order.totalPrice || 0;
            // Orders are sorted desc by date in query, so first encounter is latest
            // However, to be safe with iteration:
            if (new Date(order._createdAt) > new Date(existing.lastOrderDate)) {
               existing.lastOrderDate = order._createdAt;
            }
            if (new Date(order._createdAt) < new Date(existing.firstOrderDate)) {
                existing.firstOrderDate = order._createdAt;
            }
          } else {
            userMap.set(order.email, {
              email: order.email,
              name: order.customerName || "Unknown",
              totalOrders: 1,
              totalSpend: order.totalPrice || 0,
              lastOrderDate: order._createdAt,
              firstOrderDate: order._createdAt,
            });
          }
        });

        const reportData = Array.from(userMap.values());
        setReports(reportData);
        setFilteredReports(reportData);

      } catch (error) {
        console.error("Error fetching user reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
        setFilteredReports(reports);
    } else {
        const lowerQ = searchQuery.toLowerCase();
        setFilteredReports(
            reports.filter(
                (r) => 
                    r.email.toLowerCase().includes(lowerQ) || 
                    r.name.toLowerCase().includes(lowerQ)
            )
        );
    }
  }, [searchQuery, reports]);


  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-zamzam-primary" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col space-y-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">User Report</h1>
            <p className="text-gray-600 mt-2">
                Customer overview derived from order history.
            </p>
            </div>
            <div className="w-full md:w-72">
                <Input 
                    placeholder="Search by email or name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-center">Total Orders</TableHead>
                            <TableHead className="text-right">Total Spend</TableHead>
                            <TableHead className="text-right">Average Order Value</TableHead>
                            <TableHead className="text-right">Last Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.map((user) => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <Mail className="w-3 h-3 mr-1" />
                                            {user.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                       <ShoppingBag className="w-3 h-3"/>
                                       {user.totalOrders}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceFormatter amount={user.totalSpend} className="font-semibold text-gray-900" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceFormatter amount={user.totalSpend / user.totalOrders} className="text-gray-600" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end text-sm text-gray-500">
                                         <Calendar className="w-3 h-3 mr-1.5"/>
                                         {new Date(user.lastOrderDate).toLocaleDateString()}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredReports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No customers found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
             </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default UserReportsPage;
