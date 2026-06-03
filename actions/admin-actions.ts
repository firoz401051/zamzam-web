'use server';

import { auth } from '@clerk/nextjs/server';
import { writeClient } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';
import { revalidatePath } from 'next/cache';

// Create employee action (admin only)
export async function createEmployee(employeeData: {
  firstName: string;
  lastName: string;
  email: string;
  employeeRole: string;
  department?: string;
  employeeId?: string;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const admin = await getUserByClerkId(userId);
    if (!admin || admin.employeeRole !== 'admin') {
      throw new Error('Only admins can create employees');
    }

    const result = await writeClient.create({
      _type: 'user',
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      isEmployee: true,
      employeeRole: employeeData.employeeRole,
      department: employeeData.department,
      employeeId: employeeData.employeeId,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: admin._id
    });

    revalidatePath('/employee/admin');
    
    return { success: true, employee: result };
  } catch (error) {
    console.error('Create employee action error:', error);
    throw new Error('Failed to create employee');
  }
}

// Update employee action (admin only)
export async function updateEmployee(
  employeeId: string, 
  updateData: {
    firstName?: string;
    lastName?: string;
    employeeRole?: string;
    department?: string;
    isActive?: boolean;
  }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const admin = await getUserByClerkId(userId);
    if (!admin || admin.employeeRole !== 'admin') {
      throw new Error('Only admins can update employees');
    }

    const result = await writeClient
      .patch(employeeId)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: admin._id
      })
      .commit();

    revalidatePath('/employee/admin');
    
    return { success: true, employee: result };
  } catch (error) {
    console.error('Update employee action error:', error);
    throw new Error('Failed to update employee');
  }
}

// Deactivate employee action (admin only)
export async function deactivateEmployee(employeeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const admin = await getUserByClerkId(userId);
    if (!admin || admin.employeeRole !== 'admin') {
      throw new Error('Only admins can deactivate employees');
    }

    const result = await writeClient
      .patch(employeeId)
      .set({
        isActive: false,
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: admin._id
      })
      .commit();

    revalidatePath('/employee/admin');
    
    return { success: true, employee: result };
  } catch (error) {
    console.error('Deactivate employee action error:', error);
    throw new Error('Failed to deactivate employee');
  }
}

// Get all employees action (admin only)
export async function getAllEmployees() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const admin = await getUserByClerkId(userId);
    if (!admin || admin.employeeRole !== 'admin') {
      throw new Error('Only admins can view all employees');
    }

    const employees = await writeClient.fetch(`
      *[_type == "user" && isEmployee == true] | order(_createdAt desc) {
        _id,
        firstName,
        lastName,
        email,
        employeeRole,
        employeeId,
        department,
        isActive,
        _createdAt,
        _updatedAt
      }
    `);

    return { success: true, employees };
  } catch (error) {
    console.error('Get all employees action error:', error);
    throw new Error('Failed to fetch employees');
  }
}

// Bulk assign orders action (admin only)
export async function bulkAssignOrders(orderIds: string[], employeeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const admin = await getUserByClerkId(userId);
    if (!admin || admin.employeeRole !== 'admin') {
      throw new Error('Only admins can bulk assign orders');
    }

    const updates = orderIds.map(orderId => ({
      patch: {
        id: orderId,
        set: {
          assignedTo: employeeId,
          assignedAt: new Date().toISOString(),
          assignedBy: admin._id
        }
      }
    }));

    const result = await writeClient.mutate(updates);

    revalidatePath('/employee/admin');
    
    return { success: true, updatedOrders: orderIds.length };
  } catch (error) {
    console.error('Bulk assign orders action error:', error);
    throw new Error('Failed to bulk assign orders');
  }
}

// Generate employee report action (admin only)
export async function generateEmployeeReport(
  startDate: string, 
  endDate: string, 
  employeeId?: string
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const admin = await getUserByClerkId(userId);
    if (!admin || admin.employeeRole !== 'admin') {
      throw new Error('Only admins can generate reports');
    }

    let query = `*[_type == "order" && _createdAt >= "${startDate}" && _createdAt <= "${endDate}"`;
    
    if (employeeId) {
      query += ` && assignedTo == "${employeeId}"`;
    }
    
    query += `] {
      _id,
      orderNumber,
      status,
      totalAmount,
      _createdAt,
      assignedTo->{
        firstName,
        lastName,
        employeeRole
      },
      updatedBy->{
        firstName,
        lastName,
        employeeRole
      }
    }`;

    const orders = await writeClient.fetch(query);

    // Calculate statistics
    const stats = {
      totalOrders: orders.length,
      completedOrders: orders.filter((o: any) => o.status === 'delivered').length,
      cancelledOrders: orders.filter((o: any) => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) / orders.length 
        : 0
    };

    return { 
      success: true, 
      report: {
        orders,
        stats,
        period: { startDate, endDate },
        generatedAt: new Date().toISOString(),
        generatedBy: admin._id
      }
    };
  } catch (error) {
    console.error('Generate employee report action error:', error);
    throw new Error('Failed to generate report');
  }
}