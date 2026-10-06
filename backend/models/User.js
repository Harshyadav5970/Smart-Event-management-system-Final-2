// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// User Model with Dual Mode (Mongoose + Offline Memory Store)

const mongoose = require('mongoose');
const { isMongoActive, getLocalStore, saveLocalStore, generateId } = require('../db/dbAdapter');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'organizer', 'admin'], default: 'student' },
  rollNo: { type: String, default: '' },
  department: { type: String, default: 'Computer Science' },
  year: { type: String, default: 'TYCS-B' },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', userSchema);

// Hybrid model wrapper
const UserModel = {
  async findOne(query) {
    if (isMongoActive()) {
      return await MongoUser.findOne(query);
    }
    const store = getLocalStore();
    return store.users.find(u => {
      let match = true;
      if (query.email && u.email.toLowerCase() !== query.email.toLowerCase()) match = false;
      if (query._id && u._id !== query._id) match = false;
      return match;
    }) || null;
  },

  async findById(id) {
    if (isMongoActive()) {
      return await MongoUser.findById(id);
    }
    const store = getLocalStore();
    return store.users.find(u => u._id === id || u.id === id) || null;
  },

  async find(query = {}) {
    if (isMongoActive()) {
      return await MongoUser.find(query);
    }
    const store = getLocalStore();
    return store.users.filter(u => {
      if (query.role && u.role !== query.role) return false;
      return true;
    });
  },

  async create(data) {
    if (isMongoActive()) {
      return await MongoUser.create(data);
    }
    const store = getLocalStore();
    const newUser = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    store.users.push(newUser);
    saveLocalStore();
    return newUser;
  },

  async countDocuments(query = {}) {
    if (isMongoActive()) {
      return await MongoUser.countDocuments(query);
    }
    return (await this.find(query)).length;
  }
};

module.exports = UserModel;
