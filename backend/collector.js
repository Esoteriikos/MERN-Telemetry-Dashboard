require('dotenv').config();
const connectDB = require('./src/config/db');
const { startMetricCollection } = require('./src/services/metricCollector');

const main = async () => {
  try {
    await connectDB();
    startMetricCollection();
    console.log('Metric Collector Service Started...');
  } catch (error) {
    console.error('Failed to start metric collector:', error);
    process.exit(1);
  }
};

main();
