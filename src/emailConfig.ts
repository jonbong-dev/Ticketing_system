// EmailJS Configuration
// Sign up at https://www.emailjs.com/ and get your credentials

export const EMAIL_CONFIG = {
  // EmailJS Service ID - Get this from EmailJS dashboard
  SERVICE_ID: 'YOUR_SERVICE_ID',
  
  // EmailJS Template ID - Create a template in EmailJS dashboard
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
  
  // EmailJS Public Key - Get this from EmailJS dashboard
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
  
  // Recipient email (JEB team email)
  RECIPIENT_EMAIL: 'support@jebinnovations.sg',
  
  // Company name for email branding
  COMPANY_NAME: 'JEB Innovations & Technologies Pte Ltd',
  
  // Support phone number
  SUPPORT_PHONE: '+65 XXXX XXXX',
}

// Email template parameters
export interface EmailTemplateParams {
  to_email: string;
  from_name: string;
  from_email: string;
  from_phone: string;
  ticket_number: string;
  ticket_title: string;
  ticket_description: string;
  ticket_category: string;
  ticket_priority: string;
  site_location: string;
  company_name: string;
  support_phone: string;
}
