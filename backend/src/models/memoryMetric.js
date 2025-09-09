const mongoose = require('mongoose');

const memoryMetricSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  total: {
    type: Number,
    required: true
  },
  free: {
    type: Number,
    required: true
  },
  used: {
    type: Number,
    required: true
  },
  active: {
    type: Number,
    required: true
  },
  usedPercent: {
    type: Number,
    required: true
  }
});

const MemoryMetric = mongoose.model('MemoryMetric', memoryMetricSchema);

module.exports = MemoryMetric;
