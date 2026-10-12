# JEB Innovations & Technologies Pte Ltd - Ticketing System

A professional IT & Physical Security support ticketing system built with React, Vite, and Tailwind CSS. Designed for deployment on Cloudflare Pages (free tier).

![JEB Ticketing System](https://img.shields.io/badge/JEB-Innovations-blue) ![React](https://img.shields.io/badge/React-18.2-61dafb) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06b6d4)

---

## 📋 Overview

This ticketing system is designed for **JEB Innovations & Technologies Pte Ltd**, an IT Value-Added Reseller (VAR) specializing in:
- **IT Services**: Infrastructure, Networking, Software, Hardware
- **Physical Security**: CCTV Systems, Access Control, Alarm Systems

### Features
- 📊 **Dashboard** with real-time ticket statistics
- 🎫 **Full ticket lifecycle management** (Create → Track → Resolve)
- 👥 **Customer Portal** - Public-facing portal for customers to submit tickets
- 📧 **Email Notifications** - Automatic email alerts when tickets are created (via EmailJS)
- 🔍 **Search & Filter** by status, priority, and category
- 📝 **Notes & Updates** on each ticket
- 🏢 **Customer & site information** tracking
- 🎨 **Clean, responsive UI** optimized for desktop and mobile
- 💾 **Local Storage persistence** (no backend required for free tier)

---

## 🚀 Installation Guide

### Prerequisites
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **VS Code** (recommended) ([Download](https://code.visualstudio.com/))

### Step 1: Clone / Download the Project

```bash
# If using Git
git clone <repository-url>
cd jeb-ticketing-system

# Or simply extract the ZIP file and navigate to the folder
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

---

## 💻 Running in VS Code

### Option A: Using the Terminal
1. Open the project folder in VS Code
2. Open the integrated terminal (`Ctrl + `` ` `` or `Cmd + `` ` ``)
3. Run `npm run dev`

### Option B: Using VS Code Launch Configuration
The project includes a `.vscode/launch.json` file. To use it:
1. Open the project in VS Code
2. Press `F5` or go to **Run → Start Debugging**
3. A browser window will open automatically

### Option C: Using VS Code Tasks
1. Open the project in VS Code
2. Go to **Terminal → Run Task...**
3. Select "Dev Server" to start the development server

---

## ☁️ Deploying to Cloudflare Pages (Free Tier)

### ⚠️ "Upload exceeds 1000 files" Error?

If you see this error, you're uploading the **entire project folder** instead of just the `dist/` folder.

**Solution**: Use the Wrangler CLI (Method 1 below) or make sure you're uploading ONLY the `dist/` folder in the dashboard.

The `dist/` folder contains only 3-5 files (HTML, JS, CSS) and will upload without issues.

---

### Method 1: Using Wrangler CLI (Recommended)

The project includes a `wrangler.jsonc` configuration file for easy CLI deployment.

#### Step 1: Install Wrangler

```bash
# Install globally
npm install -g wrangler

# Or use npx (no install needed)
npx wrangler --version
```

#### Step 2: Login to Cloudflare

```bash
npx wrangler login
```
This opens a browser window to authenticate with your Cloudflare account.

#### Step 3: Build & Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist
```

That's it! Your site will be live at `https://jeb-ticketing-system.pages.dev`

#### Local Preview (Optional)

To preview the production build locally before deploying:

```bash
npx wrangler pages dev dist
```
Opens at `http://localhost:8788`

#### Useful Wrangler Commands

```bash
# Check deployment status
npx wrangler pages project list

# Delete a deployment
npx wrangler pages deployment delete <deployment-id>

# View project details
npx wrangler pages project get jeb-ticketing-system
```

### Method 2: Direct Upload via Dashboard

> ⚠️ **IMPORTANT**: You must upload ONLY the `dist/` folder, NOT the entire project!

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to **Workers & Pages** → **Create**
4. Select **Pages** → **Upload assets**
5. Give your project a name (e.g., `jeb-ticketing`)
6. **Drag and drop ONLY the `dist/` folder** (not the project root!)
   - Navigate into your project folder
   - Select the `dist/` folder itself
   - Drag it into the upload area
7. Click **Deploy site**

#### ⚠️ "Upload exceeds 1000 files" Error?

This error means you're uploading the wrong folder. Make sure:
- ✅ You're uploading the **`dist/`** folder (contains ~3-5 files)
- ❌ NOT the project root folder (contains thousands of files from node_modules)

The `dist/` folder should contain only:
```
dist/
├── index.html
└── assets/
    ├── index-XXXXX.js
    └── index-XXXXX.css
```

### Method 3: Git Integration (Auto-deploy on Push)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to **Workers & Pages** → **Create**
4. Select **Pages** → **Connect to Git**
5. Select your repository
6. Configure build settings:
   - **Framework preset**: Select "Vite" (or "None")
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
7. Click **Save and Deploy**

### Cloudflare Free Tier Limits
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ Custom domain support
- ✅ Automatic HTTPS

---

## 📁 Project Structure

```
jeb-ticketing-system/
├── .vscode/
│   ├── launch.json          # VS Code debug configuration
│   └── tasks.json           # VS Code task automation
├── src/
│   ├── App.tsx              # Main application component (Admin Dashboard)
│   ├── CustomerPortal.tsx   # Customer-facing ticket submission portal
│   ├── emailConfig.ts       # EmailJS configuration
│   ├── emailService.ts      # Email notification service
│   ├── types.ts             # TypeScript type definitions
│   ├── store.ts             # Data management (localStorage)
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.js           # Vite build configuration
├── wrangler.jsonc           # Cloudflare Pages configuration
├── deploy.sh                # Deployment script (Mac/Linux)
├── deploy.bat               # Deployment script (Windows)
├── EMAIL_SETUP.md           # EmailJS setup guide
└── README.md                # This file
```

---

## 👥 Customer Portal

The system includes a customer-facing portal where customers can submit support tickets without needing admin access.

### Accessing the Customer Portal
1. In the admin dashboard, click the **"Customer Portal"** button in the top-right corner
2. Share the URL with your customers (they can bookmark it)
3. Customers fill out the form with their contact details and issue description
4. Upon submission:
   - A ticket is automatically created in the system
   - An email notification is sent to your support team
   - The customer receives a ticket number for reference

### Customer Portal Features
- ✅ Clean, professional interface branded for JEB Innovations
- ✅ Form validation for required fields
- ✅ Category selection (IT & Physical Security)
- ✅ Priority level selection
- ✅ Automatic ticket number generation
- ✅ Email notification to support team
- ✅ Confirmation screen with next steps

---

## 📧 Email Notifications

The system can send email notifications when new tickets are created. This uses **EmailJS** (a client-side email service that works on Cloudflare Pages free tier).

### Setup Email Notifications

1. **Sign up for EmailJS** (free tier: 200 emails/month)
   - Visit [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create a free account

2. **Configure Email Service**
   - Add an email service (Gmail, Outlook, SendGrid, etc.)
   - Create an email template
   - Get your Service ID, Template ID, and Public Key

3. **Update Configuration**
   - Open `src/emailConfig.ts`
   - Replace the placeholder values with your EmailJS credentials:
   ```typescript
   export const EMAIL_CONFIG = {
     SERVICE_ID: 'your_service_id',
     TEMPLATE_ID: 'your_template_id',
     PUBLIC_KEY: 'your_public_key',
     RECIPIENT_EMAIL: 'support@jebinnovations.sg',
     COMPANY_NAME: 'JEB Innovations & Technologies Pte Ltd',
     SUPPORT_PHONE: '+65 XXXX XXXX',
   }
   ```

4. **Rebuild and Deploy**
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

### Detailed Setup Guide

For step-by-step instructions with template examples, see **[EMAIL_SETUP.md](EMAIL_SETUP.md)**

### Email Template Variables

Your EmailJS template should include these variables:
- `{{to_email}}` - Recipient email (your support email)
- `{{from_name}}` - Customer name
- `{{from_email}}` - Customer email
- `{{from_phone}}` - Customer phone
- `{{ticket_number}}` - Ticket number (e.g., JEB-0001)
- `{{ticket_title}}` - Issue title
- `{{ticket_description}}` - Issue description
- `{{ticket_category}}` - Category (IT Infrastructure, CCTV, etc.)
- `{{ticket_priority}}` - Priority level (Critical, High, Medium, Low)
- `{{site_location}}` - Site address
- `{{company_name}}` - Your company name
- `{{support_phone}}` - Your support phone number

### Without Email Configuration

If you don't configure EmailJS:
- ✅ Tickets are still created and stored locally
- ✅ Customer portal still works
- ⚠️ No email notifications are sent
- ⚠️ You'll see a warning message in the customer portal

---

## 🔧 Configuration

### Adding Team Members
Edit the `assignedTo` dropdown options in `src/App.tsx` (search for "John Tan" to find the select elements).

### Customizing Categories
Edit the `TicketCategory` type in `src/types.ts` and update the corresponding labels in `src/App.tsx`.

### Changing Branding
- **Company Name**: Edit the sidebar section in `src/App.tsx`
- **Colors**: The app uses Tailwind CSS classes. Search for `bg-blue-600` to change the primary color.
- **Logo**: Replace the "JEB" text badge in the sidebar with your logo image.

---

## 📊 Data Storage

This application uses **localStorage** for data persistence. This means:
- ✅ Data persists across browser sessions
- ✅ No backend server required
- ✅ Works perfectly on Cloudflare Pages free tier
- ⚠️ Data is stored per-browser (not shared across devices)
- ⚠️ Clearing browser data will remove tickets

### Sample Data
The system comes pre-loaded with 6 sample tickets demonstrating various scenarios. To clear sample data:
1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Delete `jeb_tickets` and `jeb_ticket_counter` keys
4. Refresh the page

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| Lucide React | Icons |
| date-fns | Date formatting |
| uuid | Unique IDs |

---

## 📞 Support

For issues or questions about this ticketing system, contact the development team at JEB Innovations & Technologies Pte Ltd.

---

## 📄 License

Proprietary - JEB Innovations & Technologies Pte Ltd © 2024
