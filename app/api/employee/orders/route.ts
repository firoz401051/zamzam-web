import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { writeClient } from '@/sanity/lib/client';
import { getUserByClerkId, hasEmployeeAccess } from '@/lib/employee-utils';

// GET /api/employee/orders - Get orders by employee role
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
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query based on employee role
    let query = '*[_type == "order"';
    
    switch (employee.employeeRole) {
      case 'packer':
        query += ' && status in ["confirmed", "processing"]';
        break;
      case 'deliveryman':
        query += ' && status in ["shipped", "out_for_delivery"]';
        break;
      case 'admin':
      case 'accounts':
        // Admin and accounts can see all orders
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    if (status) {
      query += ` && status == "${status}"`;
    }

    query += `] | order(_createdAt desc) [${skip}...${skip + limit}] {
      _id,
      _createdAt,
      orderNumber,
      status,
      totalAmount,
      currency,
      customerInfo,
      shippingAddress,
      items[] {
        product->{
          _id,
          name,
          images[0],
          price,
          category->{name}
        },
        quantity,
        price
      },
      paymentStatus,
      trackingNumber,
      estimatedDelivery,
      notes
    }`;

    const orders = await writeClient.fetch(query);

    // Get total count for pagination
    let countQuery = '*[_type == "order"';
    if (employee.employeeRole === 'packer') {
      countQuery += ' && status in ["confirmed", "processing"]';
    } else if (employee.employeeRole === 'deliveryman') {
      countQuery += ' && status in ["shipped", "out_for_delivery"]';
    }
    if (status) {
      countQuery += ` && status == "${status}"`;
    }
    countQuery += '] | length';

    const totalCount = await writeClient.fetch(countQuery);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Employee orders API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PUT /api/employee/orders - Update order status
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || !hasEmployeeAccess(employee.employeeRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { orderId, status, notes, trackingNumber } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status changes based on employee role
    const allowedStatusUpdates: Record<string, string[]> = {
      packer: ['processing', 'packed'],
      deliveryman: ['shipped', 'out_for_delivery', 'delivered'],
      admin: ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      accounts: ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded']
    };

    if (!allowedStatusUpdates[employee.employeeRole]?.includes(status)) {
      return NextResponse.json(
        { error: 'Status update not allowed for your role' },
        { status: 403 }
      );
    }

    // Build update object
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: employee._id
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (trackingNumber && (employee.employeeRole === 'deliveryman' || employee.employeeRole === 'admin')) {
      updateData.trackingNumber = trackingNumber;
    }

    // Update estimated delivery for shipped orders
    if (status === 'shipped') {
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now
      updateData.estimatedDelivery = estimatedDelivery.toISOString();
    }

    const result = await writeClient
      .patch(orderId)
      .set(updateData)
      .commit();

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error('Employee order update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}