// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Event Management Routes (Creation, Status Updates & Filtering)

const express = require('express');
const router = express.Router();
const EventModel = require('../models/Event');
const RegistrationModel = require('../models/Registration');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/events - Browse all college events with search & category filters
router.get('/', async (req, res) => {
  try {
    const { category, status, search, feeType } = req.query;
    let events = await EventModel.find({});

    // Filter by fest category (Technical, Cultural, Sports, Workshop)
    if (category && category !== 'All') {
      events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by status (Upcoming, Ongoing, Completed)
    if (status && status !== 'All') {
      events = events.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by Free vs Paid
    if (feeType === 'free') {
      events = events.filter(e => Number(e.fee) === 0);
    } else if (feeType === 'paid') {
      events = events.filter(e => Number(e.fee) > 0);
    }

    // Live search query matching title, venue or club
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        (e.clubName && e.clubName.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    console.error('Fetch events error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve events.' });
  }
});

// GET /api/events/:id - Get specific event details
router.get('/:id', async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.json({ success: true, data: event });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error loading event details.' });
  }
});

// POST /api/events - Organizers create new college event
router.post('/', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const { title, description, category, date, time, venue, fee, maxSeats, banner, clubName } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: Please supply title, description, date, and venue.'
      });
    }

    const newEvent = await EventModel.create({
      title,
      description,
      category: category || 'Technical',
      date,
      time: time || '10:00 AM',
      venue,
      fee: Number(fee) || 0,
      maxSeats: Number(maxSeats) || 120,
      banner: banner || '',
      organizerId: req.user.id,
      organizerName: req.user.name,
      clubName: clubName || 'Student Activity Council',
      status: 'Upcoming'
    });

    return res.status(201).json({
      success: true,
      message: 'Event created and published to campus feed!',
      data: newEvent
    });
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create new event.' });
  }
});

// PUT /api/events/:id - Update details or mark event as 'Completed' (Unlocks certificates)
router.put('/:id', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const eventId = req.params.id;
    const existing = await EventModel.findById(eventId);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check organizer permissions (admin can edit any event)
    if (req.user.role !== 'admin' && existing.organizerId && existing.organizerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit events created by your club account.'
      });
    }

    const updated = await EventModel.findByIdAndUpdate(eventId, req.body, { new: true });

    return res.json({
      success: true,
      message: 'Event updated successfully.',
      data: updated
    });
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
});

// DELETE /api/events/:id - Remove event
router.delete('/:id', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const eventId = req.params.id;
    await EventModel.findByIdAndDelete(eventId);
    return res.json({ success: true, message: 'Event cancelled and removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
});

module.exports = router;
