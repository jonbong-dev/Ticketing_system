# Admin Settings - Email Service Configuration

## 🎯 Overview

Admins can now configure email services directly from the admin dashboard without modifying code. The system supports both **EmailJS** (recommended for Cloudflare) and **SMTP** (requires backend).

---

## 🔑 Admin Login Credentials

**Admin Account:**
- **Email:** `admin@jebinnovations.sg`
- **Password:** `admin123`

**Sample Customer Account:**
- **Email:** `customer@example.com`
- **Password:** `customer123`

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

---

## ⚙️ Accessing Admin Settings

1. Login as admin
2. Click the **"Settings"** button in the top-right header
3. You'll see the Email Service Configuration page

---

## 📧 Email Service Options

### Option 1: EmailJS (Recommended for Cloudflare)

**Best for:**
- ✅ Cloudflare Pages deployment (free tier)
- ✅ No backend server required
- ✅ Easy setup (5 minutes)
- ✅ 200 emails/month free

**Configuration Steps:**

1. **Sign up at EmailJS**
   - Visit [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create free account

2. **Add Email Service**
   - Go to "Email Services"
   - Click "Add New Service"
   - Choose Gmail, Outlook, or other provider
   - Connect your email account
   - Copy the **Service ID**

3. **Create Email Templates**
   - Go to "Email Templates"
   - Create template for ticket notifications
   - Create template for password resets
   - Copy the **Template ID**

4. **Get Public Key**
   - Go to "Account" → "API Keys"
   - Copy your **Public Key**

5. **Configure in Admin Settings**
   - Select "EmailJS" as service type
   - Paste Service ID, Template ID, and Public Key
   - Enter support email and company info
   - Click "Save Configuration"
   - Click "Test Configuration" to verify

**Template Variables:**

For ticket notifications:
```
{{to_email}}           - Recipient email
{{from_name}}          - Customer name
{{from_email}}         - Customer email
{{from_phone}}         - Customer phone
{{ticket_number}}      - Ticket number (e.g., JEB-0007)
{{ticket_title}}       - Issue title
{{ticket_description}} - Full description
{{ticket_category}}    - Category (formatted)
{{ticket_priority}}    - Priority level
{{site_location}}      - Site address
{{company_name}}       - Your company name
{{support_phone}}      - Your support phone
```

For password resets:
```
{{to_email}}           - User's email
{{to_name}}            - User's name
{{temporary_password}} - Generated temporary password
{{reset_link}}         - Link to login page
{{company_name}}       - Your company name
{{support_phone}}      - Your support phone
```

---

### Option 2: SMTP Server (Requires Backend)

**Best for:**
- ✅ Custom email servers
- ✅ Higher email volume
- ✅ Full control over email delivery
- ⚠️ Requires backend server or Cloudflare Worker

**Configuration Steps:**

1. **Set Up Backend Server**
   - Create a Cloudflare Worker or Node.js server
   - Implement email sending endpoint
   - Example endpoint: `https://your-worker.workers.dev/api/send-email`

2. **Configure SMTP Settings**
   - Select "SMTP Server" as service type
   - Enter SMTP host (e.g., `smtp.gmail.com`)
   - Enter port (587 for TLS, 465 for SSL)
   - Select encryption (TLS/SSL/None)
   - Enter username and password
   - Enter from email address
   - Enter backend API endpoint

3. **Backend API Format**

Your backend should accept POST requests with this format:

```json
{
  "action": "send",
  "config": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": "tls",
    "username": "your.email@gmail.com",
    "password": "your-app-password",
    "fromEmail": "noreply@jebinnovations.sg"
  },
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content"
}
```

**Example Cloudflare Worker:**

```javascript
export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const data = await request.json();
      
      // Use env.SMTP_HOST, env.SMTP_PORT, etc.
      // Or use data.config for dynamic configuration
      
      // Send email using your preferred method
      // (e.g., nodemailer, sendgrid API, etc.)
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  }
};
```

**Common SMTP Servers:**

| Provider | Host | Port (TLS) | Port (SSL) |
|----------|------|------------|------------|
| Gmail | smtp.gmail.com | 587 | 465 |
| Outlook | smtp.office365.com | 587 | - |
| Yahoo | smtp.mail.yahoo.com | 587 | 465 |
| SendGrid | smtp.sendgrid.net | 587 | - |
| Mailgun | smtp.mailgun.org | 587 | 465 |

**Note for Gmail:**
- Use App Password (not regular password)
- Enable 2-factor authentication first
- Generate App Password at: https://myaccount.google.com/apppasswords

---

## 🧪 Testing Email Configuration

1. Fill in all required fields
2. Click **"Save Configuration"**
3. Click **"Test Configuration"**
4. Check your email inbox for test email
5. If test fails, check error message and fix configuration

**Test Email Content:**
- Subject: "Test Email"
- Body: "This is a test email to verify your configuration."
- Sent to: Your configured support email

---

## 🔒 Security Notes

### EmailJS
- ✅ Public Key is safe to expose (designed to be public)
- ✅ Service ID and Template ID are not sensitive
- ⚠️ Monitor EmailJS dashboard for unusual activity
- ⚠️ Set up rate limiting in EmailJS dashboard

### SMTP
- ✅ SMTP credentials stored in localStorage (browser-only)
- ⚠️ For production, consider using environment variables
- ⚠️ Use App Passwords (not regular passwords)
- ⚠️ Enable 2-factor authentication on email accounts
- ⚠️ Backend should validate requests

### General
- ✅ All passwords hashed before storage
- ✅ Role-based access control
- ✅ Admin-only access to settings
- ⚠️ Change default admin password immediately
- ⚠️ Use strong passwords (12+ characters)

---

## 📊 Configuration Storage

Email configuration is stored in browser localStorage:
- Key: `jeb_email_config`
- Format: JSON
- Scope: Per-browser (not shared across devices)

**Backup Configuration:**
```javascript
// Run in browser console
const config = localStorage.getItem('jeb_email_config');
console.log(config);
// Copy and save to a file
```

**Restore Configuration:**
```javascript
// Run in browser console
const config = '...'; // Paste your backup
localStorage.setItem('jeb_email_config', config);
location.reload();
```

---

## 🚨 Troubleshooting

### "Email not configured" Error
- Check if all required fields are filled
- Click "Save Configuration"
- Verify configuration is saved in localStorage

### Test Email Not Received
- Check spam folder
- Verify recipient email is correct
- Check EmailJS dashboard for delivery status
- Verify SMTP credentials are correct
- Check backend API endpoint (for SMTP)

### EmailJS Errors
- **Invalid Service ID**: Check EmailJS dashboard
- **Invalid Template ID**: Verify template exists
- **Invalid Public Key**: Regenerate from Account → API Keys
- **Rate limit exceeded**: Upgrade EmailJS plan or wait

### SMTP Errors
- **Connection refused**: Check host and port
- **Authentication failed**: Verify username/password
- **Timeout**: Check network/firewall
- **Backend API error**: Check worker logs

---

## 📝 Email Templates

### Ticket Notification Template (EmailJS)

**Subject:**
```
New Support Ticket: {{ticket_number}} - {{ticket_title}}
```

**Body:**
```html
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0;">{{company_name}}</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">IT & Physical Security Support</p>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
      <h2>New Support Ticket Received</h2>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Ticket Number:</strong> {{ticket_number}}</p>
        <p><strong>Title:</strong> {{ticket_title}}</p>
        <p><strong>Priority:</strong> {{ticket_priority}}</p>
        <p><strong>Category:</strong> {{ticket_category}}</p>
        <p><strong>Location:</strong> {{site_location}}</p>
      </div>
      
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> {{from_name}}</p>
      <p><strong>Email:</strong> {{from_email}}</p>
      <p><strong>Phone:</strong> {{from_phone}}</p>
      
      <h3>Issue Description</h3>
      <div style="background: white; padding: 15px; border-radius: 8px;">
        <p style="white-space: pre-wrap;">{{ticket_description}}</p>
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

### Password Reset Template (EmailJS)

**Subject:**
```
Password Reset - JEB Ticketing System
```

**Body:**
```html
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0;">{{company_name}}</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Password Reset Request</p>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
      <h2>Hello {{to_name}},</h2>
      
      <p>We received a request to reset your password.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 500;">Your Temporary Password:</p>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #d97706; font-family: monospace;">
          {{temporary_password}}
        </p>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⚠️ Important:</strong> Please change your password immediately after logging in.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{reset_link}}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
          Login to JEB Ticketing System
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        If you didn't request this, please ignore this email.
      </p>
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

---

## ✅ Checklist

Before going live:

- [ ] Login as admin
- [ ] Go to Settings
- [ ] Choose email service type (EmailJS or SMTP)
- [ ] Configure all required fields
- [ ] Save configuration
- [ ] Test configuration
- [ ] Verify test email received
- [ ] Change default admin password
- [ ] Test ticket creation (email notification)
- [ ] Test forgot password (email notification)
- [ ] Test admin update to customer (email notification)
- [ ] Backup configuration

---

## 📞 Support

- **EmailJS Documentation:** https://www.emailjs.com/docs/
- **EmailJS Support:** https://support.emailjs.com/
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/

---

**Last Updated:** 2024
**Version:** 1.3.0 (Admin Settings)
**Status:** ✅ Complete and Tested
