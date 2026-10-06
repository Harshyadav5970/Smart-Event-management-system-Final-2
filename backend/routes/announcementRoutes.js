// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Campus Announcement Feed Routes

const express = require('express');
const router = express.Router();
const AnnouncementModel = require('../models/Announcement');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/announcements - Fetch all campus notifications
router.get('/', async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find({});
    return res.json({ success: true, count: announcements.length, data: announcements });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load announcements.' });
  }
});

// POST /api/announcements - Post urgent or general fest update
router.post('/', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const { title, content, priority, eventId, eventTitle } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and announcement details.'
      });
    }

    const item = await AnnouncementModel.create({
      title,
      content,
      priority: priority || 'normal',
      eventId: eventId || null,
      eventTitle: eventTitle || 'Campus Fest Notice',
      authorName: req.user.name,
      authorRole: req.user.role
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement broadcasted to campus dashboard!',
      data: item
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to post announcement.' });
  }
});

// DELETE /api/announcements/:id - Remove announcement
router.delete('/:id', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    await AnnouncementModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Announcement deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting announcement.' });
  }
});

module.exports = router;
