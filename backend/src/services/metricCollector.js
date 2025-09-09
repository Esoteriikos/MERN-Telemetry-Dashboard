const si = require('systeminformation');
const CpuMetric = require('../models/cpuMetric');
const MemoryMetric = require('../models/memoryMetric');
const DiskMetric = require('../models/diskMetric');
const NetworkMetric = require('../models/networkMetric');

const collectAndStoreAllMetrics = async () => {
  try {
    console.log('Collecting system metrics...');
    
    // Fetch all metrics concurrently
    const [cpuData, memData, diskData, networkData] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats()
    ]);

    // Create and save CPU metric
    const cpuMetric = new CpuMetric({
      currentLoad: cpuData.currentLoad,
      userLoad: cpuData.currentLoadUser,
      systemLoad: cpuData.currentLoadSystem,
      cores: cpuData.cpus ? cpuData.cpus.length : 1,
      speed: cpuData.cpus && cpuData.cpus[0] ? cpuData.cpus[0].speed : null
    });
    await cpuMetric.save();

    // Create and save Memory metric
    const memoryMetric = new MemoryMetric({
      total: memData.total,
      free: memData.free,
      used: memData.used,
      active: memData.active,
      usedPercent: (memData.used / memData.total) * 100
    });
    await memoryMetric.save();

    // Create and save Disk metric
    const diskMetric = new DiskMetric({
      filesystems: diskData.map(disk => ({
        fs: disk.fs,
        size: disk.size,
        used: disk.used,
        use: disk.use,
        mount: disk.mount
      }))
    });
    await diskMetric.save();

    // Create and save Network metric
    const networkMetric = new NetworkMetric({
      interfaces: networkData.map(iface => ({
        iface: iface.iface,
        ip4: iface.ip4,
        rx_sec: iface.rx_sec || 0,
        tx_sec: iface.tx_sec || 0
      }))
    });
    await networkMetric.save();

    console.log('Metrics collected and stored successfully');
  } catch (error) {
    console.error('Error collecting metrics:', error);
  }
};

const startMetricCollection = () => {
  console.log('Starting metric collection service...');
  
  // Collect metrics immediately
  collectAndStoreAllMetrics();
  
  // Then collect every 5 seconds
  setInterval(collectAndStoreAllMetrics, 5000);
};

module.exports = { startMetricCollection };
