# Dual-Portal System Guide

## 🎯 Overview

The JEB Ticketing System now features a **dual-portal architecture** with completely separate interfaces for customers and administrators.

---

## 🔐 Two Separate Portals

### 1️⃣ Customer Portal

**Access:** Customers log in with their own credentials

**Features:**
- ✅ View only their own tickets
- ✅ Submit new support requests
- ✅ Track ticket status in real-time
- ✅ See admin updates and notes
- ✅ Professional, branded interface
- ✅ Cannot access admin features

**Customer Login:**
- Email: `customer@example.com`
- Password: `customer123`

**Customer Registration:**
- Customers can register for new accounts
- Provide name, email, phone, company
- Auto-login after registration

---

### 2️⃣ Admin Portal

**Access:** JEB staff log in with admin credentials

**Features:**
- ✅ View ALL tickets from all customers
- ✅ Full ticket management (create, edit, delete)
- ✅ Assign tickets to technicians
- ✅ Update status and priority
- ✅ Add internal notes
- ✅ **Send email updates to customers**
- ✅ Dashboard with statistics
- ✅ Search and filter tickets

**Admin Login:**
- Email: `admin@jebinnovations.sg`
- Password: `admin123`

---

## 🚀 How It Works

### Step 1: Landing Page

When users visit the site, they see a professional landing page with two options:

```
┌─────────────────────────────────────────┐
│         JEB Innovations & Technologies  │
│         IT & Physical Security Portal   │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Customer   │  │    Admin     │    │
│  │   Portal     │  │    Portal    │    │
│  │              │  │              │    │
│  │  [Login]     │  │  [Login]     │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Step 2: Login

**Customer Flow:**
1. Click "Customer Portal"
2. Enter email and password
3. OR click "Register" to create new account
4. Redirected to Customer Dashboard

**Admin Flow:**
1. Click "Admin Portal"
2. Enter admin email and password
3. Redirected to Admin Dashboard

### Step 3: Dashboard

**Customer Dashboard:**
- See only their own tickets
- Submit new tickets
- View ticket details and updates
- See admin notes and responses

**Admin Dashboard:**
- See all tickets from all customers
- Full ticket management
- Statistics and analytics
- Send updates to customers

---

## 📧 Admin-to-Customer Communication

### Sending Updates to Customers

Admins can send email updates directly from the ticket detail view:

1. Open a ticket in admin dashboard
2. Scroll to "Notes & Updates" section
3. Type your update message
4. Click **"Send to Customer"** button (green button)
5. Email client opens with pre-filled message:
   - To: Customer's email
   - Subject: "Update on Your Support Ticket JEB-0007"
   - Body: Professional update with ticket details
6. Click Send in email client
7. Note is also saved to ticket (visible to customer)

### What Customers See

Customers can see all admin updates in their dashboard:
1. Log in to customer portal
2. Click on a ticket to expand
3. See all notes from admin team
4. Updates are clearly marked with author and timestamp

---

## 🔒 Security & Access Control

### Customer Cannot:
- ❌ See admin login page
- ❌ Access admin dashboard
- ❌ View other customers' tickets
- ❌ Modify ticket status/priority
- ❌ Delete tickets
- ❌ Assign tickets

### Admin Can:
- ✅ See all tickets
- ✅ Modify any ticket
- ✅ Delete tickets
- ✅ Assign technicians
- ✅ Update status/priority
- ✅ Send customer updates
- ✅ View customer information

---

## 👥 User Management

### Default Users

The system comes with two pre-configured users:

**Admin:**
```json
{
  "email": "admin@jebinnovations.sg",
  "password": "admin123",
  "name": "JEB Admin",
  "role": "admin"
}
```

**Customer:**
```json
{
  "email": "customer@example.com",
  "password": "customer123",
  "name": "John Doe",
  "role": "customer",
  "phone": "+65 9123 4567",
  "company": "ABC Corporation"
}
```

### Adding More Users

**For Customers:**
- Customers can self-register via the login page
- Click "Don't have an account? Register here"
- Fill in registration form
- Auto-login after registration

**For Admins:**
- Edit `src/authService.ts`
- Add new admin user to `initializeUsers()` function
- Rebuild and deploy

Example:
```typescript
{
  id: 'admin-2',
  email: 'tech@jebinnovations.sg',
  password: 'tech123',
  name: 'Tech Support',
  role: 'admin',
}
```

---

## 🎨 User Experience

### Customer Experience

1. **Professional Interface**
   - Clean, modern design
   - JEB Innovations branding
   - Easy to navigate

2. **Self-Service**
   - Submit tickets anytime
   - Track status in real-time
   - See all updates in one place

3. **Transparency**
   - See ticket progress
   - View admin notes
   - Know exactly what's happening

### Admin Experience

1. **Efficient Workflow**
   - All tickets in one place
   - Quick status updates
   - Easy assignment

2. **Communication Tools**
   - Send email updates
   - Add internal notes
   - Track all interactions

3. **Analytics**
   - Dashboard statistics
   - Ticket distribution
   - Performance metrics

---

## 📊 Data Isolation

### Customer Data
- Customers see ONLY their own tickets
- Filtered by email address or name
- Cannot access other customers' data

### Admin Data
- Admins see ALL tickets
- Full access to all customer information
- Complete ticket history

---

## 🔄 Workflow Examples

### Example 1: Customer Reports Issue

1. **Customer** logs in to customer portal
2. **Customer** submits new ticket
3. **Admin** receives email notification
4. **Admin** logs in to admin portal
5. **Admin** views ticket in dashboard
6. **Admin** assigns to technician
7. **Admin** adds note: "Technician assigned, will visit site tomorrow"
8. **Admin** clicks "Send to Customer" → Email sent
9. **Customer** sees update in their dashboard
10. **Technician** resolves issue
11. **Admin** updates status to "Resolved"
12. **Admin** sends final update to customer
13. **Customer** sees resolution in dashboard

### Example 2: Multiple Customers

**Customer A** (ABC Corporation):
- Logs in → Sees only their 3 tickets
- Submits new ticket → Ticket created
- Views updates from admin

**Customer B** (XYZ Ltd):
- Logs in → Sees only their 5 tickets
- Submits new ticket → Ticket created
- Views updates from admin

**Admin**:
- Logs in → Sees ALL 8 tickets
- Manages all tickets
- Sends updates to both customers

---

## 🛠️ Technical Details

### Authentication
- Stored in localStorage
- Session persists across browser sessions
- Logout clears session

### Data Storage
- Users: `jeb_users` (localStorage)
- Auth: `jeb_auth` (localStorage)
- Tickets: `jeb_tickets` (localStorage)

### Routing
- No authenticated user → Login page
- Customer role → Customer Dashboard
- Admin role → Admin Dashboard

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy
```bash
npx wrangler pages deploy dist
```

### Access
- Single URL for both portals
- Users choose their portal on landing page
- Example: `https://jeb-ticketing.pages.dev`

---

## ✅ Checklist

Before going live:

- [ ] Test customer login
- [ ] Test customer registration
- [ ] Test admin login
- [ ] Verify customers see only their tickets
- [ ] Verify admin sees all tickets
- [ ] Test "Send to Customer" feature
- [ ] Test logout functionality
- [ ] Update admin credentials (change from default)
- [ ] Configure email notifications (optional)
- [ ] Deploy to production

---

## 🎉 Summary

Your JEB Ticketing System now has:

✅ **Two completely separate portals**
✅ **Role-based authentication**
✅ **Customer self-service**
✅ **Admin full control**
✅ **Email communication tools**
✅ **Data isolation and security**
✅ **Professional user experience**

Customers and admins work in their own environments, with clear separation of concerns and appropriate access controls.
