# EmailJS Setup Guide

This guide will help you configure email notifications for the JEB Ticketing System.

## What is EmailJS?

EmailJS is a service that allows you to send emails directly from client-side JavaScript without needing a backend server. It's perfect for Cloudflare Pages free tier deployment.

**Free Tier:** 200 emails/month (more than enough for most small businesses)

---

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up** and create a free account
3. Verify your email address

---

## Step 2: Add an Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook/Hotmail**
   - **SendGrid** (for production)
   - **Mailgun** (for production)
   - Or any other provider

4. Connect your email account:
   - For Gmail: Sign in with your Google account
   - For others: Enter your SMTP credentials

5. Give your service a name (e.g., "JEB Support Email")
6. Click **Create Service**
7. **Copy the Service ID** (you'll need this later)

---

## Step 3: Create an Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Set up the template as follows:

### Template Content

**Subject:**
```
New Support Ticket: {{ticket_number}} - {{ticket_title}}
```

**Content (HTML):**
```html
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">JEB Innovations & Technologies</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">IT & Physical Security Support</p>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
      <h2 style="color: #1f2937; margin-top: 0;">New Support Ticket Received</h2>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <p style="margin: 0 0 10px 0;"><strong>Ticket Number:</strong> <span style="color: #2563eb; font-size: 18px;">{{ticket_number}}</span></p>
        <p style="margin: 0 0 10px 0;"><strong>Title:</strong> {{ticket_title}}</p>
        <p style="margin: 0 0 10px 0;"><strong>Priority:</strong> <span style="color: {{#if priority == 'critical'}}#dc2626{{/if}}{{#if priority == 'high'}}#ea580c{{/if}}{{#if priority == 'medium'}}#ca8a04{{/if}}{{#if priority == 'low'}}#2563eb{{/if}}; font-weight: bold;">{{ticket_priority}}</span></p>
        <p style="margin: 0 0 10px 0;"><strong>Category:</strong> {{ticket_category}}</p>
        <p style="margin: 0;"><strong>Location:</strong> {{site_location}}</p>
      </div>
      
      <h3 style="color: #1f2937; margin-top: 25px;">Customer Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">{{from_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:{{from_email}}" style="color: #2563eb; text-decoration: none;">{{from_email}}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:{{from_phone}}" style="color: #2563eb; text-decoration: none;">{{from_phone}}</a></td>
        </tr>
      </table>
      
      <h3 style="color: #1f2937; margin-top: 25px;">Issue Description</h3>
      <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <p style="margin: 0; white-space: pre-wrap;">{{ticket_description}}</p>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p style="margin: 0; color: #1e40af; font-weight: 500;">⚡ Action Required</p>
        <p style="margin: 10px 0 0 0; color: #1e3a8a; font-size: 14px;">Please review this ticket and contact the customer as soon as possible.</p>
      </div>
    </div>
    
    <div style="background: #1f2937; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">
        {{company_name}}<br>
        Support: {{support_phone}}
      </p>
    </div>
  </div>
</body>
</html>
```

**Alternative Simple Template (Plain Text):**
```
New Support Ticket Received

Ticket Number: {{ticket_number}}
Title: {{ticket_title}}
Priority: {{ticket_priority}}
Category: {{ticket_category}}
Location: {{site_location}}

Customer Information:
Name: {{from_name}}
Email: {{from_email}}
Phone: {{from_phone}}

Issue Description:
{{ticket_description}}

---
{{company_name}}
Support: {{support_phone}}
```

4. In the **Settings** tab of your template:
   - Set **To Email** to: `{{to_email}}`
   - Set **From Name** to: `JEB Ticketing System`
   - Set **Reply To** to: `{{from_email}}`

5. Click **Save**
6. **Copy the Template ID** (you'll need this later)

---

## Step 4: Get Your Public Key

1. Go to **Account** → **API Keys** in your EmailJS dashboard
2. Copy your **Public Key**

---

## Step 5: Configure the Application

1. Open `src/emailConfig.ts` in your code editor
2. Replace the placeholder values with your actual credentials:

```typescript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx',        // Your Service ID from Step 2
  TEMPLATE_ID: 'template_xxxxxxx',      // Your Template ID from Step 3
  PUBLIC_KEY: 'xxxxxxxxxxxxxxx',        // Your Public Key from Step 4
  
  RECIPIENT_EMAIL: 'support@jebinnovations.sg',  // Your support email
  COMPANY_NAME: 'JEB Innovations & Technologies Pte Ltd',
  SUPPORT_PHONE: '+65 6123 4567',       // Your actual phone number
}
```

3. Save the file

---

## Step 6: Test the Configuration

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Click **Customer Portal** in the admin dashboard
4. Submit a test ticket
5. Check your email - you should receive a notification!

---

## Troubleshooting

### "Email notifications not configured" warning
- Make sure you replaced all placeholder values in `src/emailConfig.ts`
- Ensure there are no typos in your Service ID, Template ID, or Public Key

### Emails not being sent
- Check your EmailJS dashboard for error logs
- Verify your email service is connected and working
- Make sure you haven't exceeded your 200 emails/month limit
- Check your spam folder

### Template variables not showing
- Make sure all variable names in your template match exactly:
  - `{{to_email}}`
  - `{{from_name}}`
  - `{{from_email}}`
  - `{{from_phone}}`
  - `{{ticket_number}}`
  - `{{ticket_title}}`
  - `{{ticket_description}}`
  - `{{ticket_category}}`
  - `{{ticket_priority}}`
  - `{{site_location}}`
  - `{{company_name}}`
  - `{{support_phone}}`

---

## Upgrading EmailJS

If you need more than 200 emails/month, you can upgrade to a paid plan:
- **Startup Plan**: $10/month for 1,500 emails
- **Professional Plan**: $25/month for 5,000 emails
- **Business Plan**: $50/month for 15,000 emails

Visit [EmailJS Pricing](https://www.emailjs.com/pricing/) for more details.

---

## Alternative: Using Your Own Backend

If you prefer to use your own backend for email sending (for more control), you can:
1. Create a Cloudflare Worker to handle email sending
2. Use a service like SendGrid, Mailgun, or AWS SES
3. Update `src/emailService.ts` to call your backend API instead of EmailJS

This is more complex but gives you full control over email delivery.

---

## Security Note

Your EmailJS Public Key is exposed in the client-side code. This is normal and expected - it's designed to be public. However:
- Don't share your Service ID or Template ID publicly
- Monitor your EmailJS dashboard for unusual activity
- Consider implementing rate limiting if you expect high traffic

---

## Support

For EmailJS support, visit:
- Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Support: [https://support.emailjs.com/](https://support.emailjs.com/)

For JEB Ticketing System support, contact your development team.
