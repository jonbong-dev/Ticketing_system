# JEB Ticketing System - Setup Guide

## 🚀 First-Time Setup

### Step 1: Deploy the Application

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist
```

### Step 2: Create Admin Account

On first visit, you'll see the **Setup Page**:

1. **Visit your deployed URL** (e.g., `https://your-app.pages.dev`)
2. **You'll see the Welcome screen**
3. **Click "Create Admin Account"**
4. **Fill in the form:**
   - **Admin Name:** Your name (e.g., "John Tan")
   - **Admin Email:** Your email (e.g., `admin@jebinnovations.sg`)
   - **Password:** Choose a strong password (minimum 6 characters)
5. **Click "Create Admin Account"**
6. **You'll see a success message** with your credentials
7. **Click "Continue to Login"**

### Step 3: Login

1. **You'll be on the Login Page**
2. **Click "Admin Portal"**
3. **Enter your credentials:**
   - Email: (the email you just set)
   - Password: (the password you just set)
4. **Click "Login"**
5. **You're in!** Welcome to the Admin Dashboard

### Step 4: Configure Email (Optional but Recommended)

1. **Click "Settings"** in the top-right header
2. **Choose email service:**
   - **EmailJS** (recommended for Cloudflare) - See EMAIL_SETUP.md
   - **SMTP** (requires backend) - See ADMIN_SETTINGS_GUIDE.md
3. **Configure credentials**
4. **Click "Save Configuration"**
5. **Click "Test Configuration"** to verify

---

## 🔐 Security Notes

### No Default Credentials
- ✅ **No hardcoded passwords** - You create your own admin account
- ✅ **First-run setup** - Ensures only you have access
- ✅ **Strong passwords** - Minimum 6 characters recommended
- ✅ **Password hashing** - SHA-256 encryption

### Best Practices
1. **Use a strong password:**
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - No common words or patterns

2. **Keep credentials secure:**
   - Don't share admin credentials
   - Use a password manager
   - Enable 2FA on your email account

3. **Regular maintenance:**
   - Change password periodically
   - Monitor login activity
   - Backup localStorage data

---

## 📧 Email Configuration

### EmailJS (Recommended)

**Pros:**
- ✅ Works on Cloudflare Pages free tier
- ✅ No backend server needed
- ✅ 200 emails/month free
- ✅ Easy setup

**Setup:**
1. Sign up at https://www.emailjs.com/
2. Create email service (Gmail, Outlook, etc.)
3. Create email templates
4. Configure in Admin Settings
5. Test configuration

**See:** [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed instructions

### SMTP (Advanced)

**Pros:**
- ✅ Full control
- ✅ Higher volume
- ✅ Custom email servers

**Requirements:**
- Backend server or Cloudflare Worker
- SMTP credentials

**See:** [ADMIN_SETTINGS_GUIDE.md](ADMIN_SETTINGS_GUIDE.md) for detailed instructions

---

## 👥 Adding Users

### Admin Users
Currently, only one admin account can be created during setup. To add more admins:
1. Edit the code to add additional admin users
2. Or share the admin credentials securely

### Customer Users
Customers can self-register:
1. Go to login page
2. Click "Customer Portal"
3. Click "Don't have an account? Register here"
4. Fill in registration form
5. Auto-login after registration

---

## 🔄 Resetting the System

If you need to start fresh (e.g., forgot admin password):

### Option 1: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Delete all `jeb_*` keys
4. Refresh the page
5. Setup page will appear again

### Option 2: Clear via Console
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

**⚠️ Warning:** This will delete all tickets and users!

---

## 📊 Data Storage

All data is stored in browser localStorage:
- `jeb_users` - User accounts (hashed passwords)
- `jeb_auth` - Current session
- `jeb_tickets` - All tickets
- `jeb_ticket_counter` - Ticket number counter
- `jeb_email_config` - Email configuration

### Backup Data
```javascript
// Run in browser console
const backup = {
  users: localStorage.getItem('jeb_users'),
  tickets: localStorage.getItem('jeb_tickets'),
  counter: localStorage.getItem('jeb_ticket_counter'),
  emailConfig: localStorage.getItem('jeb_email_config'),
};
console.log(JSON.stringify(backup));
// Copy and save to a file
```

### Restore Data
```javascript
// Run in browser console
const backup = {
  users: '...', // Paste your backup
  tickets: '...',
  counter: '...',
  emailConfig: '...',
};
localStorage.setItem('jeb_users', backup.users);
localStorage.setItem('jeb_tickets', backup.tickets);
localStorage.setItem('jeb_ticket_counter', backup.counter);
localStorage.setItem('jeb_email_config', backup.emailConfig);
location.reload();
```

---

## ✅ Pre-Launch Checklist

- [ ] Deploy to Cloudflare Pages
- [ ] Create admin account via setup page
- [ ] Login successfully
- [ ] Configure email service (EmailJS or SMTP)
- [ ] Test email notifications
- [ ] Test customer registration
- [ ] Test ticket creation
- [ ] Test forgot password feature
- [ ] Backup initial data
- [ ] Document admin credentials securely

---

## 🆘 Troubleshooting

### "Invalid credentials" error
- Make sure you're using the credentials you created during setup
- Check for typos in email/password
- Try clearing browser cache
- If forgot password, use "Forgot Password" feature

### Setup page doesn't appear
- Clear localStorage (see Resetting the System above)
- Refresh the page
- Check browser console for errors

### Email not sending
- Check email configuration in Admin Settings
- Verify EmailJS/SMTP credentials
- Check EmailJS dashboard for errors
- Test configuration again

### Can't access admin features
- Make sure you logged in as admin (not customer)
- Check that you created an admin account during setup
- Verify you're on the admin portal, not customer portal

---

## 📚 Additional Documentation

- **[README.md](README.md)** - Main documentation
- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - EmailJS setup guide
- **[ADMIN_SETTINGS_GUIDE.md](ADMIN_SETTINGS_GUIDE.md)** - Admin settings and SMTP
- **[DUAL_PORTAL_GUIDE.md](DUAL_PORTAL_GUIDE.md)** - Dual portal system
- **[ADMIN_CREDENTIALS_AND_FORGOT_PASSWORD.md](ADMIN_CREDENTIALS_AND_FORGOT_PASSWORD.md)** - Password reset
- **[SECURITY_UPDATES.md](SECURITY_UPDATES.md)** - Security features

---

## 🎯 Quick Start Summary

1. **Deploy:** `npm run build && npx wrangler pages deploy dist`
2. **Setup:** Visit URL → Create admin account
3. **Login:** Use your new credentials
4. **Configure:** Set up email in Settings
5. **Test:** Create test ticket, verify email
6. **Go Live:** Share customer portal URL

---

**Last Updated:** 2024
**Version:** 1.4.0 (First-Time Setup)
**Status:** ✅ Complete and Secure
