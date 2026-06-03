"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RevenueChart() {
  // In a real app, this would use a charting library like Recharts or Chart.js
  const mockData = [
    { day: "Mon", revenue: 2400 },
    { day: "Tue", revenue: 1398 },
    { day: "Wed", revenue: 3800 },
    { day: "Thu", revenue: 3908 },
    { day: "Fri", revenue: 4800 },
    { day: "Sat", revenue: 3200 },
    { day: "Sun", revenue: 2800 },
  ];

  const maxRevenue = Math.max(...mockData.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.map((data, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 text-sm font-medium text-gray-600">
                {data.day}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(data.revenue / maxRevenue) * 100}%` 
                  }}
                />
              </div>
              <div className="w-20 text-sm font-medium text-gray-900 text-right">
                ${data.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Week:</span>
            <span className="font-medium">
              ${mockData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Average Daily:</span>
            <span className="font-medium">
              ${Math.round(mockData.reduce((sum, d) => sum + d.revenue, 0) / mockData.length).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}