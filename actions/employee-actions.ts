'use server';

import { auth } from '@clerk/nextjs/server';
import { writeClient } from '@/sanity/lib/client';
import { getUserByClerkId, hasEmployeeAccess } from '@/lib/employee-utils';
import { revalidatePath } from 'next/cache';

// Update order status action
export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  notes?: string, 
  trackingNumber?: string
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || !hasEmployeeAccess(employee.employeeRole)) {
      throw new Error('Forbidden');
    }

    // Validate status changes based on employee role
    const allowedStatusUpdates: Record<string, string[]> = {
      packer: ['processing', 'packed'],
      deliveryman: ['shipped', 'out_for_delivery', 'delivered'],
      admin: ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      accounts: ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded']
    };

    if (!allowedStatusUpdates[employee.employeeRole]?.includes(status)) {
      throw new Error('Status update not allowed for your role');
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

    // Revalidate the employee dashboard
    revalidatePath('/employee');
    
    return { success: true, order: result };
  } catch (error) {
    console.error('Update order status action error:', error);
    throw new Error('Failed to update order status');
  }
}

// Assign order to employee action
export async function assignOrderToEmployee(orderId: string, employeeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || employee.employeeRole !== 'admin') {
      throw new Error('Only admins can assign orders');
    }

    const result = await writeClient
      .patch(orderId)
      .set({
        assignedTo: employeeId,
        assignedAt: new Date().toISOString(),
        assignedBy: employee._id
      })
      .commit();

    revalidatePath('/employee');
    
    return { success: true, order: result };
  } catch (error) {
    console.error('Assign order action error:', error);
    throw new Error('Failed to assign order');
  }
}

// Cancel order action (accounts and admin only)
export async function cancelOrder(orderId: string, reason: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || (employee.employeeRole !== 'admin' && employee.employeeRole !== 'accounts')) {
      throw new Error('Only admin and accounts can cancel orders');
    }

    const result = await writeClient
      .patch(orderId)
      .set({
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelledBy: employee._id,
        cancellationReason: reason
      })
      .commit();

    revalidatePath('/employee');
    
    return { success: true, order: result };
  } catch (error) {
    console.error('Cancel order action error:', error);
    throw new Error('Failed to cancel order');
  }
}

// Process refund action (accounts only)
export async function processRefund(orderId: string, amount: number, reason: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || employee.employeeRole !== 'accounts') {
      throw new Error('Only accounts can process refunds');
    }

    const result = await writeClient
      .patch(orderId)
      .set({
        status: 'refunded',
        refundedAt: new Date().toISOString(),
        refundedBy: employee._id,
        refundAmount: amount,
        refundReason: reason
      })
      .commit();

    revalidatePath('/employee');
    
    return { success: true, order: result };
  } catch (error) {
    console.error('Process refund action error:', error);
    throw new Error('Failed to process refund');
  }
}

// Add order notes action
export async function addOrderNotes(orderId: string, notes: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const employee = await getUserByClerkId(userId);
    if (!employee || !hasEmployeeAccess(employee.employeeRole)) {
      throw new Error('Forbidden');
    }

    const result = await writeClient
      .patch(orderId)
      .setIfMissing({ employeeNotes: [] })
      .append('employeeNotes', [{
        note: notes,
        addedBy: employee._id,
        addedAt: new Date().toISOString(),
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeRole: employee.employeeRole
      }])
      .commit();

    revalidatePath('/employee');
    
    return { success: true, order: result };
  } catch (error) {
    console.error('Add order notes action error:', error);
    throw new Error('Failed to add notes');
  }
}