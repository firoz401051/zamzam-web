'use server';

import { auth } from '@clerk/nextjs/server';
import { client } from '@/sanity/lib/client';
import { getUserByClerkId } from '@/lib/employee-utils';
import {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendOrderDeliveredEmail,
  sendEmployeeNotificationEmail,
  queueOrderConfirmationEmail,
  queueShippingNotificationEmail,
  type OrderConfirmationData,
  type ShippingNotificationData,
  type OrderDeliveredData,
  type EmployeeNotificationData,
} from '@/lib/email';

// Send order confirmation email action
export async function sendOrderConfirmationAction(orderId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await getUserByClerkId(userId);
    if (!user || !['admin', 'accounts', 'packer'].includes(user.employeeRole)) {
      throw new Error('Insufficient permissions');
    }

    // Fetch order details
    const order = await client.fetch(`
      *[_type == "order" && _id == $orderId][0] {
        _id,
        orderNumber,
        totalAmount,
        currency,
        _createdAt,
        customerInfo,
        shippingAddress,
        items[] {
          product->{
            name,
            price
          },
          quantity,
          price
        }
      }
    `, { orderId });

    if (!order) {
      throw new Error('Order not found');
    }

    const emailData: OrderConfirmationData = {
      customerEmail: order.customerInfo.email,
      customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      orderNumber: order.orderNumber,
      orderDate: new Date(order._createdAt).toLocaleDateString(),
      items: order.items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: `${item.price.toFixed(2)}`
      })),
      totalAmount: order.totalAmount.toFixed(2),
      shippingAddress: order.shippingAddress,
      orderTrackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}`
    };

    const success = await sendOrderConfirmationEmail(emailData);

    if (!success) {
      throw new Error('Failed to send confirmation email');
    }

    return { success: true, message: 'Order confirmation email sent successfully' };
  } catch (error) {
    console.error('Send order confirmation email action error:', error);
    throw new Error('Failed to send order confirmation email');
  }
}

// Send shipping notification email action
export async function sendShippingNotificationAction(orderId: string, trackingData: {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await getUserByClerkId(userId);
    if (!user || !['admin', 'deliveryman'].includes(user.employeeRole)) {
      throw new Error('Insufficient permissions');
    }

    // Fetch order details
    const order = await client.fetch(`
      *[_type == "order" && _id == $orderId][0] {
        _id,
        orderNumber,
        customerInfo
      }
    `, { orderId });

    if (!order) {
      throw new Error('Order not found');
    }

    const emailData: ShippingNotificationData = {
      customerEmail: order.customerInfo.email,
      customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      orderNumber: order.orderNumber,
      trackingNumber: trackingData.trackingNumber,
      carrier: trackingData.carrier,
      estimatedDelivery: trackingData.estimatedDelivery,
      trackingUrl: `https://track.${trackingData.carrier.toLowerCase()}.com/${trackingData.trackingNumber}`
    };

    const success = await sendShippingNotificationEmail(emailData);

    if (!success) {
      throw new Error('Failed to send shipping notification email');
    }

    return { success: true, message: 'Shipping notification email sent successfully' };
  } catch (error) {
    console.error('Send shipping notification email action error:', error);
    throw new Error('Failed to send shipping notification email');
  }
}

// Send order delivered email action
export async function sendOrderDeliveredAction(orderId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await getUserByClerkId(userId);
    if (!user || !['admin', 'deliveryman'].includes(user.employeeRole)) {
      throw new Error('Insufficient permissions');
    }

    // Fetch order details
    const order = await client.fetch(`
      *[_type == "order" && _id == $orderId][0] {
        _id,
        orderNumber,
        customerInfo,
        shippingAddress,
        deliveredAt
      }
    `, { orderId });

    if (!order) {
      throw new Error('Order not found');
    }

    const emailData: OrderDeliveredData = {
      customerEmail: order.customerInfo.email,
      customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      orderNumber: order.orderNumber,
      deliveredDate: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : new Date().toLocaleDateString(),
      deliveryAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
      reviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}/review`
    };

    const success = await sendOrderDeliveredEmail(emailData);

    if (!success) {
      throw new Error('Failed to send delivery notification email');
    }

    return { success: true, message: 'Delivery notification email sent successfully' };
  } catch (error) {
    console.error('Send order delivered email action error:', error);
    throw new Error('Failed to send delivery notification email');
  }
}

// Send employee notification action
export async function sendEmployeeNotificationAction(
  employeeId: string, 
  notificationData: {
    title: string;
    message: string;
    orderId?: string;
    actionUrl?: string;
  }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      throw new Error('Admin access required');
    }

    // Fetch employee details
    const employee = await client.fetch(`
      *[_type == "user" && _id == $employeeId && isEmployee == true][0] {
        firstName,
        lastName,
        email
      }
    `, { employeeId });

    if (!employee) {
      throw new Error('Employee not found');
    }

    let orderDetails;
    if (notificationData.orderId) {
      const order = await client.fetch(`
        *[_type == "order" && _id == $orderId][0] {
          orderNumber,
          customerInfo,
          priority,
          status
        }
      `, { orderId: notificationData.orderId });

      if (order) {
        orderDetails = {
          orderNumber: order.orderNumber,
          customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
          priority: order.priority || 'Normal',
          actionRequired: `Update order status from ${order.status}`
        };
      }
    }

    const emailData: EmployeeNotificationData = {
      employeeEmail: employee.email,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      notificationTitle: notificationData.title,
      message: notificationData.message,
      orderDetails,
      actionUrl: notificationData.actionUrl
    };

    const success = await sendEmployeeNotificationEmail(emailData);

    if (!success) {
      throw new Error('Failed to send employee notification email');
    }

    return { success: true, message: 'Employee notification email sent successfully' };
  } catch (error) {
    console.error('Send employee notification email action error:', error);
    throw new Error('Failed to send employee notification email');
  }
}

// Queue bulk order emails action
export async function queueBulkOrderEmailsAction(orderIds: string[], emailType: 'confirmation' | 'shipping') {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await getUserByClerkId(userId);
    if (!user || !['admin', 'accounts'].includes(user.employeeRole)) {
      throw new Error('Insufficient permissions');
    }

    const queuedEmails: string[] = [];

    for (const orderId of orderIds) {
      try {
        const order = await client.fetch(`
          *[_type == "order" && _id == $orderId][0] {
            _id,
            orderNumber,
            totalAmount,
            _createdAt,
            customerInfo,
            shippingAddress,
            trackingNumber,
            carrier,
            estimatedDelivery,
            items[] {
              product->{
                name,
                price
              },
              quantity,
              price
            }
          }
        `, { orderId });

        if (!order) continue;

        if (emailType === 'confirmation') {
          const emailData: OrderConfirmationData = {
            customerEmail: order.customerInfo.email,
            customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
            orderNumber: order.orderNumber,
            orderDate: new Date(order._createdAt).toLocaleDateString(),
            items: order.items.map((item: any) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: `${item.price.toFixed(2)}`
            })),
            totalAmount: order.totalAmount.toFixed(2),
            shippingAddress: order.shippingAddress,
            orderTrackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}`
          };

          const emailId = queueOrderConfirmationEmail(emailData, 'normal');
          queuedEmails.push(emailId);
        } else if (emailType === 'shipping' && order.trackingNumber) {
          const emailData: ShippingNotificationData = {
            customerEmail: order.customerInfo.email,
            customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
            orderNumber: order.orderNumber,
            trackingNumber: order.trackingNumber,
            carrier: order.carrier || 'Standard Shipping',
            estimatedDelivery: order.estimatedDelivery || 'Within 3-5 business days',
            trackingUrl: `https://track.${(order.carrier || 'standard').toLowerCase()}.com/${order.trackingNumber}`
          };

          const emailId = queueShippingNotificationEmail(emailData, 'normal');
          queuedEmails.push(emailId);
        }
      } catch (error) {
        console.error(`Failed to queue email for order ${orderId}:`, error);
      }
    }

    return { 
      success: true, 
      message: `${queuedEmails.length} emails queued successfully`,
      queuedCount: queuedEmails.length,
      emailIds: queuedEmails
    };
  } catch (error) {
    console.error('Queue bulk order emails action error:', error);
    throw new Error('Failed to queue bulk order emails');
  }
}