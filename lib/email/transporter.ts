import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create reusable transporter object using SMTP transport
export const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
};

// Email types
export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// Send email function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: emailData.from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      cc: emailData.cc ? (Array.isArray(emailData.cc) ? emailData.cc.join(', ') : emailData.cc) : undefined,
      bcc: emailData.bcc ? (Array.isArray(emailData.bcc) ? emailData.bcc.join(', ') : emailData.bcc) : undefined,
      attachments: emailData.attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP server verification failed:', error);
    return false;
  }
};

// Email queue for batch sending
export interface EmailQueueItem extends EmailData {
  id: string;
  priority: 'high' | 'normal' | 'low';
  attempts: number;
  maxAttempts: number;
  scheduledAt?: Date;
  createdAt: Date;
}

class EmailQueue {
  private queue: EmailQueueItem[] = [];
  private processing = false;

  add(emailData: EmailData, priority: 'high' | 'normal' | 'low' = 'normal', scheduledAt?: Date): string {
    const id = Math.random().toString(36).substr(2, 9);
    const queueItem: EmailQueueItem = {
      ...emailData,
      id,
      priority,
      attempts: 0,
      maxAttempts: 3,
      scheduledAt,
      createdAt: new Date(),
    };

    this.queue.push(queueItem);
    this.sortQueue();
    
    if (!this.processing) {
      this.processQueue();
    }

    return id;
  }

  private sortQueue() {
    this.queue.sort((a, b) => {
      // Priority order: high > normal > low
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // Then by creation time
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      // Check if email is scheduled for later
      if (item.scheduledAt && item.scheduledAt > new Date()) {
        // Skip this item for now
        this.queue.push(this.queue.shift()!);
        continue;
      }

      try {
        const success = await sendEmail(item);
        
        if (success) {
          this.queue.shift(); // Remove from queue
        } else {
          item.attempts++;
          if (item.attempts >= item.maxAttempts) {
            this.queue.shift(); // Remove failed email
            console.error(`Email ${item.id} failed after ${item.maxAttempts} attempts`);
          } else {
            // Move to end of queue for retry
            this.queue.push(this.queue.shift()!);
          }
        }
      } catch (error) {
        console.error(`Error processing email ${item.id}:`, error);
        this.queue.shift(); // Remove problematic email
      }

      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.processing = false;
  }

  getQueueStatus() {
    return {
      total: this.queue.length,
      processing: this.processing,
      byPriority: {
        high: this.queue.filter(item => item.priority === 'high').length,
        normal: this.queue.filter(item => item.priority === 'normal').length,
        low: this.queue.filter(item => item.priority === 'low').length,
      }
    };
  }
}

export const emailQueue = new EmailQueue();