import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client, writeClient } from '@/sanity/lib/client';
import { getUserByClerkId, hasEmployeeAccess } from '@/lib/employee-utils';

// GET /api/employee/notifications - Get employee notifications
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
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = `*[_type == "notification" && (targetRole == "${employee.employeeRole}" || targetRole == "all" || targetEmployee == "${employee._id}")`;
    
    if (unreadOnly) {
      query += ` && !("${employee._id}" in readBy[])`;
    }
    
    query += `] | order(_createdAt desc) [0...${limit}] {
      _id,
      title,
      message,
      type,
      priority,
      targetRole,
      targetEmployee,
      _createdAt,
      readBy,
      "isRead": "${employee._id}" in readBy[]
    }`;

    const notifications = await client.fetch(query);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Employee notifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/employee/notifications - Create notification (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || employee.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Only admins can create notifications' }, { status: 403 });
    }

    const { title, message, type, priority, targetRole, targetEmployee } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const notification = await writeClient.create({
      _type: 'notification',
      title,
      message,
      type: type || 'info',
      priority: priority || 'normal',
      targetRole: targetRole || 'all',
      targetEmployee,
      createdBy: employee._id,
      _createdAt: new Date().toISOString(),
      readBy: []
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Create notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT /api/employee/notifications/[id] - Mark notification as read
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

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const result = await writeClient
      .patch(notificationId)
      .setIfMissing({ readBy: [] })
      .append('readBy', [employee._id])
      .commit();

    return NextResponse.json({ success: true, notification: result });
  } catch (error) {
    console.error('Mark notification read API error:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}