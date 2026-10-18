import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const runSeed = async () => {
  try {
    console.log('====================================================');
    console.log('  OM NATRAJ DANCE STUDIO - MONGODB ATLAS SEED RUNNER');
    console.log('====================================================');

    await connectDB();
    const stats = await seedDatabase();

    console.log('\n--- SEED EXECUTION SUMMARY ---');
    console.log(`Inserted / Updated:`, stats);

    const collections = ['admins', 'classes', 'events', 'galleries', 'leads', 'products', 'settings', 'testimonials', 'videos'];
    console.log('\n--- ATLAS DATABASE COLLECTION COUNTS ---');
    for (const c of collections) {
      const count = await mongoose.connection.db.collection(c).countDocuments();
      console.log(`  ${c.padEnd(15)} : ${count} documents`);
    }

    console.log('\nSeed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\nSeed failed:', error);
    process.exit(1);
  }
};

runSeed();
