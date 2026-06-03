import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client, writeClient } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';

// GET /api/admin/categories/[id] - Get single category
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

    const category = await client.fetch(`
      *[_type == "category" && _id == $id][0] {
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
        "products": *[_type == "product" && category._ref == ^._id] {
          _id,
          name,
          price,
          stock,
          status
        },
        _createdAt,
        _updatedAt,
        createdBy->{
          firstName,
          lastName
        }
      }
    `, { id: params.id });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Get category API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/categories/[id] - Update category
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
      // Check if another category with same name exists
      const existingCategory = await client.fetch(
        `*[_type == "category" && name == $name && _id != $id][0]`,
        { name: updateData.name, id: params.id }
      );

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        );
      }

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

    if (updateData.status) {
      updates.status = updateData.status;
    }

    if (updateData.parentCategory !== undefined) {
      if (updateData.parentCategory) {
        // Check for circular reference
        if (updateData.parentCategory === params.id) {
          return NextResponse.json(
            { error: 'Category cannot be its own parent' },
            { status: 400 }
          );
        }
        
        updates.parentCategory = {
          _type: 'reference',
          _ref: updateData.parentCategory
        };
      } else {
        updates.parentCategory = null;
      }
    }

    if (updateData.image !== undefined) {
      updates.image = updateData.image;
    }

    const category = await writeClient
      .patch(params.id)
      .set(updates)
      .commit();

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Update category API error:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete category
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

    // Check if category exists
    const category = await client.fetch(`*[_type == "category" && _id == $id][0]`, { id: params.id });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has products
    const products = await client.fetch(`*[_type == "product" && category._ref == $id]`, { id: params.id });
    
    if (products.length > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category with ${products.length} products. Move or delete products first.` 
      }, { status: 400 });
    }

    // Check if category has subcategories
    const subcategories = await client.fetch(`*[_type == "category" && parentCategory._ref == $id]`, { id: params.id });
    
    if (subcategories.length > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category with ${subcategories.length} subcategories. Move or delete subcategories first.` 
      }, { status: 400 });
    }

    await writeClient.delete(params.id);

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}