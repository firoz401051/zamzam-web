import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { writeClient } from '@/sanity/lib/client';
import { getUserByClerkId, hasEmployeeAccess } from '@/lib/employee-utils';

// GET /api/employee/profile - Get employee profile
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || !hasEmployeeAccess(employee.employeeRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Return employee profile without sensitive data
    const profile = {
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      employeeRole: employee.employeeRole,
      employeeId: employee.employeeId,
      department: employee.department,
      isActive: employee.isActive
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Employee profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/employee/profile - Update employee profile
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

    const { firstName, lastName, department } = await request.json();

    // Validate input
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Update employee profile
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(department && { department: department.trim() }),
      updatedAt: new Date().toISOString()
    };

    const result = await writeClient
      .patch(employee._id)
      .set(updateData)
      .commit();

    return NextResponse.json({ 
      success: true, 
      profile: {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        employeeRole: result.employeeRole,
        employeeId: result.employeeId,
        department: result.department,
        isActive: result.isActive
      }
    });
  } catch (error) {
    console.error('Employee profile update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}