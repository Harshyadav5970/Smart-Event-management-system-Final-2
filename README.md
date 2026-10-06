# EventHub: Smart College Event & Fest Management System

**Author:** Harsh Yadav  
**Roll No:** 129  
**Class:** TYCS-B (Final Year B.Sc. Computer Science)  
**Department:** Computer Science  
**Academic Year:** 2025-2026  

---

## 🌟 Project Overview
**EventHub** is a production-ready college fest and event management platform designed to streamline student registrations, automate digital QR-pass generation, provide live webcam gate attendance verification with duplicate-scan prevention, and generate official downloadable PDF certificates.

The frontend is styled in a modern, organic SaaS aesthetic featuring sleek glassmorphism, responsive navigation, and intuitive viva evaluation switches.

---

## 🚀 Key Modules & Capabilities

1. **Multi-Role Authentication (RBAC):**
   - JWT-based authentication for **Student**, **Club Organizer**, and **Faculty Admin**.
   - Includes a **1-Click Viva Fast Switcher** directly on the login and navbar for effortless evaluation.

2. **Event Creation & Discovery:**
   - Categorized by **Technical**, **Cultural**, **Sports**, and **Workshop**.
   - Live filters for Free vs. Paid passes, seat capacity limits, and real-time search.

3. **Digital E-Tickets & Tamper-Proof QR Codes:**
   - Automatically generates digital passes with embedded cryptographic verification hashes using `qrcode`.
   - Printable pass cards with gate check-in status.

4. **Live Gate Webcam Scanner (`html5-qrcode`):**
   - Validates student QR passes using webcam.
   - **First scan:** Green alert (*"Entry Verified: Welcome [Student]!"*).
   - **Second scan:** Red duplicate alert (*"DUPLICATE ENTRY DETECTED! Already scanned at [Timestamp]"*).
   - Includes a **Viva Test Simulator** so the scanner can be tested instantly without requiring a webcam or second device.

5. **Automated Verified Certificate Generation (`jspdf`):**
   - When an event is concluded, eligible attendees (checked-in) can click **"Download Certificate"**.
   - Generates an official landscape certificate with college header, student credentials, and faculty signature block.

6. **Dual-Engine Resilient Database (Zero-Crash Guarantee):**
   - Automatically connects to **MongoDB** if available.
   - If MongoDB is not installed or running, it seamlessly switches to an embedded local JSON memory database, ensuring the viva presentation never crashes.

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Student** | `harsh@college.edu` | `student123` | Harsh Yadav (Roll 129), pre-registered passes, certificate download |
| **Organizer** | `techclub@college.edu` | `club123` | Tech Council & Robotics Club, Gate Scanner, Fest Analytics |
| **Admin** | `admin@college.edu` | `admin123` | Faculty Administration (HOD), Department Breakdown, Fest Roster |

*Note: You can also use the 1-Click Fast Login buttons on the login screen or in the top navigation bar.*

---

## 💻 How to Run the Project Locally

### Option A: 1-Click Launch (Recommended)
Simply double-click:
```text
START_SERVER.bat
```
*This launches both the backend API and the frontend client, and opens your browser automatically!*

### Option B: Manual Terminal Execution
```bash
# 1. Start Backend Server (Port 5000)
cd "backend"
npm start

# 2. In another terminal, start Frontend (Port 5173)
cd "frontend"
npm run dev
```

---

## 📁 Repository Directory Structure

```text
Harsh event final/
├── backend/                  # Node.js Express API & Database Models
│   ├── data/                 # Local offline JSON database (local_db.json)
│   ├── db/                   # Dual-Engine Adapter (dbAdapter.js)
│   ├── middleware/           # Auth JWT Middleware (auth.js)
│   ├── models/               # User, Event, Registration, Announcement models
│   ├── routes/               # API Controllers & Gate QR Routes
│   ├── .env                  # Environment Variables
│   ├── package.json          # Backend Dependencies
│   ├── seed.js               # Demo Database Seeder Script
│   └── server.js             # Main Express Server
├── css/                      # Production CSS Stylesheets for Static Hosting
├── frontend/                 # React.js Vite Frontend Source
│   ├── src/                  # React Components, Contexts, Pages & Utils
│   ├── package.json          # Frontend Dependencies
│   ├── tailwind.config.js    # Modern Design System Config
│   └── vite.config.js        # Vite Build & Proxy Configuration
├── js/                       # Production JavaScript Bundles
├── .gitignore                # Git Exclusions
├── .nojekyll                 # GitHub Pages Static Bypass
├── LICENSE                   # MIT License
├── README.md                 # Project Overview & Setup Documentation
├── START_SERVER.bat          # 1-Click Server & App Launcher
├── implementation_plan.md    # Technical Architecture & Viva Specification
└── index.html                # Root Standalone Web App / GitHub Pages Entry
```
