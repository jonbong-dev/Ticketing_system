import emailjs from '@emailjs/browser';
import { getEmailConfig, isEmailConfigured as isConfigured, EmailTemplateParams } from './emailConfig';
import { Ticket } from './types';

// Re-export for convenience
export { isEmailConfigured } from './emailConfig';

// Initialize EmailJS
let isInitialized = false;
let lastPublicKey = '';

function initializeEmailJS() {
  const config = getEmailConfig();
  
  if (config.serviceType !== 'emailjs') {
    return;
  }
  
  if (!isInitialized || lastPublicKey !== config.emailjs.publicKey) {
    emailjs.init(config.emailjs.publicKey);
    isInitialized = true;
    lastPublicKey = config.emailjs.publicKey;
  }
}

/**
 * Send email notification when a new ticket is created
 * Returns true if email was sent successfully, false otherwise
 */
export async function sendNewTicketEmail(ticket: Ticket): Promise<boolean> {
  const config = getEmailConfig();
  
  if (!isConfigured()) {
    console.warn('Email not configured. Email notifications disabled.');
    return false;
  }

  if (config.serviceType === 'emailjs') {
    initializeEmailJS();

    try {
      const templateParams: EmailTemplateParams = {
        to_email: config.recipientEmail,
        from_name: ticket.customerName,
        from_email: ticket.customerEmail,
        from_phone: ticket.customerPhone,
        ticket_number: ticket.ticketNumber,
        ticket_title: ticket.title,
        ticket_description: ticket.description,
        ticket_category: formatCategory(ticket.category),
        ticket_priority: ticket.priority.toUpperCase(),
        site_location: ticket.siteLocation,
        company_name: config.companyName,
        support_phone: config.supportPhone,
      };

      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        templateParams as unknown as Record<string, unknown>
      );

      console.log('✅ Email sent successfully:', response.status, response.text);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  if (config.serviceType === 'smtp') {
    return await sendViaSMTP(config, {
      to: config.recipientEmail,
      subject: `New Support Ticket: ${ticket.ticketNumber} - ${ticket.title}`,
      body: buildTicketEmailBody(ticket, config),
    });
  }

  return false;
}

/**
 * Send update email to customer from admin
 */
export async function sendUpdateToCustomer(
  ticket: Ticket,
  adminName: string,
  message: string
): Promise<boolean> {
  const config = getEmailConfig();
  
  if (!isConfigured()) {
    console.warn('Email not configured. Email notifications disabled.');
    return false;
  }

  if (config.serviceType === 'emailjs') {
    initializeEmailJS();

    try {
      const templateParams = {
        to_email: ticket.customerEmail,
        to_name: ticket.customerName,
        from_name: adminName,
        ticket_number: ticket.ticketNumber,
        ticket_title: ticket.title,
        ticket_status: ticket.status.toUpperCase(),
        ticket_priority: ticket.priority.toUpperCase(),
        update_message: message,
        company_name: config.companyName,
        support_phone: config.supportPhone,
      };

      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        templateParams as unknown as Record<string, unknown>
      );

      console.log('✅ Update email sent successfully:', response.status, response.text);
      return true;
    } catch (error) {
      console.error('❌ Failed to send update email:', error);
      return false;
    }
  }

  if (config.serviceType === 'smtp') {
    return await sendViaSMTP(config, {
      to: ticket.customerEmail,
      subject: `Update on Your Support Ticket ${ticket.ticketNumber}`,
      body: buildUpdateEmailBody(ticket, adminName, message, config),
    });
  }

  return false;
}

/**
 * Send password reset email with temporary password
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  temporaryPassword: string
): Promise<boolean> {
  const config = getEmailConfig();
  
  if (!isConfigured()) {
    console.warn('Email not configured. Password reset email not sent.');
    return false;
  }

  if (config.serviceType === 'emailjs') {
    initializeEmailJS();

    try {
      const templateParams = {
        to_email: email,
        to_name: name,
        temporary_password: temporaryPassword,
        company_name: config.companyName,
        support_phone: config.supportPhone,
        reset_link: window.location.origin,
      };

      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        templateParams as unknown as Record<string, unknown>
      );

      console.log('✅ Password reset email sent successfully:', response.status);
      return true;
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return false;
    }
  }

  if (config.serviceType === 'smtp') {
    return await sendViaSMTP(config, {
      to: email,
      subject: 'Password Reset - JEB Ticketing System',
      body: buildPasswordResetEmailBody(name, temporaryPassword, config),
    });
  }

  return false;
}

/**
 * Send email via SMTP backend API
 */
async function sendViaSMTP(
  config: any,
  emailData: { to: string; subject: string; body: string }
): Promise<boolean> {
  if (!config.smtp.apiEndpoint) {
    console.error('SMTP API endpoint not configured');
    return false;
  }

  try {
    const response = await fetch(config.smtp.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send',
        config: {
          host: config.smtp.host,
          port: config.smtp.port,
          secure: config.smtp.secure,
          username: config.smtp.username,
          password: config.smtp.password,
          fromEmail: config.smtp.fromEmail,
        },
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
      }),
    });

    if (response.ok) {
      console.log('✅ SMTP email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ SMTP send failed:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ SMTP send error:', error);
    return false;
  }
}

/**
 * Format category for display
 */
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'it-infrastructure': 'IT Infrastructure',
    'it-network': 'IT Network',
    'it-software': 'IT Software',
    'it-hardware': 'IT Hardware',
    'physical-security-cctv': 'Physical Security - CCTV',
    'physical-security-access': 'Physical Security - Access Control',
    'physical-security-alarm': 'Physical Security - Alarm Systems',
    'physical-security-other': 'Physical Security - Other',
    'general': 'General Inquiry',
  };
  return categoryMap[category] || category;
}

/**
 * Build ticket email body for SMTP
 */
function buildTicketEmailBody(ticket: Ticket, config: any): string {
  return `
NEW SUPPORT TICKET RECEIVED
=====================================

Ticket Number: ${ticket.ticketNumber}
Priority: ${ticket.priority.toUpperCase()}
Category: ${formatCategory(ticket.category)}
Site Location: ${ticket.siteLocation}

CUSTOMER INFORMATION
-------------------------------------
Name: ${ticket.customerName}
Email: ${ticket.customerEmail}
Phone: ${ticket.customerPhone}

ISSUE DESCRIPTION
-------------------------------------
${ticket.description}

=====================================
${config.companyName}
Support: ${config.supportPhone}
  `.trim();
}

/**
 * Build update email body for SMTP
 */
function buildUpdateEmailBody(ticket: Ticket, adminName: string, message: string, config: any): string {
  return `
Dear ${ticket.customerName},

Here is an update on your support ticket ${ticket.ticketNumber}:

${message}

---
Ticket: ${ticket.title}
Status: ${ticket.status}
Priority: ${ticket.priority}

If you have any questions, please don't hesitate to contact us.

Best regards,
${adminName}
${config.companyName}
Support: ${config.supportPhone}
  `.trim();
}

/**
 * Build password reset email body for SMTP
 */
function buildPasswordResetEmailBody(name: string, tempPassword: string, config: any): string {
  return `
Hello ${name},

We received a request to reset your password for the JEB Ticketing System.

Your Temporary Password: ${tempPassword}

⚠️ Important: Please change your password immediately after logging in.

Login at: ${window.location.origin}

If you didn't request this, please ignore this email.

---
${config.companyName}
Support: ${config.supportPhone}
  `.trim();
}
