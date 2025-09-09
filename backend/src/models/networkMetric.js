const mongoose = require('mongoose');

const networkMetricSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  interfaces: [{
    iface: String,
    ip4: String,
    rx_sec: Number,
    tx_sec: Number
  }]
});

const NetworkMetric = mongoose.model('NetworkMetric', networkMetricSchema);

module.exports = NetworkMetric;
