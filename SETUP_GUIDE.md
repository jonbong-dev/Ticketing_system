# JEB Ticketing System - Setup & Configuration Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Notifications (Optional but Recommended)

Edit `src/emailConfig.ts` with your EmailJS credentials:

```typescript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'your_service_id',        // From EmailJS dashboard
  TEMPLATE_ID: 'your_template_id',      // From EmailJS dashboard
  PUBLIC_KEY: 'your_public_key',        // From EmailJS dashboard
  
  RECIPIENT_EMAIL: 'support@jebinnovations.sg',  // Your support email
  COMPANY_NAME: 'JEB Innovations & Technologies Pte Ltd',
  SUPPORT_PHONE: '+65 XXXX XXXX',
}
```

See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed EmailJS setup instructions.

### 3. Build and Deploy
```bash
npm run build
npx wrangler pages deploy dist
```

---

## 🔐 Default Login Credentials

**⚠️ IMPORTANT:** Change these credentials immediately after first login!

### Admin Account
- **Email:** `admin@jebinnovations.sg`
- **Password:** `admin123`
- **Access:** Full admin dashboard with all ticket management features

### Sample Customer Account
- **Email:** `customer@example.com`
- **Password:** `customer123`
- **Access:** Customer dashboard (sees only their own tickets)

---

## 🔒 Security Features

### Password Hashing
- All passwords are hashed using SHA-256 before storage
- Passwords are never stored in plain text
- Hashing is done client-side using Web Crypto API

### Authentication
- Role-based access control (Admin vs Customer)
- Session management via localStorage
- Automatic logout on session expiry
- Customers cannot access admin features

### Data Isolation
- Customers see only their own tickets
- Admins see all tickets
- Complete separation of concerns

---

## 📧 Email Configuration

### Option 1: EmailJS (Recommended - No Backend Required)

**Pros:**
- ✅ Works on Cloudflare Pages free tier
- ✅ No backend server needed
- ✅ 200 emails/month free
- ✅ Easy setup

**Setup:**
1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create email templates
4. Update `src/emailConfig.ts` with your credentials

**Templates Needed:**
1. **New Ticket Notification** - Sent to admin when customer creates ticket
2. **Update Notification** - Sent to customer when admin adds update

### Option 2: SMTP via Backend (Advanced)

If you need more control or higher volume:

**Requirements:**
- Cloudflare Workers (paid plan for SMTP)
- OR external backend service
- SMTP server credentials

**Setup:**
1. Create a Cloudflare Worker to handle email sending
2. Update `src/emailService.ts` to call your worker API
3. Configure SMTP credentials in worker

**Example SMTP Services:**
- SendGrid (free tier: 100 emails/day)
- Mailgun (free tier: 5,000 emails/month)
- AWS SES (pay-as-you-go)
- Your own SMTP server

---

## 👥 User Management

### Default Users
The system comes with two pre-configured users (see credentials above).

### Adding New Admin Users
Edit `src/authService.ts` and add to the `initializeUsers()` function:

```typescript
{
  id: 'admin-2',
  email: 'tech@jebinnovations.sg',
  password: 'hashed_password_here', // Use SHA-256 hash
  name: 'Tech Support',
  role: 'admin',
}
```

To generate password hash:
```javascript
// Run this in browser console
const password = 'your_password';
const encoder = new TextEncoder();
const data = encoder.encode(password);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
console.log(hashHex);
```

### Customer Registration
Customers can self-register via the login page:
1. Click "Customer Portal"
2. Click "Don't have an account? Register here"
3. Fill in registration form
4. Auto-login after registration

---

## 🎨 Customization

### Change Company Branding
Edit the following files:
- `src/LoginPage.tsx` - Landing page branding
- `src/App.tsx` - Admin dashboard header
- `src/CustomerDashboard.tsx` - Customer dashboard header

### Change Color Scheme
The app uses Tailwind CSS. Update color classes:
- Primary blue: `bg-blue-600`, `text-blue-600`
- Search for these classes and replace with your brand colors

### Add Custom Fields
Edit `src/types.ts` to add new ticket fields, then update:
- `src/App.tsx` - Admin forms
- `src/CustomerDashboard.tsx` - Customer forms
- `src/emailService.ts` - Email templates

---

## 📊 Data Storage

All data is stored in browser localStorage:
- `jeb_users` - User accounts (hashed passwords)
- `jeb_auth` - Current session
- `jeb_tickets` - All tickets
- `jeb_ticket_counter` - Ticket number counter

### Backup Data
To backup all data:
```javascript
// Run in browser console
const backup = {
  users: localStorage.getItem('jeb_users'),
  tickets: localStorage.getItem('jeb_tickets'),
  counter: localStorage.getItem('jeb_ticket_counter'),
};
console.log(JSON.stringify(backup));
// Copy the output and save to a file
```

### Restore Data
```javascript
// Run in browser console
const backup = {
  users: '...', // Paste your backup
  tickets: '...',
  counter: '...',
};
localStorage.setItem('jeb_users', backup.users);
localStorage.setItem('jeb_tickets', backup.tickets);
localStorage.setItem('jeb_ticket_counter', backup.counter);
location.reload();
```

---

## 🚨 Troubleshooting

### "Invalid email or password"
- Check if you're using the correct credentials
- Verify email and password are typed correctly
- Try clearing browser cache and localStorage

### Email notifications not working
- Check `src/emailConfig.ts` has correct credentials
- Verify EmailJS account is active
- Check EmailJS dashboard for error logs
- Ensure you haven't exceeded 200 emails/month limit

### Customers can't see their tickets
- Verify customer email matches ticket's `customerEmail` field
- Check browser console for errors
- Ensure customer is logged in with correct account

### Admin can't send updates
- Check EmailJS configuration
- Verify customer has valid email address
- Check browser console for errors

---

## 📞 Support

For technical support:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- React Documentation: https://react.dev/

---

## ✅ Pre-Deployment Checklist

- [ ] Change default admin password
- [ ] Change default customer password (or delete sample account)
- [ ] Configure EmailJS credentials
- [ ] Test customer login and registration
- [ ] Test admin login
- [ ] Test ticket creation
- [ ] Test email notifications
- [ ] Test "Send to Customer" feature
- [ ] Backup initial data
- [ ] Deploy to production
- [ ] Test on live site

---

## 🔐 Security Best Practices

1. **Change Default Passwords** - Immediately after first login
2. **Use Strong Passwords** - Minimum 12 characters, mixed case, numbers, symbols
3. **Regular Backups** - Backup localStorage data regularly
4. **Monitor EmailJS** - Check for unusual activity
5. **Update Dependencies** - Run `npm audit` and update packages regularly
6. **HTTPS Only** - Ensure site is served over HTTPS (Cloudflare does this automatically)
7. **Limit Admin Access** - Only give admin access to trusted staff
8. **Review Access Logs** - Monitor who is accessing the system

---

## 📚 Additional Documentation

- [README.md](README.md) - Main documentation
- [DUAL_PORTAL_GUIDE.md](DUAL_PORTAL_GUIDE.md) - Dual portal system guide
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - EmailJS setup guide
- [CUSTOMER_PORTAL_GUIDE.md](CUSTOMER_PORTAL_GUIDE.md) - Customer portal features

---

**Last Updated:** 2024
**Version:** 1.0.0
**Developed for:** JEB Innovations & Technologies Pte Ltd
