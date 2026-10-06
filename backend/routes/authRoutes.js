// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Authentication Routes (Signup, Login, Profile & Viva Fast-Login)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register - Register new student or club coordinator
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNo, department, year, phone } = req.body;

    // Validate essential student details
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory fields: name, email, and password.'
      });
    }

    // Check if account already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this college email already exists. Please log in.'
      });
    }

    // Hash password securely with salt rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'student',
      rollNo: rollNo || '',
      department: department || 'Computer Science',
      year: year || 'TYCS-B',
      phone: phone || ''
    });

    // Generate JWT token immediately so student is logged in after signup
    const token = jwt.sign(
      {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to EventHub.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department,
        year: user.year
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please check inputs and try again.'
    });
  }
});

// POST /api/auth/login - Student / Organizer / Admin sign in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both college email and password.'
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: No account found with this email.'
      });
    }

    // Compare encrypted passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: Incorrect password.'
      });
    }

    const token = jwt.sign(
      {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department,
        year: user.year
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while logging in.'
    });
  }
});

// GET /api/auth/me - Fetch authenticated user details
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department,
        year: user.year
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch profile.' });
  }
});

// POST /api/auth/demo-login - 1-Click login designed for Viva presentation
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body; // 'student' | 'organizer' | 'admin'

    const emailMap = {
      student: 'harsh@college.edu',
      organizer: 'techclub@college.edu',
      admin: 'admin@college.edu'
    };

    const targetEmail = emailMap[role] || 'harsh@college.edu';
    let user = await UserModel.findOne({ email: targetEmail });

    // Fallback if demo user isn't found
    if (!user) {
      user = await UserModel.create({
        name: role === 'student' ? 'Harsh Yadav' : (role === 'organizer' ? 'Tech Club Council' : 'HOD / Faculty Admin'),
        email: targetEmail,
        password: await bcrypt.hash(role === 'student' ? 'student123' : (role === 'organizer' ? 'club123' : 'admin123'), 10),
        role: role || 'student',
        rollNo: role === 'student' ? '129' : 'FAC-01',
        department: 'Computer Science',
        year: 'TYCS-B'
      });
    }

    const token = jwt.sign(
      {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: `Demo mode: Logged in as ${user.name} (${user.role.toUpperCase()})`,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department,
        year: user.year
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ success: false, message: 'Demo fast-login failed.' });
  }
});

module.exports = router;
