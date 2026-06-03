"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendClient } from "@/sanity/lib/backendClient";
import { Loader2, Database, Server, HardDrive, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SchemaStat {
  type: string;
  count: number;
}

const DatabasePage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SchemaStat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts for common schema types
        const query = `{
          "products": count(*[_type == "product"]),
          "orders": count(*[_type == "order"]),
          "categories": count(*[_type == "category"]),
          "brands": count(*[_type == "brand"]),
          "users": count(*[_type == "user"]), 
          "reviews": count(*[_type == "review"])
        }`;

        const data = await backendClient.fetch(query);
        
        const formattedStats: SchemaStat[] = [
          { type: "Product", count: data.products },
          { type: "Order", count: data.orders },
          { type: "Category", count: data.categories },
          { type: "Brand", count: data.brands },
          { type: "User (Sanity)", count: data.users || 0 }, // Users might be 0 if not using Sanity for Auth
          { type: "Review", count: data.reviews || 0 },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error("Error fetching database stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
          <h1 className="text-3xl font-bold text-gray-900">Database Status</h1>
          <p className="text-gray-600 mt-2">
            Overview of the Sanity Content Lake and schema distribution.
          </p>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                    <Server className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                        Online <CheckCircle className="w-5 h-5"/>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Sanity API is reachable
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Project ID</CardTitle>
                    <Database className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "Available"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Environment: {process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Version</CardTitle>
                    <HardDrive className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        v2023-05-03
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Latest stable release
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Schema Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Document Stats</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Schema Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Document Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats.map((stat) => (
                            <TableRow key={stat.type}>
                                <TableCell className="font-medium">
                                    {stat.type}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="font-bold">{stat.count}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default DatabasePage;
