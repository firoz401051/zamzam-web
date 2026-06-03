// Business Intelligence API Route

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { BusinessIntelligenceService } from '@/lib/business-intelligence/analytics';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    const metric = searchParams.get('metric');

    // Map timeframe parameter to expected format
    const mapTimeframe = (tf: string) => {
      switch (tf) {
        case 'day': return '7d';
        case 'week': return '7d';
        case 'month': return '30d';
        case 'quarter': return '90d';
        case 'year': return '1y';
        default: return tf as '7d' | '30d' | '90d' | '1y';
      }
    };

    let data;

    switch (metric) {
      case 'revenue':
        data = await BusinessIntelligenceService.getRevenueAnalytics(
          mapTimeframe(timeframe)
        );
        break;
      
      case 'customers':
        data = await BusinessIntelligenceService.getCustomerSegmentation();
        break;
      
      case 'products':
        data = await BusinessIntelligenceService.getProductPerformance();
        break;
      
      case 'inventory':
        data = await BusinessIntelligenceService.getInventoryInsights();
        break;
      
      case 'forecast':
        const forecastDays = parseInt(searchParams.get('days') || '30');
        data = await BusinessIntelligenceService.getRevenueForecast(forecastDays);
        break;

      case 'overview':
        // Get all key metrics
        const [revenue, customers, products, inventory] = await Promise.all([
          BusinessIntelligenceService.getRevenueAnalytics(mapTimeframe(timeframe)),
          BusinessIntelligenceService.getCustomerSegmentation(),
          BusinessIntelligenceService.getProductPerformance(),
          BusinessIntelligenceService.getInventoryInsights(),
        ]);
        
        data = { revenue, customers, products, inventory };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid metric specified' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Business Intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business intelligence data' },
      { status: 500 }
    );
  }
}