# 🔧 Troubleshooting Login Issues

## ❌ Problem: "Wrong Password" Error

If you're getting "Invalid email or password" even after creating an admin account, follow these steps:

---

## ✅ Quick Fix (Recommended)

### Step 1: Reset the System

**Option A: Using the Reset Button**
1. Go to the login page
2. Scroll to the bottom
3. Click **"Reset System (Start Fresh)"**
4. Confirm the reset
5. The setup page will appear
6. Create a new admin account

**Option B: Using Browser Console**
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Paste this code and press Enter:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
4. The setup page will appear
5. Create a new admin account

**Option C: Using Browser DevTools**
1. Press `F12` to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** on the left
4. Click on your domain
5. Right-click and select **"Clear all"** or delete all `jeb_*` keys
6. Refresh the page
7. The setup page will appear

---

## 🔍 Debug with Console Logs

The system now has debug logging enabled. Here's how to use it:

### Step 1: Open Browser Console
1. Press `F12` to open Developer Tools
2. Go to **Console** tab

### Step 2: Try to Login
1. Enter your email and password
2. Click "Login"
3. Look at the console output

### Step 3: Check the Output

You should see something like:
```
Attempting login with: {email: "admin@example.com", password: "mypassword"}
Available users: [{id: "admin-1", email: "admin@example.com", password: "abc123...", name: "Admin", role: "admin"}]
Looking for email: admin@example.com
User found: {id: "admin-1", email: "admin@example.com", ...}
Stored password hash: abc123def456...
Password verification result: true (or false)
Login result: {id: "admin-1", ...} (or null)
```

### Step 4: Interpret the Results

**If you see "User not found":**
- The email you entered doesn't match any user
- Check for typos in the email
- The user might not have been created during setup
- **Solution:** Reset the system and create a new admin account

**If you see "Password verification failed":**
- The password hash doesn't match
- You might be using the wrong password
- The password might have been corrupted
- **Solution:** Reset the system and create a new admin account

**If you see "Password verification result: true" but still can't login:**
- There's a bug in the authentication flow
- Check the browser console for errors
- **Solution:** Reset the system and try again

---

## 🎯 Common Issues and Solutions

### Issue 1: Old Data in localStorage
**Symptom:** Login fails even with correct credentials
**Cause:** Old data from previous attempts is interfering
**Solution:** 
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

### Issue 2: Wrong Email/Password
**Symptom:** "User not found" or "Password verification failed"
**Cause:** Typo or using old credentials
**Solution:** 
- Double-check the email and password
- Use the exact credentials you created during setup
- If you forgot, reset the system and create new credentials

### Issue 3: Setup Page Not Appearing
**Symptom:** Goes straight to login page instead of setup
**Cause:** localStorage has user data
**Solution:**
```javascript
// Run in browser console
localStorage.removeItem('jeb_users');
location.reload();
```

### Issue 4: Password Hash Mismatch
**Symptom:** Password verification always fails
**Cause:** Hash function issue or data corruption
**Solution:** Reset the system completely
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

---

## 📋 Step-by-Step Reset Guide

### Complete Reset (Recommended)

1. **Open your deployed site**
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Paste this code:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```
5. **Press Enter**
6. **Wait for the page to reload**
7. **You should see the Setup Page**
8. **Click "Create Admin Account"**
9. **Fill in the form:**
   - Admin Name: Your name
   - Admin Email: Your email (e.g., `admin@jebinnovations.sg`)
   - Password: A strong password (minimum 6 characters)
10. **Click "Create Admin Account"**
11. **Note your credentials**
12. **Click "Continue to Login"**
13. **Login with your new credentials**

### Verify It Works

After logging in:
1. You should see the Admin Dashboard
2. Click "Settings" to configure email
3. Try creating a test ticket
4. Check if email notifications work

---

## 🔐 Password Requirements

When creating your admin account:
- ✅ Minimum 6 characters
- ✅ Can include letters, numbers, and symbols
- ✅ Case-sensitive
- ✅ No maximum length
- ⚠️ Remember your password - there's no way to recover it without email configured

**Recommendations:**
- Use a password manager
- Write down your credentials securely
- Use a strong, unique password
- Example: `Jeb@Admin2024!` or `Support#Ticket$2024`

---

## 🆘 Still Having Issues?

### Check These:

1. **Browser Console Errors**
   - Press F12
   - Look for red error messages
   - Share the error message for help

2. **Network Issues**
   - Make sure you're connected to the internet
   - Check if the site is loading correctly
   - Try a different browser

3. **Browser Compatibility**
   - Use Chrome, Firefox, or Edge
   - Make sure JavaScript is enabled
   - Clear browser cache

4. **localStorage Support**
   - Make sure your browser supports localStorage
   - Try in incognito/private mode
   - Check browser settings

### Get Help:

If you're still having issues:
1. Open browser console (F12)
2. Try to login
3. Copy all console output
4. Share the output for debugging

---

## 📊 What the Console Logs Mean

### Successful Login Flow:
```
Attempting login with: {email: "admin@example.com", password: "password123"}
Available users: [Array with 1 user]
Looking for email: admin@example.com
User found: {id: "admin-1", email: "admin@example.com", ...}
Stored password hash: a1b2c3d4e5f6...
Password verification result: true
Login result: {id: "admin-1", email: "admin@example.com", ...}
```

### Failed Login - User Not Found:
```
Attempting login with: {email: "wrong@email.com", password: "password123"}
Available users: [Array with 1 user]
Looking for email: wrong@email.com
User not found
Login result: null
```

### Failed Login - Wrong Password:
```
Attempting login with: {email: "admin@example.com", password: "wrongpass"}
Available users: [Array with 1 user]
Looking for email: admin@example.com
User found: {id: "admin-1", email: "admin@example.com", ...}
Stored password hash: a1b2c3d4e5f6...
Password verification result: false
Password verification failed
Login result: null
```

---

## ✅ Success Checklist

After resetting and creating a new admin account:

- [ ] Setup page appeared
- [ ] Created admin account successfully
- [ ] Noted down credentials
- [ ] Logged in successfully
- [ ] Can see Admin Dashboard
- [ ] Can access Settings
- [ ] Can create tickets
- [ ] Can view ticket list

---

## 🎯 Summary

**Most Common Solution:**
```javascript
// Run in browser console (F12)
localStorage.clear();
location.reload();
```

Then:
1. Create new admin account
2. Note your credentials
3. Login with new credentials
4. It should work!

**If it still doesn't work:**
- Check browser console for errors
- Try a different browser
- Clear browser cache
- Try incognito/private mode

---

**Last Updated:** 2024
**Version:** 1.4.1 (Debug Logging Added)
**Status:** ✅ Debug Mode Enabled
