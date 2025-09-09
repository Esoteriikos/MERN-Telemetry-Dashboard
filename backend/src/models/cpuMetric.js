const mongoose = require('mongoose');

const cpuMetricSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  currentLoad: {
    type: Number,
    required: true
  },
  userLoad: {
    type: Number,
    required: true
  },
  systemLoad: {
    type: Number,
    required: true
  },
  cores: {
    type: Number,
    required: true
  },
  speed: {
    type: Number
  }
});

const CpuMetric = mongoose.model('CpuMetric', cpuMetricSchema);

module.exports = CpuMetric;
