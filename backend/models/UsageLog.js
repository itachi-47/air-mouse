const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    enum: ['click', 'scroll', 'move', 'connect', 'disconnect'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  sessionDuration: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('UsageLog', UsageLogSchema);