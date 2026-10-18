import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';
import { connectDB, isMongoConnected } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import classRoutes from './routes/classRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import productRoutes from './routes/productRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Production CORS Configuration
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, uptime monitors)
    if (!origin) return callback(null, true);
    if (!clientUrl || clientUrl === '*' || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads (for local holding/fallback)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Serve images directory (pointing to client/public/images for seamless unified serving)
const clientImagesDir = path.join(__dirname, '..', 'client', 'public', 'images');
app.use('/images', express.static(clientImagesDir));

// Health Check - Verification & Production Status
app.get('/api/health', (req, res) => {
  const mongoStatus = isMongoConnected || mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.json({
    success: true,
    message: 'OM Natraj API is running',
    status: 'online',
    mongoStatus,
    databaseName: mongoose.connection.name || 'omnatraj',
    fallbackLocalStorage: 'NOT USED',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/enquiries', leadRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Serve frontend static build if present (for single-service Render deployment)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/images')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Error handling middleware - Section 16 Production Error Sanitizer
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  // Sanitize message to never expose MongoDB, Cloudinary or JWT credentials
  let safeMessage = err.message || 'Internal Server Error';
  if (isProduction) {
    if (safeMessage.toLowerCase().includes('mongo') || safeMessage.toLowerCase().includes('cloudinary') || safeMessage.toLowerCase().includes('jwt')) {
      safeMessage = 'A database or storage service error occurred.';
    }
  }

  res.status(err.status || 500).json({
    success: false,
    message: safeMessage,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// Start Server and initialize DB
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=========================================`);
      console.log(`  OM NATRAJ DANCE STUDIO - BACKEND API   `);
      console.log(`  Running on: http://0.0.0.0:${PORT}     `);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Fatal server startup error:', error);
  }
};

startServer();
