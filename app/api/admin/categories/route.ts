import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client, writeClient } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Build query
    let query = '*[_type == "category"';
    const filters = [];

    if (search) {
      filters.push(`name match "${search}*"`);
    }

    if (status && status !== 'all') {
      filters.push(`status == "${status}"`);
    }

    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`;
    }

    query += `] | order(_createdAt desc) {
      _id,
      name,
      slug,
      description,
      image,
      parentCategory->{
        _id,
        name
      },
      status,
      "productCount": count(*[_type == "product" && category._ref == ^._id]),
      _createdAt,
      _updatedAt
    }`;

    const categories = await client.fetch(query);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const categoryData = await request.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if category with same name exists
    const existingCategory = await client.fetch(
      `*[_type == "category" && name == $name][0]`,
      { name: categoryData.name }
    );

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Create category
    const categoryDoc: any = {
      _type: 'category',
      name: categoryData.name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: categoryData.description || '',
      status: categoryData.status || 'active',
      createdBy: user._id,
      _createdAt: new Date().toISOString()
    };

    // Add parent category if specified
    if (categoryData.parentCategory) {
      categoryDoc.parentCategory = {
        _type: 'reference',
        _ref: categoryData.parentCategory
      };
    }

    // Add image if provided
    if (categoryData.image) {
      categoryDoc.image = categoryData.image;
    }

    const category = await writeClient.create(categoryDoc);

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Create category API error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}