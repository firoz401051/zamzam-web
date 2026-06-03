// Email transporter and core functionality
export {
  createTransporter,
  sendEmail,
  verifyEmailConfig,
  emailQueue,
  type EmailData,
  type EmailConfig,
  type EmailQueueItem,
} from './transporter';

// Email templates
export { renderEmail, compiledTemplates } from './templates';

// Email service functions
export {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendOrderDeliveredEmail,
  sendEmployeeNotificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendBulkOrderUpdates,
  queueOrderConfirmationEmail,
  queueShippingNotificationEmail,
  queueEmployeeNotificationEmail,
  getEmailStats,
  getQueueStatus,
  updateEmailStats,
  type OrderConfirmationData,
  type ShippingNotificationData,
  type OrderDeliveredData,
  type EmployeeNotificationData,
  type PasswordResetData,
  type WelcomeEmailData,
  type EmailStats,
} from './service';