import { EMAIL_CONFIG, EmailTemplateParams } from './emailConfig';
import { Ticket } from './types';

// Try to load EmailJS dynamically (only if configured)
let emailjs: any = null;

async function loadEmailJS() {
  if (emailjs) return emailjs;
  if (!isEmailConfigured()) return null;
  
  try {
    const module = await import('@emailjs/browser');
    emailjs = module.default;
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    return emailjs;
  } catch (error) {
    console.warn('EmailJS not available, using mailto fallback');
    return null;
  }
}

/**
 * Send email notification when a new ticket is created
 * Uses EmailJS if configured, otherwise falls back to mailto:
 */
export async function sendNewTicketEmail(ticket: Ticket): Promise<boolean> {
  // Try EmailJS first
  const emailjsInstance = await loadEmailJS();
  
  if (emailjsInstance && isEmailConfigured()) {
    try {
      const templateParams = buildTemplateParams(ticket);
      const response = await emailjsInstance.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams as unknown as Record<string, unknown>
      );
      console.log('Email sent via EmailJS:', response.status);
      return true;
    } catch (error) {
      console.error('EmailJS failed, falling back to mailto:', error);
      return openMailtoFallback(ticket);
    }
  }
  
  // Fallback to mailto:
  return openMailtoFallback(ticket);
}

/**
 * Build email template parameters
 */
function buildTemplateParams(ticket: Ticket): EmailTemplateParams {
  return {
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
}

/**
 * Fallback: Open user's email client with pre-filled ticket details
 */
function openMailtoFallback(ticket: Ticket): boolean {
  const subject = `New Support Ticket: ${ticket.ticketNumber} - ${ticket.title}`;
  
  const body = `
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
${EMAIL_CONFIG.COMPANY_NAME}
Support: ${EMAIL_CONFIG.SUPPORT_PHONE}
  `.trim();

  const mailtoLink = `mailto:${EMAIL_CONFIG.RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;
  
  return true;
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
 * Check if EmailJS is properly configured
 */
export function isEmailConfigured(): boolean {
  return (
    EMAIL_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAIL_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  );
}
