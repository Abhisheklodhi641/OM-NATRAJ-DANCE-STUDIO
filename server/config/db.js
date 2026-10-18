import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let isMongoConnected = false;

// Mask credentials for safe logging
const maskMongoUri = (uri) => {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri && (process.env.NODE_ENV === 'production' || process.env.DISABLE_LOCAL_FALLBACK === 'true')) {
    throw new Error('MONGODB_URI environment variable is required.');
  }
  const effectiveUri = uri || 'mongodb://127.0.0.1:27017/om_natraj_dance_studio';
  const maskedUri = maskMongoUri(effectiveUri);

  // Connection Event Listeners
  mongoose.connection.on('connected', () => {
    isMongoConnected = true;
    console.log(`[Database] MongoDB Atlas: CONNECTED`);
    console.log(`[Database] Database name: ${mongoose.connection.name}`);
    console.log(`[Database] Fallback local storage: NOT USED`);
  });

  mongoose.connection.on('error', (err) => {
    isMongoConnected = false;
    console.error(`[Database Error] MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
    console.warn(`[Database Warning] MongoDB disconnected.`);
    if (process.env.DISABLE_LOCAL_FALLBACK === 'true') {
      console.error(`[Database Error] Local fallback is strictly disabled.`);
    }
  });

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(effectiveUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    isMongoConnected = true;
    console.log(`[Database] Successfully connected to MongoDB Atlas (${maskedUri})`);
    console.log(`[Database] Active Database: ${mongoose.connection.name}`);
    console.log(`[Database] Fallback local storage: NOT USED`);
  } catch (error) {
    isMongoConnected = false;
    console.error(`[Database Error] MongoDB Atlas connection error: ${error.message}`);
    if (process.env.DISABLE_LOCAL_FALLBACK === 'true') {
      throw new Error(`MongoDB Atlas connection failed: ${error.message}`);
    }
    console.warn(`[Database] MongoDB Atlas not directly reachable (${error.message}).`);
    console.log(`[Database] Activating Resilient Local Persistent Storage Engine (server/data/). All CRUD, Leads & Settings will work seamlessly without downtime.`);
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
};

// Graceful shutdown handling
const handleGracefulShutdown = async (signal) => {
  console.log(`[Database] Received ${signal}. Closing MongoDB connection gracefully...`);
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log('[Database] MongoDB connection closed.');
    }
  } catch (err) {
    console.error('[Database] Error closing MongoDB connection:', err.message);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
