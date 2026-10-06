// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Main Express Application Server

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getLocalStore, isMongoActive } = require('./db/dbAdapter');
const UserModel = require('./models/User');
const seedData = require('./seed');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin requests for Vite frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware for JSON data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// College System Health & Viva Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'EventHub - Smart College Event & Fest Management System',
    author: 'Harsh Yadav',
    rollNo: '129',
    class: 'TYCS-B',
    department: 'Computer Science',
    dbEngine: isMongoActive() ? 'MongoDB (Cloud/Local)' : 'Resilient Local Storage (Zero-Crash Mode)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/announcements', announcementRoutes);

// Serve static frontend files (allows http://localhost:5000 to serve full UI!)
const fs = require('fs');
const frontendDist = path.join(__dirname, '../frontend/dist');
const rootStatic = path.join(__dirname, '..');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}
app.use(express.static(rootStatic));

// Global Error Handler (Prevents server crashes)
app.use((err, req, res, next) => {
  console.error('[EventHub Global Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Express Server
async function startServer() {
  await connectDB();

  // Auto-seed if database is currently blank for instant viva evaluation
  try {
    const userCount = await UserModel.countDocuments({});
    if (userCount === 0) {
      console.log('[EventHub] Fresh database detected. Auto-populating realistic demo records...');
      await seedData();
    }
  } catch (seedErr) {
    console.warn('[EventHub] Auto-seeding check skipped:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`[EventHub Server] Running on http://localhost:${PORT}`);
    console.log(`[Author] Harsh Yadav (Roll No: 129, TYCS-B)`);
    console.log('====================================================');
  });
}

startServer();
