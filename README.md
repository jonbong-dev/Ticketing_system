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

### Method 1: Direct Upload (Easiest)

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to **Workers & Pages** → **Create**
4. Select **Pages** → **Upload assets**
5. Give your project a name (e.g., `jeb-ticketing`)
6. Upload the entire `dist/` folder
7. Click **Deploy site**

### Method 2: Git Integration (Recommended)

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
├── public/                   # Static assets
├── src/
│   ├── App.tsx              # Main application component
│   ├── types.ts             # TypeScript type definitions
│   ├── store.ts             # Data management (localStorage)
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.js           # Vite build configuration
└── README.md                # This file
```

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
