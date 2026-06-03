import Handlebars from 'handlebars';

// Base template for all emails
const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 10px 0;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        .order-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .total {
            font-weight: bold;
            font-size: 18px;
            color: #2563eb;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }
        .status-confirmed {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-shipped {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-delivered {
            background-color: #f0fdf4;
            color: #15803d;
        }
        .status-cancelled {
            background-color: #fef2f2;
            color: #dc2626;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">zamzam</div>
            <p>{{subtitle}}</p>
        </div>
        <div class="content">
            {{{content}}}
        </div>
        <div class="footer">
            <p>© 2025 zamzam. All rights reserved.</p>
            <p>If you have any questions, contact us at <a href="mailto:support@zamzam.com">support@zamzam.com</a></p>
        </div>
    </div>
</body>
</html>
`;

// Order confirmation template
const orderConfirmationTemplate = `
<h2>Thank you for your order!</h2>
<p>Hi {{customerName}},</p>
<p>We've received your order and are preparing it for shipment. Here are the details:</p>

<div class="order-details">
    <h3>Order #{{orderNumber}}</h3>
    <p><strong>Order Date:</strong> {{orderDate}}</p>
    <p><strong>Status:</strong> <span class="status-badge status-confirmed">Confirmed</span></p>
    
    <h4>Items Ordered:</h4>
    {{#each items}}
    <div class="order-item">
        <div>
            <strong>{{name}}</strong><br>
            <small>Quantity: {{quantity}}</small>
        </div>
        <div>\${{price}}</div>
    </div>
    {{/each}}
    
    <div class="order-item total">
        <div>Total Amount:</div>
        <div>\${{totalAmount}}</div>
    </div>
</div>

<div class="order-details">
    <h4>Shipping Address:</h4>
    <p>
        {{shippingAddress.name}}<br>
        {{shippingAddress.street}}<br>
        {{shippingAddress.city}}, {{shippingAddress.state}} {{shippingAddress.zipCode}}<br>
        {{shippingAddress.country}}
    </p>
</div>

<p>We'll send you another email when your order ships with tracking information.</p>

<a href="{{orderTrackingUrl}}" class="button">Track Your Order</a>

<p>Thank you for shopping with zamzam!</p>
`;

// Shipping notification template
const shippingNotificationTemplate = `
<h2>Your order is on its way!</h2>
<p>Hi {{customerName}},</p>
<p>Great news! Your order #{{orderNumber}} has been shipped and is on its way to you.</p>

<div class="order-details">
    <h3>Shipping Information</h3>
    <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
    <p><strong>Carrier:</strong> {{carrier}}</p>
    <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
    <p><strong>Status:</strong> <span class="status-badge status-shipped">Shipped</span></p>
</div>

<a href="{{trackingUrl}}" class="button">Track Your Package</a>

<p>You can track your package using the tracking number above or by clicking the button.</p>
<p>If you have any questions about your order, please don't hesitate to contact us.</p>
`;

// Order delivered template
const orderDeliveredTemplate = `
<h2>Your order has been delivered!</h2>
<p>Hi {{customerName}},</p>
<p>Your order #{{orderNumber}} has been successfully delivered to your address.</p>

<div class="order-details">
    <h3>Delivery Information</h3>
    <p><strong>Delivered On:</strong> {{deliveredDate}}</p>
    <p><strong>Delivered To:</strong> {{deliveryAddress}}</p>
    <p><strong>Status:</strong> <span class="status-badge status-delivered">Delivered</span></p>
</div>

<p>We hope you love your purchase! If you're satisfied with your order, we'd love to hear from you.</p>

<a href="{{reviewUrl}}" class="button">Leave a Review</a>

<p>If there are any issues with your order, please contact us immediately and we'll make it right.</p>
`;

// Employee notification template
const employeeNotificationTemplate = `
<h2>{{notificationTitle}}</h2>
<p>Hi {{employeeName}},</p>
<p>{{message}}</p>

{{#if orderDetails}}
<div class="order-details">
    <h3>Order Details</h3>
    <p><strong>Order Number:</strong> {{orderDetails.orderNumber}}</p>
    <p><strong>Customer:</strong> {{orderDetails.customerName}}</p>
    <p><strong>Priority:</strong> {{orderDetails.priority}}</p>
    <p><strong>Action Required:</strong> {{orderDetails.actionRequired}}</p>
</div>
{{/if}}

{{#if actionUrl}}
<a href="{{actionUrl}}" class="button">Take Action</a>
{{/if}}

<p>Please complete this task as soon as possible.</p>
`;

// Password reset template
const passwordResetTemplate = `
<h2>Password Reset Request</h2>
<p>Hi {{userName}},</p>
<p>We received a request to reset your password for your zamzam account.</p>

<p>Click the button below to reset your password:</p>

<a href="{{resetUrl}}" class="button">Reset Password</a>

<p>This link will expire in 24 hours for security reasons.</p>

<p>If you didn't request this password reset, please ignore this email or contact us if you have concerns.</p>
`;

// Welcome email template
const welcomeEmailTemplate = `
<h2>Welcome to zamzam!</h2>
<p>Hi {{userName}},</p>
<p>Welcome to zamzam! We're excited to have you join our community of shoppers.</p>

<p>Your account has been successfully created. Here's what you can do next:</p>

<ul>
    <li>Browse our extensive product catalog</li>
    <li>Create your wishlist</li>
    <li>Set up your preferences</li>
    <li>Start shopping and saving!</li>
</ul>

<a href="{{shopUrl}}" class="button">Start Shopping</a>

<p>If you have any questions, our support team is here to help.</p>
`;

// Compile all templates
export const compiledTemplates = {
  base: Handlebars.compile(baseTemplate),
  orderConfirmation: Handlebars.compile(orderConfirmationTemplate),
  shippingNotification: Handlebars.compile(shippingNotificationTemplate),
  orderDelivered: Handlebars.compile(orderDeliveredTemplate),
  employeeNotification: Handlebars.compile(employeeNotificationTemplate),
  passwordReset: Handlebars.compile(passwordResetTemplate),
  welcomeEmail: Handlebars.compile(welcomeEmailTemplate),
};

// Helper function to render email with base template
export const renderEmail = (templateName: keyof typeof compiledTemplates, data: any) => {
  if (templateName === 'base') {
    return compiledTemplates.base(data);
  }

  const content = compiledTemplates[templateName](data);
  return compiledTemplates.base({
    title: data.title || 'zamzam',
    subtitle: data.subtitle || '',
    content,
  });
};