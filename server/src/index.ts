import express from 'express';
import cors from 'cors';
import path from 'path';
import foodRoutes from './routes/foodRoutes';
import dailyLogRoutes from './routes/dailyLogRoutes';
import settingsRoutes from './routes/settingsRoutes';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
