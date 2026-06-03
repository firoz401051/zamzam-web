import { sendEmail, emailQueue, EmailData } from './transporter';
import { renderEmail } from './templates';

// Order confirmation email
export interface OrderConfirmationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  totalAmount: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderTrackingUrl: string;
}

export const sendOrderConfirmationEmail = async (data: OrderConfirmationData): Promise<boolean> => {
  const emailHtml = renderEmail('orderConfirmation', {
    title: 'Order Confirmation - zamzam',
    subtitle: 'Your order has been confirmed',
    ...data,
  });

  const emailData: EmailData = {
    to: data.customerEmail,
    subject: `Order Confirmation - #${data.orderNumber}`,
    html: emailHtml,
  };

  return await sendEmail(emailData);
};

// Shipping notification email
export interface ShippingNotificationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  trackingUrl: string;
}

export const sendShippingNotificationEmail = async (data: ShippingNotificationData): Promise<boolean> => {
  const emailHtml = renderEmail('shippingNotification', {
    title: 'Your Order Has Shipped - zamzam',
    subtitle: 'Track your package',
    ...data,
  });

  const emailData: EmailData = {
    to: data.customerEmail,
    subject: `Your order #${data.orderNumber} has shipped!`,
    html: emailHtml,
  };

  return await sendEmail(emailData);
};

// Order delivered email
export interface OrderDeliveredData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  deliveredDate: string;
  deliveryAddress: string;
  reviewUrl: string;
}

export const sendOrderDeliveredEmail = async (data: OrderDeliveredData): Promise<boolean> => {
  const emailHtml = renderEmail('orderDelivered', {
    title: 'Order Delivered - zamzam',
    subtitle: 'Your order has arrived!',
    ...data,
  });

  const emailData: EmailData = {
    to: data.customerEmail,
    subject: `Your order #${data.orderNumber} has been delivered!`,
    html: emailHtml,
  };

  return await sendEmail(emailData);
};

// Employee notification email
export interface EmployeeNotificationData {
  employeeEmail: string;
  employeeName: string;
  notificationTitle: string;
  message: string;
  orderDetails?: {
    orderNumber: string;
    customerName: string;
    priority: string;
    actionRequired: string;
  };
  actionUrl?: string;
}

export const sendEmployeeNotificationEmail = async (data: EmployeeNotificationData): Promise<boolean> => {
  const emailHtml = renderEmail('employeeNotification', {
    title: 'zamzam - Employee Notification',
    subtitle: 'Action Required',
    ...data,
  });

  const emailData: EmailData = {
    to: data.employeeEmail,
    subject: `zamzam: ${data.notificationTitle}`,
    html: emailHtml,
  };

  return await sendEmail(emailData);
};

// Password reset email
export interface PasswordResetData {
  userEmail: string;
  userName: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async (data: PasswordResetData): Promise<boolean> => {
  const emailHtml = renderEmail('passwordReset', {
    title: 'Password Reset - zamzam',
    subtitle: 'Reset your password',
    ...data,
  });

  const emailData: EmailData = {
    to: data.userEmail,
    subject: 'Reset your zamzam password',
    html: emailHtml,
  };

  return await sendEmail(emailData);
};

// Welcome email
export interface WelcomeEmailData {
  userEmail: string;
  userName: string;
  shopUrl: string;
}

export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<boolean> => {
  const emailHtml = renderEmail('welcomeEmail', {
    title: 'Welcome to zamzam!',
    subtitle: 'Start your shopping journey',
    ...data,
  });

  const emailData: EmailData = {
    to: data.userEmail,
    subject: 'Welcome to zamzam!',
    html: emailHtml,
  };

  return await sendEmail(emailData);
};

// Bulk email functions
export const sendBulkOrderUpdates = async (orders: Array<{
  type: 'confirmation' | 'shipping' | 'delivered';
  data: OrderConfirmationData | ShippingNotificationData | OrderDeliveredData;
}>): Promise<number> => {
  let successCount = 0;

  for (const order of orders) {
    try {
      let success = false;
      
      switch (order.type) {
        case 'confirmation':
          success = await sendOrderConfirmationEmail(order.data as OrderConfirmationData);
          break;
        case 'shipping':
          success = await sendShippingNotificationEmail(order.data as ShippingNotificationData);
          break;
        case 'delivered':
          success = await sendOrderDeliveredEmail(order.data as OrderDeliveredData);
          break;
      }

      if (success) {
        successCount++;
      }
    } catch (error) {
      console.error(`Failed to send ${order.type} email:`, error);
    }

    // Add delay between bulk emails
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return successCount;
};

// Queue management functions
export const queueOrderConfirmationEmail = (data: OrderConfirmationData, priority: 'high' | 'normal' | 'low' = 'high'): string => {
  const emailHtml = renderEmail('orderConfirmation', {
    title: 'Order Confirmation - zamzam',
    subtitle: 'Your order has been confirmed',
    ...data,
  });

  return emailQueue.add({
    to: data.customerEmail,
    subject: `Order Confirmation - #${data.orderNumber}`,
    html: emailHtml,
  }, priority);
};

export const queueShippingNotificationEmail = (data: ShippingNotificationData, priority: 'high' | 'normal' | 'low' = 'high'): string => {
  const emailHtml = renderEmail('shippingNotification', {
    title: 'Your Order Has Shipped - zamzam',
    subtitle: 'Track your package',
    ...data,
  });

  return emailQueue.add({
    to: data.customerEmail,
    subject: `Your order #${data.orderNumber} has shipped!`,
    html: emailHtml,
  }, priority);
};

export const queueEmployeeNotificationEmail = (data: EmployeeNotificationData, priority: 'high' | 'normal' | 'low' = 'normal'): string => {
  const emailHtml = renderEmail('employeeNotification', {
    title: 'zamzam - Employee Notification',
    subtitle: 'Action Required',
    ...data,
  });

  return emailQueue.add({
    to: data.employeeEmail,
    subject: `zamzam: ${data.notificationTitle}`,
    html: emailHtml,
  }, priority);
};

// Email analytics
export interface EmailStats {
  totalSent: number;
  totalQueued: number;
  successRate: number;
  lastSent: Date | null;
}

let emailStats: EmailStats = {
  totalSent: 0,
  totalQueued: 0,
  successRate: 100,
  lastSent: null,
};

export const updateEmailStats = (sent: boolean) => {
  emailStats.totalSent++;
  if (sent) {
    emailStats.lastSent = new Date();
  }
  // Update success rate based on recent performance
};

export const getEmailStats = (): EmailStats => emailStats;

export const getQueueStatus = () => emailQueue.getQueueStatus();