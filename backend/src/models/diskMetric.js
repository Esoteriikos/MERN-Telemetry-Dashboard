const mongoose = require('mongoose');

const diskMetricSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  filesystems: [{
    fs: String,
    size: Number,
    used: Number,
    use: Number,
    mount: String
  }]
});

const DiskMetric = mongoose.model('DiskMetric', diskMetricSchema);

module.exports = DiskMetric;
