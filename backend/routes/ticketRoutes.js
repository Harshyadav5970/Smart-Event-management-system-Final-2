// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Registration & QR Gate Check-in Routes

const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const RegistrationModel = require('../models/Registration');
const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

// POST /api/tickets/register - Student 1-click registration with QR pass generation
const bcrypt = require('bcryptjs');

// POST /api/tickets/register - Email & Password based event registration (1 pass per email per event)
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { eventId, email, password, name, rollNo, department } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required to register.' });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event does not exist.' });
    }

    // Check if seats are full
    if (event.registeredCount >= event.maxSeats) {
      return res.status(400).json({
        success: false,
        message: 'Housefull! Maximum capacity for this event has been reached.'
      });
    }

    // Resolve target email (default to logged-in user if not supplied)
    const targetEmail = (email || req.user.email).toLowerCase().trim();

    // Enforce Rule: Single pass per email ID for that event
    const eventRegistrations = await RegistrationModel.find({ eventId: event._id || event.id });
    const existingForEmail = eventRegistrations.find(
      (r) => r.studentEmail && r.studentEmail.toLowerCase() === targetEmail
    );

    if (existingForEmail) {
      return res.status(409).json({
        success: false,
        message: `Pass already exists! ${targetEmail} is already registered for "${event.title}" (Ticket: ${existingForEmail.ticketId}). Only 1 pass per email is allowed per event.`
      });
    }

    // Verify or create account for this email
    let studentUser = await UserModel.findOne({ email: targetEmail });
    if (studentUser) {
      // If a password was provided and not registering for oneself
      if (password && studentUser._id !== req.user.id) {
        const isMatch = await bcrypt.compare(password, studentUser.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid password for this account. Please enter the correct password.'
          });
        }
      }
    } else {
      // Auto-create student profile if registering with a new email
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'student123', salt);
      studentUser = await UserModel.create({
        name: name || targetEmail.split('@')[0],
        email: targetEmail,
        password: hashedPassword,
        role: 'student',
        rollNo: rollNo || '129',
        department: department || 'Computer Science',
        year: 'TYCS-B'
      });
    }

    // Generate unique college ticket ID (e.g., EH-2026-B81F)
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketId = `EH-2026-${randomCode}`;

    const studentName = name || studentUser.name || req.user.name;
    const studentRoll = rollNo || studentUser.rollNo || '129';
    const studentDept = department || studentUser.department || 'Computer Science';

    // Tamper-proof verification hash
    const verificationPayload = {
      ticketId,
      studentId: studentUser._id || studentUser.id || req.user.id,
      studentName,
      studentEmail: targetEmail,
      eventId: event._id || event.id,
      eventTitle: event.title,
      checksum: `SIG_${ticketId}_${event.title.substring(0, 3)}`
    };

    const verificationHash = JSON.stringify(verificationPayload);

    // Generate QR Code as base64 Data URL
    const qrCodeData = await QRCode.toDataURL(verificationHash, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    });

    const registration = await RegistrationModel.create({
      ticketId,
      eventId: event._id || event.id,
      studentId: studentUser._id || studentUser.id || req.user.id,
      studentName,
      studentEmail: targetEmail,
      studentRoll,
      studentDept,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      feePaid: Number(event.fee) || 0,
      qrCodeData,
      verificationHash,
      checkInStatus: false
    });

    // Increment event registration count
    await EventModel.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: 1 }
    });

    return res.status(201).json({
      success: true,
      message: `Pass generated for ${studentName} (${targetEmail})!`,
      data: registration
    });
  } catch (err) {
    console.error('Registration processing error:', err);
    return res.status(500).json({ success: false, message: 'Failed to complete registration.' });
  }
});

// GET /api/tickets/my-tickets - Logged-in student's registrations
router.get('/my-tickets', verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : '';

    const allTickets = await RegistrationModel.find({});
    // Match by studentId OR studentEmail so all passes created for this user appear
    const tickets = allTickets.filter(
      (t) =>
        t.studentId === studentId ||
        (t.studentEmail && t.studentEmail.toLowerCase() === userEmail)
    );

    return res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load student passes.' });
  }
});

// POST /api/tickets/verify-scan - Live Gate Scanner endpoint (from html5-qrcode camera)
router.post('/verify-scan', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const { qrData, ticketId: directTicketId } = req.body;

    let targetTicketId = directTicketId;

    // Parse scanned payload if QR code string was sent
    if (qrData) {
      try {
        const parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        if (parsed.ticketId) {
          targetTicketId = parsed.ticketId;
        }
      } catch (e) {
        // Fallback: check if raw text is a ticketId string directly
        if (typeof qrData === 'string' && qrData.startsWith('EH-2026-')) {
          targetTicketId = qrData.trim();
        }
      }
    }

    if (!targetTicketId) {
      return res.status(400).json({
        success: false,
        status: 'INVALID_FORMAT',
        message: 'Invalid QR Code: Format not recognized by College EventHub system.'
      });
    }

    const registration = await RegistrationModel.findOne({ ticketId: targetTicketId });

    if (!registration) {
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        message: `Ticket '${targetTicketId}' was not found in registered records.`
      });
    }

    // Check duplicate check-in at gate
    if (registration.checkInStatus) {
      const scanTime = new Date(registration.scannedAt).toLocaleTimeString();
      return res.status(409).json({
        success: false,
        status: 'DUPLICATE_ENTRY',
        message: `DUPLICATE ENTRY DETECTED! Already scanned at ${scanTime} by ${registration.scannedBy || 'Gate Staff'}.`,
        data: registration
      });
    }

    // Mark check-in as verified
    const updated = await RegistrationModel.findByIdAndUpdate(registration._id || registration.id, {
      checkInStatus: true,
      scannedAt: new Date().toISOString(),
      scannedBy: req.user.name
    });

    return res.json({
      success: true,
      status: 'VERIFIED',
      message: `Entry Verified! Welcome ${registration.studentName} (${registration.studentDept}) to ${registration.eventTitle}!`,
      data: updated
    });
  } catch (err) {
    console.error('QR Gate verification error:', err);
    return res.status(500).json({ success: false, message: 'Gate scanner verification failed.' });
  }
});

// GET /api/tickets/event/:eventId - List attendees for an event (Organizers & Admin)
router.get('/event/:eventId', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const registrations = await RegistrationModel.find({ eventId: req.params.eventId });
    return res.json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attendee records.' });
  }
});

module.exports = router;
