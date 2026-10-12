import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, EmailTemplateParams } from './emailConfig';
import { Ticket } from './types';

// Initialize EmailJS
let isInitialized = false;

function initializeEmailJS() {
  if (!isInitialized && isEmailConfigured()) {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    isInitialized = true;
  }
}

/**
 * Send email notification when a new ticket is created
 * Returns true if email was sent successfully, false otherwise
 */
export async function sendNewTicketEmail(ticket: Ticket): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn('EmailJS not configured. Email notifications disabled.');
    return false;
  }

  initializeEmailJS();

  try {
    const templateParams: EmailTemplateParams = {
      to_email: EMAIL_CONFIG.RECIPIENT_EMAIL,
      from_name: ticket.customerName,
      from_email: ticket.customerEmail,
      from_phone: ticket.customerPhone,
      ticket_number: ticket.ticketNumber,
      ticket_title: ticket.title,
      ticket_description: ticket.description,
      ticket_category: formatCategory(ticket.category),
      ticket_priority: ticket.priority.toUpperCase(),
      site_location: ticket.siteLocation,
      company_name: EMAIL_CONFIG.COMPANY_NAME,
      support_phone: EMAIL_CONFIG.SUPPORT_PHONE,
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams as unknown as Record<string, unknown>
    );

    console.log('✅ Email sent successfully:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

/**
 * Send update email to customer from admin
 */
export async function sendUpdateToCustomer(
  ticket: Ticket,
  adminName: string,
  message: string
): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn('EmailJS not configured. Email notifications disabled.');
    return false;
  }

  initializeEmailJS();

  try {
    const templateParams = {
      to_email: ticket.customerEmail,
      from_name: adminName,
      ticket_number: ticket.ticketNumber,
      ticket_title: ticket.title,
      ticket_status: ticket.status.toUpperCase(),
      ticket_priority: ticket.priority.toUpperCase(),
      update_message: message,
      company_name: EMAIL_CONFIG.COMPANY_NAME,
      support_phone: EMAIL_CONFIG.SUPPORT_PHONE,
    };

    // Use a separate template for customer updates (you'll need to create this in EmailJS)
    // For now, we'll use the same template but with different parameters
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID, // You may want to create a separate template for updates
      templateParams as unknown as Record<string, unknown>
    );

    console.log('✅ Update email sent successfully:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Failed to send update email:', error);
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
 * Send password reset email with temporary password
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  temporaryPassword: string
): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn('EmailJS not configured. Password reset email not sent.');
    return false;
  }

  initializeEmailJS();

  try {
    const templateParams = {
      to_email: email,
      to_name: name,
      temporary_password: temporaryPassword,
      company_name: EMAIL_CONFIG.COMPANY_NAME,
      support_phone: EMAIL_CONFIG.SUPPORT_PHONE,
      reset_link: window.location.origin,
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams as unknown as Record<string, unknown>
    );

    console.log('✅ Password reset email sent successfully:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
}

/**
 * Check if EmailJS is properly configured
 */
export function isEmailConfigured(): boolean {
  return (
    EMAIL_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAIL_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  );
}
