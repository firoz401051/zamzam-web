import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/employee-utils';
import {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendOrderDeliveredEmail,
  sendEmployeeNotificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  queueOrderConfirmationEmail,
  queueShippingNotificationEmail,
  queueEmployeeNotificationEmail,
  getEmailStats,
  getQueueStatus,
  verifyEmailConfig,
  type OrderConfirmationData,
  type ShippingNotificationData,
  type OrderDeliveredData,
  type EmployeeNotificationData,
  type PasswordResetData,
  type WelcomeEmailData,
} from '@/lib/email';

// POST /api/email/send - Send email
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || (user.employeeRole !== 'admin' && user.employeeRole !== 'accounts')) {
      return NextResponse.json({ error: 'Admin or accounts access required' }, { status: 403 });
    }

    const { type, data, queue = false, priority = 'normal' } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Email type and data are required' },
        { status: 400 }
      );
    }

    let result: boolean | string = false;
    let emailId: string | undefined;

    try {
      switch (type) {
        case 'order-confirmation':
          if (queue) {
            emailId = queueOrderConfirmationEmail(data as OrderConfirmationData, priority);
            result = true;
          } else {
            result = await sendOrderConfirmationEmail(data as OrderConfirmationData);
          }
          break;

        case 'shipping-notification':
          if (queue) {
            emailId = queueShippingNotificationEmail(data as ShippingNotificationData, priority);
            result = true;
          } else {
            result = await sendShippingNotificationEmail(data as ShippingNotificationData);
          }
          break;

        case 'order-delivered':
          result = await sendOrderDeliveredEmail(data as OrderDeliveredData);
          break;

        case 'employee-notification':
          if (queue) {
            emailId = queueEmployeeNotificationEmail(data as EmployeeNotificationData, priority);
            result = true;
          } else {
            result = await sendEmployeeNotificationEmail(data as EmployeeNotificationData);
          }
          break;

        case 'password-reset':
          result = await sendPasswordResetEmail(data as PasswordResetData);
          break;

        case 'welcome':
          result = await sendWelcomeEmail(data as WelcomeEmailData);
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid email type' },
            { status: 400 }
          );
      }

      if (result) {
        return NextResponse.json({ 
          success: true, 
          emailId: emailId,
          queued: queue,
          message: queue ? 'Email queued successfully' : 'Email sent successfully'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return NextResponse.json(
        { error: 'Failed to process email request' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/email/stats - Get email statistics
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || (user.employeeRole !== 'admin' && user.employeeRole !== 'accounts')) {
      return NextResponse.json({ error: 'Admin or accounts access required' }, { status: 403 });
    }

    const stats = getEmailStats();
    const queueStatus = getQueueStatus();

    return NextResponse.json({
      stats,
      queue: queueStatus
    });
  } catch (error) {
    console.error('Email stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    );
  }
}