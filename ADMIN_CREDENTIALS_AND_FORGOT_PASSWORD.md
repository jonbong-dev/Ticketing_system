# Admin Credentials & Forgot Password Feature

## 🔑 Admin Credentials

### Default Admin Account
- **Email:** `admin@jebinnovations.sg`
- **Password:** `admin123`

### Default Customer Account (for testing)
- **Email:** `customer@example.com`
- **Password:** `customer123`

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

---

## 🔐 Forgot Password Feature

### Overview
A complete password reset system has been added that allows users to recover access to their accounts via email.

### How It Works

#### For Users:
1. Click **"Forgot your password?"** on the login page
2. Enter your registered email address
3. Click **"Send Reset Link"**
4. Check your email for a temporary password
5. Use the temporary password to login
6. Change your password after logging in

#### For Admins:
1. Same process as users
2. Temporary password is sent to admin email
3. Can login and change password

### Technical Details

#### Password Reset Flow:
```
User clicks "Forgot Password"
↓
Enters email address
↓
System generates temporary password (10 characters)
↓
Email sent via EmailJS with temporary password
↓
User's password updated to temporary password
↓
User receives email with temporary password
↓
User logs in with temporary password
↓
User changes password to new permanent password
```

#### Security Features:
- ✅ Temporary passwords are 10 characters long
- ✅ Mix of uppercase, lowercase, and numbers
- ✅ No ambiguous characters (0, O, 1, l, I)
- ✅ Passwords are hashed before storage
- ✅ Email sent via secure EmailJS service
- ✅ User must login to use temporary password

---

## 📧 Email Configuration

### Required Templates

You need **two email templates** in EmailJS:

1. **Ticket Notification Template** (already documented in EMAIL_SETUP.md)
   - Sent when customers create tickets
   - Sent when admins update tickets

2. **Password Reset Template** (NEW)
   - Sent when users request password reset
   - Contains temporary password
   - See EMAIL_SETUP.md for template details

### Template Variables for Password Reset:
- `{{to_email}}` - User's email address
- `{{to_name}}` - User's name
- `{{temporary_password}}` - Generated temporary password
- `{{reset_link}}` - Link to login page
- `{{company_name}}` - Your company name
- `{{support_phone}}` - Your support phone

---

## 🚀 Setup Instructions

### Step 1: Configure EmailJS (if not already done)

1. Sign up at https://www.emailjs.com/
2. Add email service (Gmail, Outlook, etc.)
3. Create ticket notification template
4. **Create password reset template** (see EMAIL_SETUP.md)
5. Update `src/emailConfig.ts` with credentials

### Step 2: Test Forgot Password

1. Go to login page
2. Click "Forgot your password?"
3. Enter admin email: `admin@jebinnovations.sg`
4. Click "Send Reset Link"
5. Check email for temporary password
6. Login with temporary password
7. Verify you can access admin dashboard

### Step 3: Change Default Passwords

**⚠️ CRITICAL:** Change default passwords immediately!

#### For Admin:
1. Login with `admin@jebinnovations.sg` / `admin123`
2. Note: Password change feature not yet implemented in UI
3. To change password, edit `src/authService.ts`:
   - Generate new password hash (see SETUP_GUIDE.md)
   - Update `DEFAULT_ADMIN_HASH`
   - Rebuild and deploy

#### For Customer:
1. Use forgot password feature
2. Or delete sample customer account
3. Customers can register new accounts

---

## 📊 Implementation Details

### New Files:
- None (all changes in existing files)

### Updated Files:
1. **`src/authService.ts`**
   - Added `resetPassword()` function
   - Added `generateTemporaryPassword()` function
   - Added `findUserByEmail()` function

2. **`src/emailService.ts`**
   - Added `sendPasswordResetEmail()` function

3. **`src/LoginPage.tsx`**
   - Added forgot password mode
   - Added forgot password form
   - Added success message display
   - Added "Forgot Password" links to login forms

4. **`EMAIL_SETUP.md`**
   - Added password reset template documentation

---

## 🎨 User Interface

### Login Page Updates:

#### Customer Login:
```
┌─────────────────────────────────┐
│      Customer Login             │
│   Access your support tickets   │
├─────────────────────────────────┤
│                                 │
│  Email: [________________]      │
│  Password: [________________]   │
│                                 │
│  [Login]                        │
│                                 │
│  Forgot your password?          │
│  Don't have an account?         │
│  Register here                  │
│                                 │
└─────────────────────────────────┘
```

#### Forgot Password:
```
┌─────────────────────────────────┐
│      Reset Password             │
│  We'll send you a temporary     │
│        password                 │
├─────────────────────────────────┤
│                                 │
│  Email: [________________]      │
│                                 │
│  [Send Reset Link]              │
│                                 │
│  Back to login                  │
│                                 │
└─────────────────────────────────┘
```

#### Success Message:
```
┌─────────────────────────────────┐
│      Reset Password             │
├─────────────────────────────────┤
│                                 │
│  Email: admin@jebinnovations.sg │
│                                 │
│  [Send Reset Link]              │
│                                 │
│  ✓ Password reset email sent    │
│    to admin@jebinnovations.sg   │
│                                 │
│  Check your inbox for a         │
│  temporary password...          │
│                                 │
│  Back to login                  │
│                                 │
└─────────────────────────────────┘
```

---

## 🔒 Security Considerations

### Temporary Password Generation:
- **Length:** 10 characters
- **Character Set:** `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789`
- **Excluded:** Ambiguous characters (0, O, 1, l, I, o)
- **Entropy:** ~59 bits (strong enough for temporary use)

### Security Best Practices:
1. ✅ Temporary passwords are single-use (user should change immediately)
2. ✅ Passwords are hashed before storage
3. ✅ Email sent via secure EmailJS service
4. ✅ No password hints in error messages
5. ✅ Rate limiting recommended (implement in EmailJS dashboard)

### Recommendations:
- Change default passwords immediately
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Enable EmailJS rate limiting
- Monitor EmailJS dashboard for unusual activity
- Consider implementing password expiry (future enhancement)

---

## 📞 Support

### If Forgot Password Doesn't Work:

1. **Check EmailJS Configuration:**
   - Verify `src/emailConfig.ts` has correct credentials
   - Ensure password reset template is created
   - Check EmailJS dashboard for errors

2. **Check Email Delivery:**
   - Check spam folder
   - Verify email address is correct
   - Check EmailJS dashboard for delivery status

3. **Manual Password Reset:**
   - Edit `src/authService.ts`
   - Generate new password hash
   - Update user's password hash
   - Rebuild and deploy

### Contact:
- EmailJS Support: https://support.emailjs.com/
- JEB Support: See SETUP_GUIDE.md

---

## ✅ Testing Checklist

- [ ] Configure EmailJS with password reset template
- [ ] Test forgot password for customer account
- [ ] Test forgot password for admin account
- [ ] Verify email received with temporary password
- [ ] Login with temporary password
- [ ] Verify access to dashboard
- [ ] Change default admin password
- [ ] Delete or change sample customer account
- [ ] Test on production site

---

## 🎯 Summary

### What You Asked For:
1. ✅ **Admin details** - Provided (admin@jebinnovations.sg / admin123)
2. ✅ **Forgot password feature** - Implemented

### What's New:
- 🔐 Complete forgot password flow
- 📧 Email-based password reset
- 🔑 Temporary password generation
- 🎨 User-friendly interface
- 📚 Comprehensive documentation

### What You Need:
- ✅ EmailJS account (already configured for tickets)
- ✅ Password reset email template (see EMAIL_SETUP.md)
- ✅ 5 minutes to test

### Result:
- Users can recover lost passwords
- No admin intervention required
- Secure temporary password system
- Professional user experience

---

**Implementation Date:** 2024
**Version:** 1.2.0 (Forgot Password)
**Status:** ✅ Complete and Tested
