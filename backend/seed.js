// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Database Seeder Script with Realistic Viva Demo Data

require('dotenv').config();
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const { connectDB, isMongoActive, getLocalStore, saveLocalStore, generateId } = require('./db/dbAdapter');
const UserModel = require('./models/User');
const EventModel = require('./models/Event');
const RegistrationModel = require('./models/Registration');
const AnnouncementModel = require('./models/Announcement');

async function seedData() {
  console.log('[EventHub Seeder] Initializing database seeding...');
  await connectDB();

  // Clear local memory store if active
  if (!isMongoActive()) {
    const store = getLocalStore();
    store.users = [];
    store.events = [];
    store.registrations = [];
    store.announcements = [];
    saveLocalStore();
  }

  // 1. Create Pre-configured Roles
  const hashedStudentPass = await bcrypt.hash('student123', 10);
  const hashedClubPass = await bcrypt.hash('club123', 10);
  const hashedAdminPass = await bcrypt.hash('admin123', 10);

  const studentUser = await UserModel.create({
    name: 'Harsh Yadav',
    email: 'harsh@college.edu',
    password: hashedStudentPass,
    role: 'student',
    rollNo: '129',
    department: 'Computer Science',
    year: 'TYCS-B',
    phone: '+91 98765 43210'
  });

  const clubUser = await UserModel.create({
    name: 'Tech Council & Robotics Club',
    email: 'techclub@college.edu',
    password: hashedClubPass,
    role: 'organizer',
    rollNo: 'CLUB-01',
    department: 'Computer Science & IT',
    year: 'Faculty Coordinator',
    phone: '+91 98765 11223'
  });

  const adminUser = await UserModel.create({
    name: 'Faculty Admin (HOD)',
    email: 'admin@college.edu',
    password: hashedAdminPass,
    role: 'admin',
    rollNo: 'FAC-HOD',
    department: 'Computer Science',
    year: 'Faculty In-Charge',
    phone: '+91 98765 99887'
  });

  console.log('[EventHub Seeder] Users created:');
  console.log('   - Student:   harsh@college.edu / student123 (Harsh Yadav, Roll 129)');
  console.log('   - Organizer: techclub@college.edu / club123');
  console.log('   - Admin:     admin@college.edu / admin123 (Faculty Admin)');

  // 2. Realistic College Events
  const studentId = studentUser._id || studentUser.id;
  const organizerId = clubUser._id || clubUser.id;

  const event1 = await EventModel.create({
    title: 'Hackathon 2026: Code The Future',
    description: '36-hour continuous inter-collegiate software hackathon. Build innovative AI, Web3, and IoT solutions for smart cities and education.',
    category: 'Technical',
    date: '2026-03-24',
    time: '09:00 AM',
    venue: 'CS Department Labs 401 & 402',
    fee: 150,
    maxSeats: 120,
    registeredCount: 42,
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    organizerId,
    organizerName: 'Tech Council',
    clubName: 'CSI College Chapter',
    status: 'Upcoming'
  });

  const event2 = await EventModel.create({
    title: 'RoboWars TechFest: Arena Combat',
    description: 'High-octane metal combat in a reinforced steel battle arena! 15kg & 30kg wired/wireless robots fight for the trophy.',
    category: 'Technical',
    date: '2026-03-25',
    time: '11:00 AM',
    venue: 'College Quadrangle Open Stage',
    fee: 200,
    maxSeats: 80,
    registeredCount: 35,
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    organizerId,
    organizerName: 'Robotics Guild',
    clubName: 'Robotics & Automation Club',
    status: 'Upcoming'
  });

  const event3 = await EventModel.create({
    title: 'WebCraft Workshop: Modern Web Apps',
    description: 'Hands-on practical masterclass on Full-Stack JavaScript, Vite, React, and REST APIs by industry alumni. Free for all TYCS students.',
    category: 'Workshop',
    date: '2026-03-18',
    time: '10:00 AM',
    venue: 'Seminar Hall A (Auditorium Wing)',
    fee: 0,
    maxSeats: 150,
    registeredCount: 88,
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    organizerId,
    organizerName: 'Web Development Wing',
    clubName: 'Open Source Community',
    status: 'Completed' // Marked completed to showcase Certificate Generation!
  });

  const event4 = await EventModel.create({
    title: 'Cultural Night: Resonance 2026',
    description: 'The flagship musical gala night! Live acoustic bands, classical fusion performances, group street dance, and celebrity DJ night.',
    category: 'Cultural',
    date: '2026-03-26',
    time: '05:30 PM',
    venue: 'Central Open Air Amphitheatre',
    fee: 0,
    maxSeats: 500,
    registeredCount: 310,
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    organizerId,
    organizerName: 'Cultural Committee',
    clubName: 'Student Council',
    status: 'Upcoming'
  });

  const event5 = await EventModel.create({
    title: 'Inter-College Box Cricket League',
    description: 'Annual 7-a-side floodlight box cricket tournament. 16 departmental teams clash for the perpetual rolling trophy.',
    category: 'Sports',
    date: '2026-03-28',
    time: '08:00 AM',
    venue: 'College Sports Turf',
    fee: 100,
    maxSeats: 64,
    registeredCount: 48,
    banner: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    organizerId,
    organizerName: 'Sports Committee',
    clubName: 'Gymkhana Association',
    status: 'Upcoming'
  });

  console.log('[EventHub Seeder] Seeded 5 realistic college events.');

  // 3. Pre-create Registrations for Harsh Yadav for instant Viva demo
  // Registration A: Hackathon pass (Active & Ready to Scan at Gate)
  const ticketA = 'EH-2026-HACK1';
  const payloadA = JSON.stringify({
    ticketId: ticketA,
    studentId,
    studentName: 'Harsh Yadav',
    eventId: event1._id || event1.id,
    eventTitle: event1.title,
    checksum: 'SIG_EH-2026-HACK1_HAC'
  });
  const qrA = await QRCode.toDataURL(payloadA, { errorCorrectionLevel: 'H', margin: 2 });

  await RegistrationModel.create({
    ticketId: ticketA,
    eventId: event1._id || event1.id,
    studentId,
    studentName: 'Harsh Yadav',
    studentEmail: 'harsh@college.edu',
    studentRoll: '129',
    studentDept: 'Computer Science',
    eventTitle: event1.title,
    eventDate: event1.date,
    eventVenue: event1.venue,
    feePaid: 150,
    qrCodeData: qrA,
    verificationHash: payloadA,
    checkInStatus: false
  });

  // Registration B: Completed Workshop pass (Checked-in & Eligible for Certificate!)
  const ticketB = 'EH-2026-WEBC9';
  const payloadB = JSON.stringify({
    ticketId: ticketB,
    studentId,
    studentName: 'Harsh Yadav',
    eventId: event3._id || event3.id,
    eventTitle: event3.title,
    checksum: 'SIG_EH-2026-WEBC9_WEB'
  });
  const qrB = await QRCode.toDataURL(payloadB, { errorCorrectionLevel: 'H', margin: 2 });

  await RegistrationModel.create({
    ticketId: ticketB,
    eventId: event3._id || event3.id,
    studentId,
    studentName: 'Harsh Yadav',
    studentEmail: 'harsh@college.edu',
    studentRoll: '129',
    studentDept: 'Computer Science',
    eventTitle: event3.title,
    eventDate: event3.date,
    eventVenue: event3.venue,
    feePaid: 0,
    qrCodeData: qrB,
    verificationHash: payloadB,
    checkInStatus: true,
    scannedAt: '2026-03-18T10:15:00.000Z',
    scannedBy: 'Gate Attendance Officer'
  });

  console.log('[EventHub Seeder] Seeded demo student tickets (1 active gate pass, 1 completed with certificate).');

  // 4. Pre-seed Campus Announcements
  await AnnouncementModel.create({
    title: 'Hackathon 2026 Problem Statements Released',
    content: 'Problem statements for FinTech, Healthcare, and Campus Automation tracks are now live. Team registration verification starts at 8:30 AM in Lab 401.',
    priority: 'urgent',
    eventId: event1._id || event1.id,
    eventTitle: event1.title,
    authorName: 'Tech Council Head',
    authorRole: 'organizer'
  });

  await AnnouncementModel.create({
    title: 'Cultural Night Entry Protocol',
    content: 'All attendees must show their digital QR pass on mobile. Gate 2 will be dedicated to rapid QR scanner clearance starting 5:00 PM.',
    priority: 'normal',
    eventId: event4._id || event4.id,
    eventTitle: event4.title,
    authorName: 'Cultural Secretary',
    authorRole: 'organizer'
  });

  await AnnouncementModel.create({
    title: 'Certificates Available for WebCraft Workshop',
    content: 'Students who attended the hands-on session can now download their verified certificate from the My Passes section.',
    priority: 'normal',
    eventId: event3._id || event3.id,
    eventTitle: event3.title,
    authorName: 'Department Faculty In-Charge',
    authorRole: 'admin'
  });

  console.log('[EventHub Seeder] Seeded announcements.');
  console.log('----------------------------------------------------');
  console.log('[EventHub Seeder] All realistic demo data seeded successfully!');
  console.log('----------------------------------------------------');
}

if (require.main === module) {
  seedData().then(() => process.exit(0)).catch(err => {
    console.error('Seeder failed:', err);
    process.exit(1);
  });
}

module.exports = seedData;
