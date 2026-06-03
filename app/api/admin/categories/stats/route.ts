import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';

// GET /api/admin/categories/stats - Get category statistics
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const queries = {
      totalCategories: `count(*[_type == "category"])`,
      activeCategories: `count(*[_type == "category" && status == "active"])`,
      inactiveCategories: `count(*[_type == "category" && status == "inactive"])`,
      totalProducts: `count(*[_type == "product"])`,
      categoriesWithProducts: `count(*[_type == "category" && count(*[_type == "product" && category._ref == ^._id]) > 0])`,
      topCategories: `*[_type == "category"] {
        _id,
        name,
        "productCount": count(*[_type == "product" && category._ref == ^._id])
      } | order(productCount desc) [0...5]`,
      recentCategories: `*[_type == "category"] | order(_createdAt desc) [0...5] {
        _id,
        name,
        status,
        _createdAt
      }`
    };

    const results = await Promise.all(
      Object.entries(queries).map(async ([key, query]) => [key, await client.fetch(query)])
    );

    const stats = Object.fromEntries(results);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Category stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category statistics' },
      { status: 500 }
    );
  }
}