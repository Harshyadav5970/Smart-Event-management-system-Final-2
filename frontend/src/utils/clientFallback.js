// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Resilient Client-Side Fallback Engine (Guarantees 100% Zero-Crash on GitHub Pages / Static Hosting)

import QRCode from 'qrcode';

const STORAGE_KEY = 'eventhub_offline_database_v2';

const INITIAL_DATA = {
  users: [
    {
      id: 'usr_harsh_dev',
      _id: 'usr_harsh_dev',
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
      _id: 'usr_harsh_college',
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
      _id: 'usr_techclub',
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
      _id: 'usr_admin',
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
      _id: 'ev_hack2026',
      title: 'Hackathon 2026: Code The Future',
      description: '36-hour continuous inter-collegiate software hackathon. Build innovative AI, Web3, and IoT solutions for smart cities and education.',
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
      _id: 'ev_robowars',
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
      organizerName: 'Robotics Guild',
      clubName: 'Robotics & Automation Club',
      status: 'Upcoming'
    },
    {
      id: 'ev_webcraft',
      _id: 'ev_webcraft',
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
      organizerName: 'Web Development Wing',
      clubName: 'Open Source Community',
      status: 'Completed'
    },
    {
      id: 'ev_resonance',
      _id: 'ev_resonance',
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
      organizerName: 'Cultural Committee',
      clubName: 'Student Council',
      status: 'Upcoming'
    },
    {
      id: 'ev_cricket',
      _id: 'ev_cricket',
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
      organizerName: 'Sports Committee',
      clubName: 'Gymkhana Association',
      status: 'Upcoming'
    }
  ],
  registrations: [],
  announcements: [
    {
      id: 'ann_1',
      _id: 'ann_1',
      title: 'Hackathon 2026 Problem Statements Released',
      content: 'Problem statements for FinTech, Healthcare, and Campus Automation tracks are now live. Team verification starts at 8:30 AM in Lab 401.',
      priority: 'urgent',
      authorName: 'Tech Council Head',
      authorRole: 'organizer',
      createdAt: '2026-03-20T10:00:00.000Z'
    },
    {
      id: 'ann_2',
      _id: 'ann_2',
      title: 'Certificates Available for WebCraft Workshop',
      content: 'Students who attended the hands-on session can now download their verified certificate from the My Passes section.',
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.events) && parsed.events.length > 0) {
        return parsed;
      }
    }
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
        _id: 'reg_1',
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
        _id: 'reg_2',
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
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
  const token = localStorage.getItem('eventhub_token');
  const store = getStore();
  await ensureDefaultPasses(store);

  console.info(`[Offline Resilient Mode] Dispatched ${method} ${endpoint}`);

  // Clean endpoint for matching (remove query params)
  const cleanUrl = endpoint.split('?')[0];

  // 1. /health
  if (cleanUrl === '/health' && method === 'GET') {
    return {
      status: 'ONLINE',
      success: true,
      project: 'EventHub - Smart College Event & Fest Management System',
      author: 'Harsh Yadav',
      rollNo: '129',
      class: 'TYCS-B',
      department: 'Computer Science',
      dbEngine: 'Resilient Offline Client Storage (GitHub Pages)'
    };
  }

  // 2. /auth/login
  if (cleanUrl === '/auth/login' && method === 'POST') {
    const cleanEmail = (body.email || '').toLowerCase().trim();
    let user = store.users.find(u => u.email.toLowerCase().trim() === cleanEmail);

    if (!user && (cleanEmail === 'harshlyadav8105@gmail.com' || cleanEmail === 'harsh@college.edu')) {
      user = {
        id: 'usr_harsh_dev',
        _id: 'usr_harsh_dev',
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

  // 3. /auth/register
  if (cleanUrl === '/auth/register' && method === 'POST') {
    const cleanEmail = (body.email || '').toLowerCase().trim();
    const existing = store.users.find(u => u.email.toLowerCase().trim() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this college email already exists. Please log in.'
      };
    }

    const newId = 'usr_' + Date.now().toString(36);
    const newUser = {
      id: newId,
      _id: newId,
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

  // 4. /auth/demo-login
  if (cleanUrl === '/auth/demo-login' && method === 'POST') {
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

  // 5. /auth/me
  if (cleanUrl === '/auth/me' && method === 'GET') {
    const raw = localStorage.getItem('eventhub_current_user');
    if (raw) {
      return { success: true, user: JSON.parse(raw) };
    }
    return { success: false, message: 'Session expired' };
  }

  // 6. /events (Returns data AND events arrays for bulletproof compatibility!)
  if (cleanUrl === '/events' && method === 'GET') {
    return {
      success: true,
      count: store.events.length,
      data: store.events,
      events: store.events
    };
  }

  if (cleanUrl === '/events' && method === 'POST') {
    const newId = 'ev_' + Date.now().toString(36);
    const newEvent = {
      id: newId,
      _id: newId,
      ...body,
      registeredCount: 0,
      status: 'Upcoming'
    };
    store.events.unshift(newEvent);
    saveStore(store);
    return { success: true, data: newEvent, event: newEvent, message: 'Event created successfully!' };
  }

  if (cleanUrl.startsWith('/events/') && method === 'PUT') {
    const parts = cleanUrl.split('/');
    const evId = parts[2];
    const ev = store.events.find(e => e.id === evId || e._id === evId);
    if (ev) {
      if (body.status) ev.status = body.status;
      saveStore(store);
      return { success: true, data: ev, event: ev, message: `Event status updated to ${ev.status}` };
    }
  }

  // 7. /tickets/my-tickets & /tickets/my
  if ((cleanUrl === '/tickets/my-tickets' || cleanUrl === '/tickets/my') && method === 'GET') {
    const curUser = JSON.parse(localStorage.getItem('eventhub_current_user') || '{}');
    const userEmail = (curUser.email || 'harshlyadav8105@gmail.com').toLowerCase().trim();

    const myTickets = store.registrations.filter(
      r =>
        (r.studentEmail && r.studentEmail.toLowerCase() === userEmail) ||
        r.studentId === curUser.id ||
        r.studentId === curUser._id
    );
    return {
      success: true,
      count: myTickets.length,
      data: myTickets,
      tickets: myTickets
    };
  }

  // 8. /tickets/event/:id
  if (cleanUrl.startsWith('/tickets/event/') && method === 'GET') {
    const evId = cleanUrl.split('/')[3];
    const attendees = store.registrations.filter(r => r.eventId === evId);
    return {
      success: true,
      data: attendees,
      attendees
    };
  }

  // 9. /tickets/register
  if (cleanUrl === '/tickets/register' && method === 'POST') {
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

    const newTicketId = 'reg_' + Date.now().toString(36);
    const newTicket = {
      id: newTicketId,
      _id: newTicketId,
      ticketId,
      eventId: ev.id || eventId,
      studentId: curUser.id || curUser._id || 'usr_harsh_dev',
      studentName: name || curUser.name || 'Harsh Yadav',
      studentEmail: targetEmail,
      studentRoll: rollNo || curUser.rollNo || '129',
      studentDept: department || curUser.department || 'Computer Science',
      eventTitle: ev.title,
      eventDate: ev.date,
      eventVenue: ev.venue,
      feePaid: Number(ev.fee) || 0,
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
      data: newTicket,
      ticket: newTicket
    };
  }

  // 10. /tickets/verify
  if (cleanUrl === '/tickets/verify' && method === 'POST') {
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
      data: ticket,
      ticket
    };
  }

  // 11. /analytics/dashboard & /analytics
  if ((cleanUrl === '/analytics/dashboard' || cleanUrl === '/analytics') && method === 'GET') {
    const totalEvents = store.events.length;
    const totalRegistrations = store.registrations.length;
    const totalRevenue = store.registrations.reduce((acc, r) => acc + (Number(r.feePaid) || 0), 0);
    const checkedInCount = store.registrations.filter(r => r.checkInStatus).length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

    const categoryBreakdown = { Technical: 0, Cultural: 0, Sports: 0, Workshop: 0 };
    store.events.forEach(e => {
      if (categoryBreakdown[e.category] !== undefined) categoryBreakdown[e.category] += 1;
    });

    const departmentBreakdown = {};
    store.registrations.forEach(r => {
      const dept = r.studentDept || 'Computer Science';
      departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
    });

    const eventStats = store.events.map(e => {
      const eventRegs = store.registrations.filter(r => r.eventId === e.id || r.eventId === e._id);
      const eventChecked = eventRegs.filter(r => r.checkInStatus).length;
      const eventRev = eventRegs.reduce((sum, r) => sum + (Number(r.feePaid) || 0), 0);
      return {
        id: e.id || e._id,
        _id: e.id || e._id,
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

    const analyticsData = {
      summary: {
        totalEvents,
        totalRegistrations,
        totalRevenue,
        checkedInCount,
        attendanceRate,
        totalStudents: store.users.filter(u => u.role === 'student').length
      },
      categoryBreakdown,
      departmentBreakdown,
      eventStats
    };

    return {
      success: true,
      data: analyticsData,
      stats: analyticsData.summary
    };
  }

  // 12. /announcements
  if (cleanUrl === '/announcements' && method === 'GET') {
    return {
      success: true,
      data: store.announcements,
      announcements: store.announcements
    };
  }

  if (cleanUrl === '/announcements' && method === 'POST') {
    const newId = 'ann_' + Date.now().toString(36);
    const newAnn = {
      id: newId,
      _id: newId,
      title: body.title,
      content: body.content,
      priority: body.priority || 'normal',
      authorName: body.authorName || 'Campus Admin',
      authorRole: body.authorRole || 'admin',
      createdAt: new Date().toISOString()
    };
    store.announcements.unshift(newAnn);
    saveStore(store);
    return { success: true, data: newAnn, announcement: newAnn, message: 'Notice posted!' };
  }

  if (cleanUrl.startsWith('/announcements/') && method === 'DELETE') {
    const id = cleanUrl.split('/')[2];
    store.announcements = store.announcements.filter(a => a.id !== id && a._id !== id);
    saveStore(store);
    return { success: true, message: 'Notice removed!' };
  }

  return { success: true, data: [] };
}
