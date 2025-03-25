import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import foodRoutes from './routes/foodRoutes';
import dailyLogRoutes from './routes/dailyLogRoutes';
import settingsRoutes from './routes/settingsRoutes';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
// Configure CORS to accept requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/foods', foodRoutes);
app.use('/api/logs', dailyLogRoutes);
app.use('/api/settings', settingsRoutes);

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Debug route to check data directory
app.get('/api/debug/data-dir', (req, res) => {
  const dataDir = process.env.NODE_ENV === 'production' 
    ? '/app/data' 
    : path.join(__dirname, '../../data');
  
  try {
    const files = fs.readdirSync(dataDir);
    res.status(200).json({ 
      dataDir, 
      files,
      nodeEnv: process.env.NODE_ENV,
      currentDir: __dirname
    });
  } catch (error) {
    res.status(500).json({ 
      error: `Error reading data directory: ${error}`,
      dataDir,
      nodeEnv: process.env.NODE_ENV,
      currentDir: __dirname
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Current directory: ${__dirname}`);
  console.log(`Data directory: ${process.env.NODE_ENV === 'production' ? '/app/data' : path.join(__dirname, '../../data')}`);
});
