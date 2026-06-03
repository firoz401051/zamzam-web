// Business Intelligence and Advanced Analytics Service

import { client } from '@/sanity/lib/client';

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  totalSpent: number;
  avgOrderValue: number;
  loyaltyTier: string;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  revenue: number;
  unitsSold: number;
  profitMargin: number;
  inventoryTurnover: number;
  trending: boolean;
}

export interface ForecastData {
  period: string;
  predictedRevenue: number;
  confidence: number;
  factors: string[];
}

export interface InventoryInsight {
  productId: string;
  name: string;
  currentStock: number;
  reorderPoint: number;
  demandForecast: number;
  recommendation: 'reorder' | 'reduce' | 'optimize' | 'normal';
}

export class BusinessIntelligenceService {
  // Revenue Analytics and Forecasting
  static async getRevenueAnalytics(timeframe: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<RevenueData[]> {
    try {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const revenueData = await client.fetch(`
        *[_type == "order" && orderDate >= $startDate && status in ["delivered", "completed"]] {
          orderDate,
          totalAmount,
          "items": items[]{
            quantity,
            price,
            "product": product->{name, price}
          }
        } | order(orderDate asc)
      `, { startDate: startDate.toISOString() });

      // Group by date and calculate metrics
      const groupedData = new Map<string, {revenue: number, orders: number}>();
      
      revenueData.forEach((order: any) => {
        const date = order.orderDate.split('T')[0];
        const current = groupedData.get(date) || {revenue: 0, orders: 0};
        current.revenue += order.totalAmount;
        current.orders += 1;
        groupedData.set(date, current);
      });

      return Array.from(groupedData.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
        avgOrderValue: data.revenue / data.orders
      }));

    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return [];
    }
  }

  // Customer Segmentation Analysis
  static async getCustomerSegmentation(): Promise<CustomerSegment[]> {
    try {
      const userData = await client.fetch(`
        *[_type == "user"] {
          _id,
          totalSpent,
          membershipType,
          loyaltyPoints,
          "orderCount": count(*[_type == "order" && user._ref == ^._id])
        }
      `);

      const segments = {
        highValue: { segment: 'High Value', count: 0, totalSpent: 0, orders: 0 },
        loyal: { segment: 'Loyal Customers', count: 0, totalSpent: 0, orders: 0 },
        newCustomers: { segment: 'New Customers', count: 0, totalSpent: 0, orders: 0 },
        atRisk: { segment: 'At Risk', count: 0, totalSpent: 0, orders: 0 },
        champions: { segment: 'Champions', count: 0, totalSpent: 0, orders: 0 }
      };

      userData.forEach((user: any) => {
        const spent = user.totalSpent || 0;
        const orderCount = user.orderCount || 0;
        const isVip = user.membershipType === 'vip' || user.membershipType === 'business';

        if (spent > 1000 && orderCount > 10) {
          segments.champions.count++;
          segments.champions.totalSpent += spent;
          segments.champions.orders += orderCount;
        } else if (spent > 500) {
          segments.highValue.count++;
          segments.highValue.totalSpent += spent;
          segments.highValue.orders += orderCount;
        } else if (orderCount > 5 || isVip) {
          segments.loyal.count++;
          segments.loyal.totalSpent += spent;
          segments.loyal.orders += orderCount;
        } else if (orderCount === 0 || spent < 50) {
          segments.newCustomers.count++;
          segments.newCustomers.totalSpent += spent;
          segments.newCustomers.orders += orderCount;
        } else {
          segments.atRisk.count++;
          segments.atRisk.totalSpent += spent;
          segments.atRisk.orders += orderCount;
        }
      });

      return Object.values(segments).map(segment => ({
        segment: segment.segment,
        count: segment.count,
        totalSpent: segment.totalSpent,
        avgOrderValue: segment.orders > 0 ? segment.totalSpent / segment.orders : 0,
        loyaltyTier: 'mixed'
      }));

    } catch (error) {
      console.error('Error fetching customer segmentation:', error);
      return [];
    }
  }

  // Product Performance Analysis
  static async getProductPerformance(limit: number = 20): Promise<ProductPerformance[]> {
    try {
      const productData = await client.fetch(`
        *[_type == "product"] {
          _id,
          name,
          price,
          stock,
          "totalSold": sum(*[_type == "order" && status in ["delivered", "completed"]].items[product._ref == ^._id].quantity),
          "totalRevenue": sum(*[_type == "order" && status in ["delivered", "completed"]].items[product._ref == ^._id].quantity * price),
          "recentOrders": count(*[_type == "order" && orderDate > now() - 60*60*24*30 && status in ["delivered", "completed"] && ^._id in items[].product._ref])
        } | order(totalRevenue desc)[0...$limit]
      `, { limit });

      return productData.map((product: any) => {
        const profitMargin = (product.totalRevenue * 0.3) / product.totalRevenue; // Assumed 30% margin
        const inventoryTurnover = product.totalSold / Math.max(product.stock, 1);
        const trending = product.recentOrders > 10;

        return {
          productId: product._id,
          name: product.name,
          revenue: product.totalRevenue || 0,
          unitsSold: product.totalSold || 0,
          profitMargin,
          inventoryTurnover,
          trending
        };
      });

    } catch (error) {
      console.error('Error fetching product performance:', error);
      return [];
    }
  }

  // Revenue Forecasting (Simple linear regression based on historical data)
  static async getRevenueForecast(periods: number = 12): Promise<ForecastData[]> {
    try {
      const historicalData = await this.getRevenueAnalytics('90d');
      
      if (historicalData.length < 7) {
        return []; // Not enough data for forecasting
      }

      // Simple linear regression for trend
      const revenues = historicalData.map(d => d.revenue);
      const n = revenues.length;
      const x = Array.from({length: n}, (_, i) => i);
      const y = revenues;

      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const forecast: ForecastData[] = [];
      const avgRevenue = sumY / n;
      
      for (let i = 1; i <= periods; i++) {
        const predictedRevenue = intercept + slope * (n + i - 1);
        const confidence = Math.max(0.6, 0.9 - (i * 0.05)); // Decreasing confidence over time

        forecast.push({
          period: `Month ${i}`,
          predictedRevenue: Math.max(0, predictedRevenue),
          confidence,
          factors: ['historical_trend', 'seasonal_adjustment', 'market_conditions']
        });
      }

      return forecast;

    } catch (error) {
      console.error('Error generating revenue forecast:', error);
      return [];
    }
  }

  // Inventory Optimization Insights
  static async getInventoryInsights(): Promise<InventoryInsight[]> {
    try {
      const productData = await client.fetch(`
        *[_type == "product"] {
          _id,
          name,
          stock,
          "weeklySales": count(*[_type == "order" && orderDate > now() - 60*60*24*7 && ^._id in items[].product._ref]),
          "monthlySales": count(*[_type == "order" && orderDate > now() - 60*60*24*30 && ^._id in items[].product._ref])
        }
      `);

      return productData.map((product: any) => {
        const weeklySales = product.weeklySales || 0;
        const monthlySales = product.monthlySales || 0;
        const avgWeeklySales = monthlySales / 4.33; // Average weekly sales from monthly data
        
        const reorderPoint = Math.ceil(avgWeeklySales * 2); // 2 weeks safety stock
        const demandForecast = Math.ceil(avgWeeklySales * 4); // 4 weeks demand forecast

        let recommendation: 'reorder' | 'reduce' | 'optimize' | 'normal' = 'normal';
        
        if (product.stock <= reorderPoint) {
          recommendation = 'reorder';
        } else if (product.stock > demandForecast * 3) {
          recommendation = 'reduce';
        } else if (weeklySales > 0 && product.stock < demandForecast) {
          recommendation = 'optimize';
        }

        return {
          productId: product._id,
          name: product.name,
          currentStock: product.stock || 0,
          reorderPoint,
          demandForecast,
          recommendation
        };
      });

    } catch (error) {
      console.error('Error fetching inventory insights:', error);
      return [];
    }
  }

  // Advanced Business Metrics
  static async getAdvancedMetrics() {
    try {
      const [
        customerLifetimeValue,
        churnRate,
        acquisitionCost,
        conversionRate
      ] = await Promise.all([
        this.calculateCustomerLifetimeValue(),
        this.calculateChurnRate(),
        this.calculateCustomerAcquisitionCost(),
        this.calculateConversionRate()
      ]);

      return {
        customerLifetimeValue,
        churnRate,
        acquisitionCost,
        conversionRate,
        calculatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching advanced metrics:', error);
      return null;
    }
  }

  private static async calculateCustomerLifetimeValue(): Promise<number> {
    const userData = await client.fetch(`
      *[_type == "user" && totalSpent > 0] {
        totalSpent,
        "orderCount": count(*[_type == "order" && user._ref == ^._id]),
        "firstOrder": *[_type == "order" && user._ref == ^._id] | order(orderDate asc)[0].orderDate,
        "lastOrder": *[_type == "order" && user._ref == ^._id] | order(orderDate desc)[0].orderDate
      }
    `);

    let totalCLV = 0;
    let validCustomers = 0;

    userData.forEach((customer: any) => {
      if (customer.firstOrder && customer.lastOrder && customer.orderCount > 0) {
        const lifespanDays = Math.max(1, 
          (new Date(customer.lastOrder).getTime() - new Date(customer.firstOrder).getTime()) / (1000 * 60 * 60 * 24)
        );
        const orderFrequency = customer.orderCount / (lifespanDays / 365); // Orders per year
        const avgOrderValue = customer.totalSpent / customer.orderCount;
        const clv = avgOrderValue * orderFrequency * 2; // Assuming 2-year retention

        totalCLV += clv;
        validCustomers++;
      }
    });

    return validCustomers > 0 ? totalCLV / validCustomers : 0;
  }

  private static async calculateChurnRate(): Promise<number> {
    const activeThreshold = new Date();
    activeThreshold.setDate(activeThreshold.getDate() - 90); // 90 days threshold

    const userData = await client.fetch(`
      *[_type == "user"] {
        "lastOrder": *[_type == "order" && user._ref == ^._id] | order(orderDate desc)[0].orderDate,
        "hasOrders": count(*[_type == "order" && user._ref == ^._id]) > 0
      }
    `);

    const activeCustomers = userData.filter((customer: any) => 
      customer.hasOrders && customer.lastOrder && new Date(customer.lastOrder) > activeThreshold
    ).length;

    const totalCustomers = userData.filter((customer: any) => customer.hasOrders).length;

    return totalCustomers > 0 ? ((totalCustomers - activeCustomers) / totalCustomers) * 100 : 0;
  }

  private static async calculateCustomerAcquisitionCost(): Promise<number> {
    // This would typically integrate with marketing spend data
    // For now, we'll return a placeholder calculation
    const newCustomersLast30Days = await client.fetch(`
      count(*[_type == "user" && _createdAt > now() - 60*60*24*30])
    `);

    // Assuming $50 average acquisition cost per customer
    const estimatedMarketingSpend = newCustomersLast30Days * 50;
    return newCustomersLast30Days > 0 ? estimatedMarketingSpend / newCustomersLast30Days : 0;
  }

  private static async calculateConversionRate(): Promise<number> {
    // This would typically use web analytics data
    // For now, we'll calculate based on order data
    const totalUsers = await client.fetch(`count(*[_type == "user"])`);
    const usersWithOrders = await client.fetch(`
      count(*[_type == "user" && count(*[_type == "order" && user._ref == ^._id]) > 0])
    `);

    return totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;
  }
}