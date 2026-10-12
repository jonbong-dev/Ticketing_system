# Customer Portal & Email Notifications - Quick Start

## What's New?

✅ **Customer Portal** - Customers can now submit tickets without admin access
✅ **Email Notifications** - Automatic email alerts when tickets are created
✅ **Professional UI** - Clean, branded interface for customers

---

## 🚀 Quick Setup (5 minutes)

### 1. Configure Email Notifications

Open `src/emailConfig.ts` and update these values:

```typescript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx',        // From EmailJS dashboard
  TEMPLATE_ID: 'template_xxxxxxx',      // From EmailJS dashboard
  PUBLIC_KEY: 'xxxxxxxxxxxxxxx',        // From EmailJS dashboard
  
  RECIPIENT_EMAIL: 'your-email@company.sg',  // Your support email
  COMPANY_NAME: 'JEB Innovations & Technologies Pte Ltd',
  SUPPORT_PHONE: '+65 XXXX XXXX',
}
```

**Need EmailJS credentials?** See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed instructions.

### 2. Build & Deploy

```bash
npm run build
npx wrangler pages deploy dist
```

### 3. Share Customer Portal

Customers can access the portal by:
- Clicking **"Customer Portal"** button in the admin dashboard
- Or directly visiting: `https://your-site.pages.dev` and clicking the button

---

## 📧 How Email Notifications Work

### When a customer submits a ticket:

1. **Customer fills out the form**
   - Name, email, phone
   - Issue title and description
   - Category and priority
   - Site location

2. **System creates the ticket**
   - Generates ticket number (e.g., JEB-0007)
   - Stores in localStorage
   - Sets status to "Open"

3. **Email is sent to your team**
   - Professional HTML email with all details
   - Includes customer contact information
   - Shows priority and category
   - Branded with JEB Innovations logo

4. **Customer sees confirmation**
   - Ticket number displayed
   - Email notification status shown
   - Next steps explained

---

## 🎨 Customer Portal Features

### For Customers:
- ✅ Easy-to-use form with validation
- ✅ Professional JEB Innovations branding
- ✅ Category selection (IT & Physical Security)
- ✅ Priority level guidance
- ✅ Instant ticket number
- ✅ Clear next steps

### For Your Team:
- ✅ Automatic email notifications
- ✅ All ticket details in one email
- ✅ Direct reply-to customer email
- ✅ Professional HTML formatting
- ✅ Works without backend server

---

## 🔧 Email Template Example

Your EmailJS template will receive these variables:

```
{{to_email}}           → support@jebinnovations.sg
{{from_name}}          → John Doe
{{from_email}}         → john@customer.com
{{from_phone}}         → +65 9123 4567
{{ticket_number}}      → JEB-0007
{{ticket_title}}       → CCTV System Not Recording
{{ticket_description}} → The CCTV system has stopped recording...
{{ticket_category}}    → Physical Security - CCTV
{{ticket_priority}}    → HIGH
{{site_location}}      → 10 Anson Road, Singapore
{{company_name}}       → JEB Innovations & Technologies Pte Ltd
{{support_phone}}      → +65 6123 4567
```

---

## 📊 Testing the System

### Test as Admin:
1. Login to admin dashboard
2. Click "New Ticket"
3. Fill out the form
4. Submit → Email sent to your team

### Test as Customer:
1. Click "Customer Portal" button
2. Fill out the customer form
3. Submit → Email sent to your team
4. See confirmation screen with ticket number

### Verify Email:
- Check your inbox for the notification
- Verify all details are correct
- Test reply-to functionality
- Check spam folder if not received

---

## ⚠️ Important Notes

### EmailJS Free Tier:
- **200 emails/month** (usually enough for small teams)
- If you exceed this, emails will stop sending
- Upgrade to paid plan if needed ($10/month for 1,500 emails)

### Without Email Configuration:
- System still works perfectly
- Tickets are created and stored
- Only difference: no email notifications
- You'll see a warning in the customer portal

### Data Storage:
- All tickets stored in browser localStorage
- Data persists across sessions
- Not synced across devices
- Clear browser data = lose tickets

---

## 🎯 Use Cases

### Scenario 1: Customer Reports CCTV Issue
1. Customer visits portal
2. Selects "Physical Security - CCTV"
3. Sets priority to "High"
4. Describes the issue
5. Submits form
6. **You receive email immediately**
7. You call customer and resolve issue
8. Update ticket status in admin dashboard

### Scenario 2: IT Infrastructure Problem
1. Customer reports network issue
2. Selects "IT Network"
3. Sets priority to "Critical"
4. Submits form
5. **You receive urgent email**
6. You prioritize and respond quickly
7. Track progress in admin dashboard

---

## 📞 Support

### EmailJS Support:
- Documentation: https://www.emailjs.com/docs/
- Help Center: https://support.emailjs.com/

### JEB Ticketing System:
- Setup Guide: [EMAIL_SETUP.md](EMAIL_SETUP.md)
- Full Documentation: [README.md](README.md)
- Contact your development team

---

## ✅ Checklist

Before going live:

- [ ] Sign up for EmailJS account
- [ ] Configure email service (Gmail/Outlook/etc.)
- [ ] Create email template
- [ ] Update `src/emailConfig.ts` with credentials
- [ ] Test ticket submission as admin
- [ ] Test ticket submission as customer
- [ ] Verify email notifications received
- [ ] Check email formatting and content
- [ ] Build and deploy to Cloudflare
- [ ] Test on live site
- [ ] Share customer portal URL with clients

---

## 🎉 You're All Set!

Your JEB Ticketing System now has:
- ✅ Professional admin dashboard
- ✅ Customer-facing portal
- ✅ Automatic email notifications
- ✅ Full ticket lifecycle management
- ✅ Cloudflare Pages deployment

**Next Steps:**
1. Configure EmailJS (see [EMAIL_SETUP.md](EMAIL_SETUP.md))
2. Test the system
3. Deploy to production
4. Share with your customers!
