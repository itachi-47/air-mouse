const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  baseSensitivity: {
    type: Number,
    default: 10.0,
    min: 1,
    max: 50
  },
  threshold: {
    type: Number,
    default: 0.01,
    min: 0.001,
    max: 0.1
  },
  dynamicScaling: {
    type: Boolean,
    default: true
  },
  invertX: {
    type: Boolean,
    default: true
  },
  invertY: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);