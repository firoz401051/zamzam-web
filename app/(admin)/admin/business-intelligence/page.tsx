"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendClient } from "@/sanity/lib/backendClient";
import PriceFormatter from "@/components/PriceFormatter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

interface OrderData {
  _id: string;
  totalPrice: number;
  _createdAt: string;
  status: string;
  products?: {
    product: {
      categories?: {
        title: string;
      }[];
    };
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const BusinessIntelligencePage = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "order"] | order(_createdAt asc) {
          _id,
          totalPrice,
          _createdAt,
          status,
          products[]{
            product->{
              categories[]->{
                title
              }
            }
          }
        }`;

        const orders: OrderData[] = await backendClient.fetch(query);

        // Process Revenue Over Time (Daily)
        const revenueMap = new Map<string, number>();
        let totalRev = 0;

        orders.forEach((order) => {
          if (order.status !== "cancelled" && order.status !== "refunded") {
             const date = new Date(order._createdAt).toLocaleDateString();
             revenueMap.set(date, (revenueMap.get(date) || 0) + (order.totalPrice || 0));
             totalRev += order.totalPrice || 0;
          }
        });
        
        setTotalRevenue(totalRev);

        const revenueChartData = Array.from(revenueMap.entries()).map(([date, amount]) => ({
          date,
          amount,
        }));
        setRevenueData(revenueChartData);

        // Process Category Sales
        const categoryMap = new Map<string, number>();
        orders.forEach((order) => {
            if (order.status !== "cancelled") {
              order.products?.forEach((item) => {
                 item.product?.categories?.forEach((cat) => {
                    categoryMap.set(cat.title, (categoryMap.get(cat.title) || 0) + 1);
                 });
              });
            }
        });

        const categoryChartData = Array.from(categoryMap.entries()).map(([name, value]) => ({
          name,
          value,
        }));
        setCategoryData(categoryChartData);


        // Process Order Status Distribution
        const statusMap = new Map<string, number>();
        orders.forEach((order) => {
            statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
        });
        
        const statusChartData = Array.from(statusMap.entries()).map(([name, value]) => ({
            name,
            value
        }));
        setStatusData(statusChartData);

      } catch (error) {
        console.error("Error fetching BI data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-gray-600 mt-2">
            Detailed insights into revenue, sales trends, and product performance.
          </p>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends (Daily)</CardTitle>
            <div className="text-sm text-gray-500">
               Total Revenue: <PriceFormatter amount={totalRevenue} className="font-bold text-lg text-green-600"/>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                     formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Category Distribution */}
           <Card>
            <CardHeader>
                <CardTitle>Sales by Category (Item Count)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
           </Card>

           {/* Order Status Distribution */}
           <Card>
            <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" name="Order Count" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
           </Card>
        </div>
      </div>
    </Container>
  );
};

export default BusinessIntelligencePage;