import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '@/sanity/lib/client';
import { getUserByClerkId, hasEmployeeAccess } from '@/lib/employee-utils';

// GET /api/employee/stats - Get employee dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || !hasEmployeeAccess(employee.employeeRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    let stats: any = {};

    switch (employee.employeeRole) {
      case 'admin':
        stats = await getAdminStats(startDate);
        break;
      case 'packer':
        stats = await getPackerStats(startDate);
        break;
      case 'deliveryman':
        stats = await getDeliverymanStats(startDate);
        break;
      case 'accounts':
        stats = await getAccountsStats(startDate);
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Employee stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// Admin statistics
async function getAdminStats(startDate: Date) {
  const queries = {
    totalOrders: `count(*[_type == "order" && _createdAt >= "${startDate.toISOString()}"])`,
    pendingOrders: `count(*[_type == "order" && status == "pending"])`,
    processingOrders: `count(*[_type == "order" && status in ["confirmed", "processing"]])`,
    completedOrders: `count(*[_type == "order" && status == "delivered" && _createdAt >= "${startDate.toISOString()}"])`,
    totalRevenue: `sum(*[_type == "order" && status == "delivered" && _createdAt >= "${startDate.toISOString()}"].totalAmount)`,
    totalProducts: `count(*[_type == "product"])`,
    lowStockProducts: `count(*[_type == "product" && stock <= 10])`,
    totalCustomers: `count(*[_type == "user" && !isEmployee])`
  };

  const results = await Promise.all(
    Object.entries(queries).map(async ([key, query]) => [key, await client.fetch(query)])
  );

  return Object.fromEntries(results);
}

// Packer statistics
async function getPackerStats(startDate: Date) {
  const queries = {
    ordersToProcess: `count(*[_type == "order" && status in ["confirmed", "processing"]])`,
    ordersPackedToday: `count(*[_type == "order" && status == "packed" && _createdAt >= "${new Date().toISOString().split('T')[0]}"])`,
    ordersPackedPeriod: `count(*[_type == "order" && status == "packed" && _createdAt >= "${startDate.toISOString()}"])`,
    averagePackingTime: `avg(*[_type == "order" && status == "packed" && _createdAt >= "${startDate.toISOString()}"].packingTimeMinutes)`
  };

  const results = await Promise.all(
    Object.entries(queries).map(async ([key, query]) => [key, await client.fetch(query)])
  );

  return Object.fromEntries(results);
}

// Deliveryman statistics
async function getDeliverymanStats(startDate: Date) {
  const queries = {
    ordersToDeliver: `count(*[_type == "order" && status in ["shipped", "out_for_delivery"]])`,
    ordersDeliveredToday: `count(*[_type == "order" && status == "delivered" && _createdAt >= "${new Date().toISOString().split('T')[0]}"])`,
    ordersDeliveredPeriod: `count(*[_type == "order" && status == "delivered" && _createdAt >= "${startDate.toISOString()}"])`,
    averageDeliveryTime: `avg(*[_type == "order" && status == "delivered" && _createdAt >= "${startDate.toISOString()}"].deliveryTimeHours)`
  };

  const results = await Promise.all(
    Object.entries(queries).map(async ([key, query]) => [key, await client.fetch(query)])
  );

  return Object.fromEntries(results);
}

// Accounts statistics
async function getAccountsStats(startDate: Date) {
  const queries = {
    totalRevenue: `sum(*[_type == "order" && status == "delivered" && _createdAt >= "${startDate.toISOString()}"].totalAmount)`,
    pendingPayments: `sum(*[_type == "order" && paymentStatus == "pending"].totalAmount)`,
    refundedAmount: `sum(*[_type == "order" && status == "refunded" && _createdAt >= "${startDate.toISOString()}"].totalAmount)`,
    ordersToProcess: `count(*[_type == "order" && paymentStatus == "pending"])`,
    weeklyRevenue: `*[_type == "order" && status == "delivered" && _createdAt >= "${startDate.toISOString()}"] | order(_createdAt asc) {
      _createdAt,
      totalAmount,
      "day": dateTime(_createdAt).day
    }`
  };

  const results = await Promise.all(
    Object.entries(queries).map(async ([key, query]) => [key, await client.fetch(query)])
  );

  const stats = Object.fromEntries(results);

  // Process weekly revenue for chart
  if (stats.weeklyRevenue) {
    const weeklyData = processWeeklyRevenue(stats.weeklyRevenue);
    stats.weeklyRevenueChart = weeklyData;
  }

  return stats;
}

// Process weekly revenue data for charts
function processWeeklyRevenue(orders: any[]) {
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: 0,
      orders: 0
    };
  });

  orders.forEach(order => {
    const orderDate = new Date(order._createdAt);
    const dayIndex = Math.floor((orderDate.getTime() - new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getTime()) / (24 * 60 * 60 * 1000));
    
    if (dayIndex >= 0 && dayIndex < 7) {
      weekData[dayIndex].revenue += order.totalAmount || 0;
      weekData[dayIndex].orders += 1;
    }
  });

  return weekData;
}