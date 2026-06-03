import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client, writeClient } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const product = await client.fetch(`
      *[_type == "product" && _id == $id][0] {
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
        _updatedAt,
        createdBy->{
          firstName,
          lastName
        }
      }
    `, { id: params.id });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/products/[id] - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const updateData = await request.json();

    // Build update object
    const updates: any = {
      _updatedAt: new Date().toISOString(),
      updatedBy: user._id
    };

    if (updateData.name) {
      updates.name = updateData.name;
      // Update slug if name changes
      updates.slug = {
        _type: 'slug',
        current: updateData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      };
    }

    if (updateData.description !== undefined) {
      updates.description = updateData.description;
    }

    if (updateData.price !== undefined) {
      updates.price = parseFloat(updateData.price);
    }

    if (updateData.salePrice !== undefined) {
      updates.salePrice = updateData.salePrice ? parseFloat(updateData.salePrice) : null;
    }

    if (updateData.category) {
      updates.category = {
        _type: 'reference',
        _ref: updateData.category
      };
    }

    if (updateData.images !== undefined) {
      updates.images = updateData.images;
    }

    if (updateData.stock !== undefined) {
      updates.stock = parseInt(updateData.stock);
    }

    if (updateData.status) {
      updates.status = updateData.status;
    }

    if (updateData.featured !== undefined) {
      updates.featured = updateData.featured;
    }

    const product = await writeClient
      .patch(params.id)
      .set(updates)
      .commit();

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product API error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if product exists
    const product = await client.fetch(`*[_type == "product" && _id == $id][0]`, { id: params.id });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is referenced in any orders
    const orders = await client.fetch(`*[_type == "order" && items[].product._ref == $id]`, { id: params.id });
    
    if (orders.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product that has been ordered. Consider marking it as inactive instead.' 
      }, { status: 400 });
    }

    await writeClient.delete(params.id);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}