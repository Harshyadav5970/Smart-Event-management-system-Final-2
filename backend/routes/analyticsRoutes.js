// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Real-Time Analytics & Fest Revenue Statistics

const express = require('express');
const router = express.Router();
const EventModel = require('../models/Event');
const RegistrationModel = require('../models/Registration');
const UserModel = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/analytics/dashboard - Comprehensive overview for Organizers & Admin
router.get('/dashboard', verifyToken, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const events = await EventModel.find({});
    const registrations = await RegistrationModel.find({});
    const students = await UserModel.find({ role: 'student' });

    // Calculate core metrics
    const totalEvents = events.length;
    const totalRegistrations = registrations.length;
    const totalRevenue = registrations.reduce((acc, curr) => acc + (Number(curr.feePaid) || 0), 0);

    const checkedInCount = registrations.filter(r => r.checkInStatus === true).length;
    const attendanceRate = totalRegistrations > 0
      ? Math.round((checkedInCount / totalRegistrations) * 100)
      : 0;

    // Category breakdown
    const categoryBreakdown = {
      Technical: 0,
      Cultural: 0,
      Sports: 0,
      Workshop: 0
    };

    events.forEach(e => {
      if (categoryBreakdown[e.category] !== undefined) {
        categoryBreakdown[e.category] += 1;
      }
    });

    // Department participation breakdown from registrations
    const departmentBreakdown = {};
    registrations.forEach(r => {
      const dept = r.studentDept || 'Computer Science';
      departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
    });

    // Event performance summary
    const eventStats = events.map(e => {
      const eventRegs = registrations.filter(r => r.eventId === (e._id || e.id));
      const eventChecked = eventRegs.filter(r => r.checkInStatus).length;
      const eventRev = eventRegs.reduce((sum, r) => sum + (Number(r.feePaid) || 0), 0);

      return {
        id: e._id || e.id,
        title: e.title,
        category: e.category,
        status: e.status,
        date: e.date,
        venue: e.venue,
        fee: e.fee,
        registrations: eventRegs.length,
        checkIns: eventChecked,
        revenue: eventRev,
        occupancyRate: e.maxSeats > 0 ? Math.round((eventRegs.length / e.maxSeats) * 100) : 0
      };
    });

    return res.json({
      success: true,
      data: {
        summary: {
          totalEvents,
          totalRegistrations,
          totalRevenue,
          checkedInCount,
          attendanceRate,
          totalStudents: students.length
        },
        categoryBreakdown,
        departmentBreakdown,
        eventStats
      }
    });
  } catch (err) {
    console.error('Analytics aggregation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute analytics.' });
  }
});

module.exports = router;
