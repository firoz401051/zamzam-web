import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { client } from '@/sanity/lib/client';

// GET /api/admin/products/stats - Get product statistics
export async function GET() {
  try {
    const clerkUser = await currentUser();

if (!clerkUser) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const userEmail =
  clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();

const adminEmails = (
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || ""
)
  .split(",")
  .map((email) => email.trim().toLowerCase());

if (!userEmail || !adminEmails.includes(userEmail)) {
  return NextResponse.json(
    { error: "Admin access required" },
    { status: 403 }
  );
}

    const queries = {
      totalProducts: `count(*[_type == "product"])`,
      activeProducts: `count(*[_type == "product" && status == "active"])`,
      inactiveProducts: `count(*[_type == "product" && status == "inactive"])`,
      draftProducts: `count(*[_type == "product" && status == "draft"])`,
      lowStockProducts: `count(*[_type == "product" && stock <= 5])`,
      outOfStockProducts: `count(*[_type == "product" && stock == 0])`,
      featuredProducts: `count(*[_type == "product" && featured == true])`,
      totalValue: 0,
     // categoryDistribution: `*[_type == "product" && status == "active"] {
     //   "category": category->name
     // } | group(category) | {
     //   "name": _key,
     //   "count": count(_value)
    //  }`,
      recentProducts: `*[_type == "product"] | order(_createdAt desc) [0...5] {
        _id,
        name,
        price,
        stock,
        status,
        _createdAt
      }`
    };

    const results = await Promise.all(
  Object.entries(queries).map(async ([key, query]) => {
    if (typeof query === "string") {
      return [key, await client.fetch(query)];
    }

    return [key, query];
  })
);

    const stats = Object.fromEntries(results);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Product stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product statistics' },
      { status: 500 }
    );
  }
}