// Email Configuration - Admin Configurable
// Supports both EmailJS and SMTP services

const EMAIL_CONFIG_KEY = 'jeb_email_config';

export interface EmailConfig {
  serviceType: 'emailjs' | 'smtp';
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: 'tls' | 'ssl' | 'none';
    username: string;
    password: string;
    fromEmail: string;
    apiEndpoint: string;
  };
  recipientEmail: string;
  companyName: string;
  supportPhone: string;
}

// Default configuration
const DEFAULT_CONFIG: EmailConfig = {
  serviceType: 'emailjs',
  emailjs: {
    serviceId: '',
    templateId: '',
    publicKey: '',
  },
  smtp: {
    host: '',
    port: 587,
    secure: 'tls',
    username: '',
    password: '',
    fromEmail: '',
    apiEndpoint: '',
  },
  recipientEmail: 'support@jebinnovations.sg',
  companyName: 'JEB Innovations & Technologies Pte Ltd',
  supportPhone: '+65 XXXX XXXX',
};

// Get email configuration from localStorage
export function getEmailConfig(): EmailConfig {
  const data = localStorage.getItem(EMAIL_CONFIG_KEY);
  if (!data) {
    return DEFAULT_CONFIG;
  }
  return JSON.parse(data);
}

// Save email configuration to localStorage
export function saveEmailConfig(config: EmailConfig): void {
  localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
}

// Check if email is configured
export function isEmailConfigured(): boolean {
  const config = getEmailConfig();
  
  if (config.serviceType === 'emailjs') {
    return !!(
      config.emailjs.serviceId &&
      config.emailjs.templateId &&
      config.emailjs.publicKey
    );
  }
  
  if (config.serviceType === 'smtp') {
    return !!(
      config.smtp.host &&
      config.smtp.port &&
      config.smtp.username &&
      config.smtp.password &&
      config.smtp.fromEmail
    );
  }
  
  return false;
}

// Test email configuration
export async function testEmailConfig(config: EmailConfig): Promise<{ success: boolean; message: string }> {
  if (!isEmailConfigured()) {
    return {
      success: false,
      message: 'Email configuration is incomplete. Please fill in all required fields.',
    };
  }

  try {
    if (config.serviceType === 'emailjs') {
      // Test EmailJS configuration
      const emailjs = (await import('@emailjs/browser')).default;
      emailjs.init(config.emailjs.publicKey);
      
      const testParams = {
        to_email: config.recipientEmail,
        from_name: 'Test User',
        from_email: 'test@example.com',
        from_phone: '+65 0000 0000',
        ticket_number: 'TEST-001',
        ticket_title: 'Test Email',
        ticket_description: 'This is a test email to verify your EmailJS configuration.',
        ticket_category: 'General',
        ticket_priority: 'LOW',
        site_location: 'Test Location',
        company_name: config.companyName,
        support_phone: config.supportPhone,
      };

      await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        testParams as unknown as Record<string, unknown>
      );

      return {
        success: true,
        message: `Test email sent successfully to ${config.recipientEmail}. Please check your inbox.`,
      };
    }

    if (config.serviceType === 'smtp') {
      // Test SMTP configuration via backend API
      if (!config.smtp.apiEndpoint) {
        return {
          success: false,
          message: 'SMTP requires a backend API endpoint. Please configure your backend server.',
        };
      }

      const response = await fetch(config.smtp.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          config: {
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            username: config.smtp.username,
            password: config.smtp.password,
            fromEmail: config.smtp.fromEmail,
          },
          to: config.recipientEmail,
          subject: 'Test Email',
          body: 'This is a test email to verify your SMTP configuration.',
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: `Test email sent successfully to ${config.recipientEmail}. Please check your inbox.`,
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          message: `SMTP test failed: ${error}`,
        };
      }
    }

    return {
      success: false,
      message: 'Unknown service type.',
    };
  } catch (error) {
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
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
