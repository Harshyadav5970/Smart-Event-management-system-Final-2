# EventHub: Smart College Event & Fest Management System
## Project Implementation Plan & Technical Architecture Specification

**Student Author:** Harsh Yadav  
**Roll No:** 129  
**Class:** TYCS-B (Final Year B.Sc. Computer Science)  
**Department:** Department of Computer Science & Information Technology  
**Academic Year:** 2025–2026  

---

## 1. Executive Summary & Problem Statement

College fests and technical symposia traditionally suffer from manual ticket distribution, long physical queues at campus venue gates, lack of attendance tracking, and delayed distribution of physical participation certificates.

**EventHub** resolves these bottlenecks by introducing:
1. **Multi-Role RBAC:** Dedicated workspaces for Students, Club Leads, and Faculty Administrators.
2. **Cryptographic E-Ticketing:** Digital entry passes embedding HMAC/checksum verified JSON QR payloads.
3. **Live Gate Webcam Scanning:** Rapid gate admittance via `html5-qrcode` with automated duplicate check-in prevention.
4. **Automated Vector PDF Certificates:** Instantly downloadable participation certificates rendered client-side via `jspdf`.
5. **Resilient Dual-Engine Persistence:** MongoDB Mongoose connectivity with automatic offline fallback to embedded JSON memory storage for crash-proof demonstration.

---

## 2. System Architecture & Component Mapping

```
+-----------------------------------------------------------------------------------+
|                                EVENTHUB CLIENT                                    |
|               (React 18, Vite, Tailwind CSS, Lucide-React Icons)                  |
+-----------------------------------------------------------------------------------+
        |                                       |                                   |
 [Browsing & Passes]                     [Live Scanner]                    [PDF Generator]
   EventCard.jsx                       QRScannerModal.jsx               certificateGenerator.js
   TicketCard.jsx                       (html5-qrcode)                         (jspdf)
        |                                       |                                   |
        +-------------------+-------------------+-----------------------------------+
                            |  HTTP JSON API (Fetch + JWT Auth)
                            v
+-----------------------------------------------------------------------------------+
|                                EXPRESS.JS BACKEND                                 |
|                 (REST Controllers, Auth Middleware, JWT Engine)                   |
+-----------------------------------------------------------------------------------+
        |                     |                     |                     |
   /api/auth              /api/events           /api/tickets        /api/analytics
(Signup, Login)        (CRUD, Categories)    (Register, Verify)   (Stats, Revenue)
        |                     |                     |                     |
        +---------------------+---------------------+---------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                        DUAL-ENGINE DATABASE ADAPTER                               |
|        Mode A: MongoDB (Mongoose)  <--->  Mode B: Local JSON Store (Failsafe)     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Database Schema Specifications

### 3.1 User Schema (`backend/models/User.js`)
- `name` (String, Required)
- `email` (String, Unique, Indexed)
- `password` (String, Hashed using bcryptjs salt rounds = 10)
- `role` (Enum: `'student'`, `'organizer'`, `'admin'`)
- `rollNo` (String, e.g. "129")
- `department` (String, e.g. "Computer Science")
- `year` (String, e.g. "TYCS-B")
- `phone` (String)

### 3.2 Event Schema (`backend/models/Event.js`)
- `title` (String, Required)
- `description` (String)
- `category` (Enum: `'Technical'`, `'Cultural'`, `'Sports'`, `'Workshop'`)
- `date` (String, ISO format)
- `time` (String)
- `venue` (String)
- `fee` (Number, 0 for Free)
- `maxSeats` (Number, Capacity)
- `registeredCount` (Number, Tracked dynamically)
- `clubName` (String)
- `status` (Enum: `'Upcoming'`, `'Ongoing'`, `'Completed'`)

### 3.3 Registration Schema (`backend/models/Registration.js`)
- `ticketId` (String, Unique alphanumeric, e.g. `EH-2026-X8K1`)
- `eventId` (String, Ref Event)
- `studentId` (String, Ref User)
- `studentName` (String)
- `studentEmail` (String, Enforced unique per event)
- `studentRoll` (String)
- `studentDept` (String)
- `qrCodeData` (String, Base64 Data URL)
- `verificationHash` (String, Cryptographic payload)
- `checkInStatus` (Boolean, Default: false)
- `scannedAt` (Date / Timestamp)
- `scannedBy` (String)

---

## 4. Key Security & Verification Features

### 4.1 Single Pass Per Email Policy
To prevent ticket hoarding, students can register multiple times (for friends or other events), but **only 1 pass is allowed per email address per event**. Re-registration attempts return HTTP 409 Conflict.

### 4.2 Gate Duplicate Scan Prevention
When an organizer scans a ticket QR at the venue entrance:
- **First Scan:** Validates record, flips `checkInStatus` to `true`, records `scannedAt` timestamp, and returns a **Green Verified Alert**.
- **Subsequent Scans:** Detects that `checkInStatus === true` and triggers a high-priority **Red Warning Alert** indicating duplicate entry with original scan timestamp.

---

## 5. Viva Evaluation Frequently Asked Questions

**Q1: How does the QR code verify authentic student entry?**  
*A:* Each ticket embeds an encrypted JSON payload containing `ticketId`, `studentId`, `eventId`, and a tamper-proof verification checksum. When scanned by the gate webcam, the payload is verified against the database.

**Q2: What happens if MongoDB is offline on the evaluator's machine?**  
*A:* The `dbAdapter.js` module auto-detects database connectivity within 1.8 seconds. If MongoDB is absent, it seamlessly redirects all operations to an embedded local JSON memory engine (`local_db.json`) ensuring 100% crash-free demonstration.

**Q3: How are certificates unlocked?**  
*A:* Once an event concludes and an attendee's gate check-in status is marked verified (`checkInStatus === true`), the system enables the **"Download Verified Certificate"** button, dynamically generating an A4 landscape vector PDF via `jspdf`.
