// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Event Model with Dual Engine Persistence

const mongoose = require('mongoose');
const { isMongoActive, getLocalStore, saveLocalStore, generateId } = require('../db/dbAdapter');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Technical', 'Cultural', 'Sports', 'Workshop'], default: 'Technical' },
  date: { type: String, required: true },
  time: { type: String, default: '10:00 AM' },
  venue: { type: String, required: true },
  fee: { type: Number, default: 0 },
  maxSeats: { type: Number, default: 100 },
  banner: { type: String, default: '' },
  organizerId: { type: String, required: true },
  organizerName: { type: String, default: 'College Tech Council' },
  clubName: { type: String, default: 'Student Activity Cell' },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'], default: 'Upcoming' },
  registeredCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongoEvent = mongoose.model('Event', eventSchema);

const EventModel = {
  async find(query = {}) {
    if (isMongoActive()) {
      return await MongoEvent.find(query).sort({ createdAt: -1 });
    }
    const store = getLocalStore();
    let results = [...store.events];
    if (query.category) results = results.filter(e => e.category === query.category);
    if (query.status) results = results.filter(e => e.status === query.status);
    if (query.organizerId) results = results.filter(e => e.organizerId === query.organizerId);
    return results.reverse();
  },

  async findById(id) {
    if (isMongoActive()) {
      return await MongoEvent.findById(id);
    }
    const store = getLocalStore();
    return store.events.find(e => e._id === id || e.id === id) || null;
  },

  async create(data) {
    if (isMongoActive()) {
      return await MongoEvent.create(data);
    }
    const store = getLocalStore();
    const newEvent = {
      _id: generateId(),
      registeredCount: 0,
      status: 'Upcoming',
      ...data,
      createdAt: new Date().toISOString()
    };
    store.events.push(newEvent);
    saveLocalStore();
    return newEvent;
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    if (isMongoActive()) {
      return await MongoEvent.findByIdAndUpdate(id, updates, { new: true, ...options });
    }
    const store = getLocalStore();
    const index = store.events.findIndex(e => e._id === id || e.id === id);
    if (index === -1) return null;

    // Handle $inc if passed
    if (updates.$inc) {
      for (const key of Object.keys(updates.$inc)) {
        store.events[index][key] = (store.events[index][key] || 0) + updates.$inc[key];
      }
      delete updates.$inc;
    }

    store.events[index] = { ...store.events[index], ...updates };
    saveLocalStore();
    return store.events[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoActive()) {
      return await MongoEvent.findByIdAndDelete(id);
    }
    const store = getLocalStore();
    const index = store.events.findIndex(e => e._id === id || e.id === id);
    if (index === -1) return null;
    const removed = store.events.splice(index, 1)[0];
    saveLocalStore();
    return removed;
  },

  async countDocuments(query = {}) {
    if (isMongoActive()) {
      return await MongoEvent.countDocuments(query);
    }
    return (await this.find(query)).length;
  }
};

module.exports = EventModel;
