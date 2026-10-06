// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Announcement Model

const mongoose = require('mongoose');
const { isMongoActive, getLocalStore, saveLocalStore, generateId } = require('../db/dbAdapter');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  eventId: { type: String, default: null },
  eventTitle: { type: String, default: 'Fest Central' },
  authorName: { type: String, default: 'Event Organizing Team' },
  authorRole: { type: String, default: 'organizer' },
  priority: { type: String, enum: ['low', 'normal', 'urgent'], default: 'normal' },
  createdAt: { type: Date, default: Date.now }
});

const MongoAnnouncement = mongoose.model('Announcement', announcementSchema);

const AnnouncementModel = {
  async find(query = {}) {
    if (isMongoActive()) {
      return await MongoAnnouncement.find(query).sort({ createdAt: -1 });
    }
    const store = getLocalStore();
    return [...store.announcements].reverse();
  },

  async create(data) {
    if (isMongoActive()) {
      return await MongoAnnouncement.create(data);
    }
    const store = getLocalStore();
    const newAnn = {
      _id: generateId(),
      priority: 'normal',
      ...data,
      createdAt: new Date().toISOString()
    };
    store.announcements.push(newAnn);
    saveLocalStore();
    return newAnn;
  },

  async findByIdAndDelete(id) {
    if (isMongoActive()) {
      return await MongoAnnouncement.findByIdAndDelete(id);
    }
    const store = getLocalStore();
    const index = store.announcements.findIndex(a => a._id === id || a.id === id);
    if (index === -1) return null;
    const removed = store.announcements.splice(index, 1)[0];
    saveLocalStore();
    return removed;
  }
};

module.exports = AnnouncementModel;
