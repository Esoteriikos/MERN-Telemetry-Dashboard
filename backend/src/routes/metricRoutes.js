const express = require('express');
const router = express.Router();

// Import all metric models
const CpuMetric = require('../models/cpuMetric');
const MemoryMetric = require('../models/memoryMetric');
const DiskMetric = require('../models/diskMetric');
const NetworkMetric = require('../models/networkMetric');

// CPU endpoint
router.get('/cpu', async (req, res) => {
  try {
    const latestCpuMetric = await CpuMetric.findOne().sort({ timestamp: -1 }).limit(1);
    res.json(latestCpuMetric);
  } catch (error) {
    console.error('Error fetching CPU metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Memory endpoint
router.get('/memory', async (req, res) => {
  try {
    const latestMemoryMetric = await MemoryMetric.findOne().sort({ timestamp: -1 }).limit(1);
    res.json(latestMemoryMetric);
  } catch (error) {
    console.error('Error fetching Memory metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Disk endpoint
router.get('/disk', async (req, res) => {
  try {
    const latestDiskMetric = await DiskMetric.findOne().sort({ timestamp: -1 }).limit(1);
    res.json(latestDiskMetric);
  } catch (error) {
    console.error('Error fetching Disk metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Network endpoint
router.get('/network', async (req, res) => {
  try {
    const latestNetworkMetric = await NetworkMetric.findOne().sort({ timestamp: -1 }).limit(1);
    res.json(latestNetworkMetric);
  } catch (error) {
    console.error('Error fetching Network metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
