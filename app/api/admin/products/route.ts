import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { client, writeClient } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';

// GET /api/admin/products - List all products with filtering
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    // Build query
    let query = '*[_type == "product"';
    const filters = [];

    if (search) {
      filters.push(`name match "${search}*"`);
    }

    if (category && category !== 'all') {
      filters.push(`category._ref == "${category}"`);
    }

    if (status && status !== 'all') {
      filters.push(`status == "${status}"`);
    }

    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`;
    }

    query += `] | order(_createdAt desc) [${skip}...${skip + limit}] {
      _id,
      name,
      slug,
      description,
      price,
      salePrice,
      category->{
        _id,
        name
      },
      images,
      stock,
      status,
      featured,
      _createdAt,
      _updatedAt
    }`;

    const products = await client.fetch(query);

    // Get total count for pagination
let countQuery = '*[_type == "product"';

if (filters.length > 0) {
  countQuery += ` && (${filters.join(' && ')})`;
}

countQuery += ']';

const totalCount = await client.fetch(
  `count(${countQuery})`
);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
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

    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create product
    const product = await writeClient.create({
      _type: 'product',
      name: productData.name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: productData.description || '',
      price: parseFloat(productData.price),
      salePrice: productData.salePrice ? parseFloat(productData.salePrice) : undefined,
      category: {
        _type: 'reference',
        _ref: productData.category
      },
      images: productData.images || [],
      stock: parseInt(productData.stock) || 0,
      status: productData.status || 'draft',
      featured: productData.featured || false,
      createdBy: userEmail,
      _createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}