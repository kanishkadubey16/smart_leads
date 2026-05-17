import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

// Load Env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Standard Middlewares
app.use(cors({
  origin: '*', // Allow all origins for local development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Main Router Declarations
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Healthy check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Generic 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Smart Leads Backend Service Started!`);
  console.log(`🔌 Listening on: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});

export default app;
