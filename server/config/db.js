import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/om_natraj_dance_studio';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[Database] Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not reachable (${error.message}).`);
    console.log(`[Database] Activating Resilient Local Persistent Storage Engine (server/data/). All CRUD, Leads & Settings will work seamlessly!`);
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
};
