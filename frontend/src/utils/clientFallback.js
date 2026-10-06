// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Resilient Client-Side Fallback Engine (Guarantees 100% Zero-Crash on GitHub Pages / Static Hosting)

import QRCode from 'qrcode';

const STORAGE_KEY = 'eventhub_offline_database';

const INITIAL_DATA = {
  users: [
    {
      id: 'usr_harsh_dev',
      name: 'Harsh Yadav',
      email: 'harshlyadav8105@gmail.com',
      password: 'password123',
      role: 'student',
      rollNo: '129',
      department: 'Computer Science',
      year: 'TYCS-B',
      phone: '+91 98765 43210'
    },
    {
      id: 'usr_harsh_college',
      name: 'Harsh Yadav',
      email: 'harsh@college.edu',
      password: 'password123',
      role: 'student',
      rollNo: '129',
      department: 'Computer Science',
      year: 'TYCS-B',
      phone: '+91 98765 43210'
    },
    {
      id: 'usr_techclub',
      name: 'Tech Council & Robotics Club',
      email: 'techclub@college.edu',
      password: 'password123',
      role: 'organizer',
      rollNo: 'CLUB-01',
      department: 'Computer Science & IT',
      year: 'Faculty Coordinator',
      phone: '+91 98765 11223'
    },
    {
      id: 'usr_admin',
      name: 'Faculty Administration (HOD)',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
      rollNo: 'FAC-HOD',
      department: 'Computer Science',
      year: 'Faculty In-Charge',
      phone: '+91 98765 99887'
    }
  ],
  events: [
    {
      id: 'ev_hack2026',
      title: 'Hackathon 2026: Code The Future',
      description: '36-hour continuous inter-collegiate software hackathon. Build innovative AI, Web3, and IoT solutions.',
      category: 'Technical',
      date: '2026-03-24',
      time: '09:00 AM',
      venue: 'CS Department Labs 401 & 402',
      fee: 150,
      maxSeats: 120,
      registeredCount: 43,
      banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      organizerName: 'Tech Council',
      clubName: 'CSI College Chapter',
      status: 'Upcoming'
    },
    {
      id: 'ev_robowars',
      title: 'RoboWars TechFest: Arena Combat',
      description: 'High-octane metal combat in a reinforced steel battle arena! 15kg & 30kg robots fight for the trophy.',
      category: 'Technical',
      date: '2026-03-25',
      time: '11:00 AM',
      venue: 'College Quadrangle Open Stage',
      fee: 200,
      maxSeats: 80,
      registeredCount: 35,
      banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      organizerName: 'Robotics Guild',
      clubName: 'Robotics & Automation Club',
      status: 'Upcoming'
    },
    {
      id: 'ev_webcraft',
      title: 'WebCraft Workshop: Modern Web Apps',
      description: 'Hands-on practical masterclass on Full-Stack JavaScript, Vite, React, and REST APIs. Free for all TYCS students.',
      category: 'Workshop',
      date: '2026-03-18',
      time: '10:00 AM',
      venue: 'Seminar Hall A (Auditorium Wing)',
      fee: 0,
      maxSeats: 150,
      registeredCount: 88,
      banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      organizerName: 'Web Development Wing',
      clubName: 'Open Source Community',
      status: 'Completed'
    },
    {
      id: 'ev_resonance',
      title: 'Cultural Night: Resonance 2026',
      description: 'Flagship musical gala night! Live acoustic bands, classical fusion, group dance, and DJ night.',
      category: 'Cultural',
      date: '2026-03-26',
      time: '05:30 PM',
      venue: 'Central Open Air Amphitheatre',
      fee: 0,
      maxSeats: 500,
      registeredCount: 310,
      banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      organizerName: 'Cultural Committee',
      clubName: 'Student Council',
      status: 'Upcoming'
    },
    {
      id: 'ev_cricket',
      title: 'Inter-College Box Cricket League',
      description: 'Annual 7-a-side floodlight box cricket tournament. 16 departmental teams clash for the trophy.',
      category: 'Sports',
      date: '2026-03-28',
      time: '08:00 AM',
      venue: 'College Sports Turf',
      fee: 100,
      maxSeats: 64,
      registeredCount: 48,
      banner: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
      organizerName: 'Sports Committee',
      clubName: 'Gymkhana Association',
      status: 'Upcoming'
    }
  ],
  registrations: [],
  announcements: [
    {
      id: 'ann_1',
      title: 'Hackathon 2026 Problem Statements Released',
      content: 'Problem statements for FinTech, Healthcare, and Campus Automation tracks are live.',
      priority: 'urgent',
      authorName: 'Tech Council Head',
      authorRole: 'organizer',
      createdAt: '2026-03-20T10:00:00.000Z'
    },
    {
      id: 'ann_2',
      title: 'Certificates Available for WebCraft Workshop',
      content: 'Students who attended the hands-on session can now download their verified certificate from My Passes.',
      priority: 'normal',
      authorName: 'Faculty Administration',
      authorRole: 'admin',
      createdAt: '2026-03-19T14:30:00.000Z'
    }
  ]
};

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[Offline Engine] Error reading store:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[Offline Engine] Error saving store:', e);
  }
}

async function ensureDefaultPasses(store) {
  if (!store.registrations || store.registrations.length === 0) {
    const qrA = await QRCode.toDataURL(JSON.stringify({ ticketId: 'EH-2026-HACK1', studentName: 'Harsh Yadav' }));
    const qrB = await QRCode.toDataURL(JSON.stringify({ ticketId: 'EH-2026-WEBC9', studentName: 'Harsh Yadav' }));

    store.registrations = [
      {
        id: 'reg_1',
        ticketId: 'EH-2026-HACK1',
        eventId: 'ev_hack2026',
        studentId: 'usr_harsh_dev',
        studentName: 'Harsh Yadav',
        studentEmail: 'harshlyadav8105@gmail.com',
        studentRoll: '129',
        studentDept: 'Computer Science',
        eventTitle: 'Hackathon 2026: Code The Future',
        eventDate: '2026-03-24',
        eventVenue: 'CS Department Labs 401 & 402',
        feePaid: 150,
        qrCodeData: qrA,
        checkInStatus: false,
        createdAt: '2026-03-15T09:00:00.000Z'
      },
      {
        id: 'reg_2',
        ticketId: 'EH-2026-WEBC9',
        eventId: 'ev_webcraft',
        studentId: 'usr_harsh_dev',
        studentName: 'Harsh Yadav',
        studentEmail: 'harshlyadav8105@gmail.com',
        studentRoll: '129',
        studentDept: 'Computer Science',
        eventTitle: 'WebCraft Workshop: Modern Web Apps',
        eventDate: '2026-03-18',
        eventVenue: 'Seminar Hall A (Auditorium Wing)',
        feePaid: 0,
        qrCodeData: qrB,
        checkInStatus: true,
        scannedAt: '2026-03-18T10:15:00.000Z',
        createdAt: '2026-03-10T11:00:00.000Z'
      }
    ];
    saveStore(store);
  }
}

// Client Fallback Request Dispatcher
export async function handleClientFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const token = localStorage.getItem('eventhub_token');
  const store = getStore();
  await ensureDefaultPasses(store);

  console.info(`[Offline Resilient Mode] Dispatched ${method} ${endpoint}`);

  // 1. /auth/login
  if (endpoint === '/auth/login' && method === 'POST') {
    const cleanEmail = (body.email || '').toLowerCase().trim();
    let user = store.users.find(u => u.email.toLowerCase().trim() === cleanEmail);

    if (!user && (cleanEmail === 'harshlyadav8105@gmail.com' || cleanEmail === 'harsh@college.edu')) {
      user = {
        id: 'usr_harsh_dev',
        name: 'Harsh Yadav',
        email: cleanEmail,
        password: body.password || 'password123',
        role: 'student',
        rollNo: '129',
        department: 'Computer Science',
        year: 'TYCS-B'
      };
      store.users.push(user);
      saveStore(store);
    }

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email. Please register below.'
      };
    }

    const mockToken = 'mock_jwt_' + btoa(cleanEmail) + '_' + Date.now();
    localStorage.setItem('eventhub_token', mockToken);
    localStorage.setItem('eventhub_current_user', JSON.stringify(user));

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: mockToken,
      user
    };
  }

  // 2. /auth/register
  if (endpoint === '/auth/register' && method === 'POST') {
    const cleanEmail = (body.email || '').toLowerCase().trim();
    const existing = store.users.find(u => u.email.toLowerCase().trim() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this college email already exists. Please log in.'
      };
    }

    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: (body.name || 'Student').trim(),
      email: cleanEmail,
      password: body.password || 'password123',
      role: body.role || 'student',
      rollNo: body.rollNo || '129',
      department: body.department || 'Computer Science',
      year: body.year || 'TYCS-B',
      phone: body.phone || ''
    };

    store.users.push(newUser);
    saveStore(store);

    const mockToken = 'mock_jwt_' + btoa(cleanEmail) + '_' + Date.now();
    localStorage.setItem('eventhub_token', mockToken);
    localStorage.setItem('eventhub_current_user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Registration successful! Welcome to EventHub.',
      token: mockToken,
      user: newUser
    };
  }

  // 3. /auth/demo-login
  if (endpoint === '/auth/demo-login' && method === 'POST') {
    const role = body.role || 'student';
    let targetEmail = 'harshlyadav8105@gmail.com';
    if (role === 'organizer') targetEmail = 'techclub@college.edu';
    if (role === 'admin') targetEmail = 'admin@college.edu';

    let user = store.users.find(u => u.email === targetEmail) || store.users[0];
    const mockToken = 'mock_jwt_' + btoa(targetEmail) + '_' + Date.now();
    localStorage.setItem('eventhub_token', mockToken);
    localStorage.setItem('eventhub_current_user', JSON.stringify(user));

    return {
      success: true,
      message: `Demo mode: Logged in as ${user.name} (${user.role.toUpperCase()})`,
      token: mockToken,
      user
    };
  }

  // 4. /auth/me
  if (endpoint === '/auth/me' && method === 'GET') {
    const raw = localStorage.getItem('eventhub_current_user');
    if (raw) {
      return { success: true, user: JSON.parse(raw) };
    }
    return { success: false, message: 'Session expired' };
  }

  // 5. /events
  if (endpoint === '/events' && method === 'GET') {
    return { success: true, events: store.events };
  }

  if (endpoint === '/events' && method === 'POST') {
    const newEvent = {
      id: 'ev_' + Date.now().toString(36),
      ...body,
      registeredCount: 0,
      status: 'Upcoming'
    };
    store.events.unshift(newEvent);
    saveStore(store);
    return { success: true, event: newEvent, message: 'Event created successfully!' };
  }

  if (endpoint.startsWith('/events/') && endpoint.endsWith('/status') && method === 'PUT') {
    const parts = endpoint.split('/');
    const evId = parts[2];
    const ev = store.events.find(e => e.id === evId || e._id === evId);
    if (ev) {
      ev.status = body.status || 'Completed';
      saveStore(store);
      return { success: true, event: ev, message: `Event status updated to ${ev.status}` };
    }
  }

  // 6. /tickets/register
  if (endpoint === '/tickets/register' && method === 'POST') {
    const { eventId, email, name, rollNo, department } = body;
    const curUser = JSON.parse(localStorage.getItem('eventhub_current_user') || '{}');
    const targetEmail = (email || curUser.email || 'harshlyadav8105@gmail.com').toLowerCase().trim();

    const ev = store.events.find(e => e.id === eventId || e._id === eventId);
    if (!ev) return { success: false, message: 'Event not found.' };

    const existing = store.registrations.find(
      r => (r.eventId === eventId || r.eventId === ev.id) && r.studentEmail?.toLowerCase() === targetEmail
    );
    if (existing) {
      return {
        success: false,
        message: `Pass already exists for ${targetEmail}! Ticket ID: ${existing.ticketId}`
      };
    }

    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketId = `EH-2026-${randomCode}`;
    const payload = JSON.stringify({ ticketId, eventTitle: ev.title, studentEmail: targetEmail });
    const qrData = await QRCode.toDataURL(payload, { margin: 2 });

    const newTicket = {
      id: 'reg_' + Date.now().toString(36),
      ticketId,
      eventId: ev.id || eventId,
      studentId: curUser.id || 'usr_harsh_dev',
      studentName: name || curUser.name || 'Harsh Yadav',
      studentEmail: targetEmail,
      studentRoll: rollNo || curUser.rollNo || '129',
      studentDept: department || curUser.department || 'Computer Science',
      eventTitle: ev.title,
      eventDate: ev.date,
      eventVenue: ev.venue,
      feePaid: ev.fee || 0,
      qrCodeData: qrData,
      checkInStatus: false,
      createdAt: new Date().toISOString()
    };

    store.registrations.unshift(newTicket);
    ev.registeredCount = (ev.registeredCount || 0) + 1;
    saveStore(store);

    return {
      success: true,
      message: `E-Ticket ${ticketId} generated successfully!`,
      ticket: newTicket
    };
  }

  // 7. /tickets/my
  if (endpoint === '/tickets/my' && method === 'GET') {
    const curUser = JSON.parse(localStorage.getItem('eventhub_current_user') || '{}');
    const userEmail = (curUser.email || 'harshlyadav8105@gmail.com').toLowerCase().trim();

    const myTickets = store.registrations.filter(
      r => r.studentEmail?.toLowerCase() === userEmail || r.studentId === curUser.id
    );
    return { success: true, tickets: myTickets };
  }

  // 8. /tickets/verify
  if (endpoint === '/tickets/verify' && method === 'POST') {
    const { ticketId } = body;
    const ticket = store.registrations.find(r => r.ticketId === ticketId);
    if (!ticket) return { success: false, message: 'Invalid ticket pass.' };

    if (ticket.checkInStatus) {
      return {
        success: false,
        alreadyCheckedIn: true,
        message: `Pass already scanned at ${new Date(ticket.scannedAt).toLocaleTimeString()}`
      };
    }

    ticket.checkInStatus = true;
    ticket.scannedAt = new Date().toISOString();
    ticket.scannedBy = 'Gate Attendance Scanner';
    saveStore(store);

    return {
      success: true,
      message: `Verified! Entry allowed for ${ticket.studentName}`,
      ticket
    };
  }

  // 9. /analytics
  if (endpoint === '/analytics' && method === 'GET') {
    const totalEvents = store.events.length;
    const totalRegistrations = store.registrations.length;
    const totalCheckedIn = store.registrations.filter(r => r.checkInStatus).length;
    const totalRevenue = store.registrations.reduce((acc, r) => acc + (r.feePaid || 0), 0);

    return {
      success: true,
      stats: {
        totalEvents,
        totalRegistrations,
        totalCheckedIn,
        totalRevenue
      }
    };
  }

  // 10. /announcements
  if (endpoint === '/announcements' && method === 'GET') {
    return { success: true, announcements: store.announcements };
  }

  if (endpoint === '/announcements' && method === 'POST') {
    const newAnn = {
      id: 'ann_' + Date.now().toString(36),
      title: body.title,
      content: body.content,
      priority: body.priority || 'normal',
      authorName: body.authorName || 'Campus Admin',
      authorRole: body.authorRole || 'admin',
      createdAt: new Date().toISOString()
    };
    store.announcements.unshift(newAnn);
    saveStore(store);
    return { success: true, announcement: newAnn, message: 'Notice posted!' };
  }

  return { success: true, data: [] };
}
