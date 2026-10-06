// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Project Guide: Ms. Pranali Thakare
// Registration & E-Ticket Model

const mongoose = require('mongoose');
const { isMongoActive, getLocalStore, saveLocalStore, generateId } = require('../db/dbAdapter');

const registrationSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentRoll: { type: String, default: '129' },
  studentDept: { type: String, default: 'Computer Science' },
  eventTitle: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventVenue: { type: String, required: true },
  feePaid: { type: Number, default: 0 },
  qrCodeData: { type: String, default: '' },
  verificationHash: { type: String, required: true },
  checkInStatus: { type: Boolean, default: false },
  scannedAt: { type: Date, default: null },
  scannedBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const MongoRegistration = mongoose.model('Registration', registrationSchema);

const RegistrationModel = {
  async find(query = {}) {
    if (isMongoActive()) {
      return await MongoRegistration.find(query).sort({ createdAt: -1 });
    }
    const store = getLocalStore();
    return store.registrations.filter(r => {
      if (query.studentId && r.studentId !== query.studentId) return false;
      if (query.eventId && r.eventId !== query.eventId) return false;
      if (query.checkInStatus !== undefined && r.checkInStatus !== query.checkInStatus) return false;
      return true;
    }).reverse();
  },

  async findOne(query) {
    if (isMongoActive()) {
      return await MongoRegistration.findOne(query);
    }
    const store = getLocalStore();
    return store.registrations.find(r => {
      let match = true;
      if (query.ticketId && r.ticketId !== query.ticketId) match = false;
      if (query.eventId && r.eventId !== query.eventId) match = false;
      if (query.studentId && r.studentId !== query.studentId) match = false;
      if (query.verificationHash && r.verificationHash !== query.verificationHash) match = false;
      return match;
    }) || null;
  },

  async findById(id) {
    if (isMongoActive()) {
      return await MongoRegistration.findById(id);
    }
    const store = getLocalStore();
    return store.registrations.find(r => r._id === id || r.id === id) || null;
  },

  async create(data) {
    if (isMongoActive()) {
      return await MongoRegistration.create(data);
    }
    const store = getLocalStore();
    const newReg = {
      _id: generateId(),
      checkInStatus: false,
      scannedAt: null,
      scannedBy: null,
      ...data,
      createdAt: new Date().toISOString()
    };
    store.registrations.push(newReg);
    saveLocalStore();
    return newReg;
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    if (isMongoActive()) {
      return await MongoRegistration.findByIdAndUpdate(id, updates, { new: true, ...options });
    }
    const store = getLocalStore();
    const index = store.registrations.findIndex(r => r._id === id || r.id === id);
    if (index === -1) return null;
    store.registrations[index] = { ...store.registrations[index], ...updates };
    saveLocalStore();
    return store.registrations[index];
  },

  async countDocuments(query = {}) {
    if (isMongoActive()) {
      return await MongoRegistration.countDocuments(query);
    }
    return (await this.find(query)).length;
  }
};

module.exports = RegistrationModel;
