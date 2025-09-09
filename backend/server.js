const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection and routes
const connectDB = require('./src/config/db');
const metricRoutes = require('./src/routes/metricRoutes');

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', metricRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'telemetry-backend-api' });
});

// Define port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Telemetry API Server running on port ${PORT}`);
});
