import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoConnected } from '../config/db.js';

import AdminModel from '../models/Admin.js';
import LeadModel from '../models/Lead.js';
import ClassModel from '../models/Class.js';
import EventModel from '../models/Event.js';
import GalleryModel from '../models/Gallery.js';
import VideoModel from '../models/Video.js';
import ProductModel from '../models/Product.js';
import TestimonialModel from '../models/Testimonial.js';
import SettingsModel from '../models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers for file-based fallback
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
};

const writeCollection = (collection, data) => {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const generateId = () => {
  return `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 9)}`;
};

const isStrictDb = () => process.env.NODE_ENV === 'production' || process.env.DISABLE_LOCAL_FALLBACK === 'true';

/**
 * Storage Service that abstracts Mongoose and Local Persistent JSON storage
 */
export const StorageService = {
  // Collections
  collections: {
    admin: AdminModel,
    leads: LeadModel,
    classes: ClassModel,
    events: EventModel,
    gallery: GalleryModel,
    videos: VideoModel,
    products: ProductModel,
    testimonials: TestimonialModel,
    settings: SettingsModel
  },

  async find(collectionName, query = {}, sort = { createdAt: -1 }) {
    if (isMongoConnected) {
      try {
        const Model = this.collections[collectionName];
        return await Model.find(query).sort(sort).lean();
      } catch (err) {
        if (isStrictDb()) throw err;
        console.warn(`[Mongo Query Fallback on ${collectionName}]:`, err.message);
      }
    }

    if (isStrictDb()) {
      throw new Error(`[Database Error] MongoDB Atlas is not connected and local storage fallback is disabled.`);
    }

    // Local JSON Fallback
    let items = readCollection(collectionName);
    
    // Simple filter matching
    if (Object.keys(query).length > 0) {
      items = items.filter(item => {
        return Object.entries(query).every(([k, v]) => {
          if (v === undefined) return true;
          if (typeof v === 'object' && v !== null) {
            if (v.$regex) {
              const regex = new RegExp(v.$regex, v.$options || 'i');
              return regex.test(item[k]);
            }
          }
          return item[k] === v;
        });
      });
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return items;
  },

  async findById(collectionName, id) {
    if (isMongoConnected) {
      if (!mongoose.isValidObjectId(id)) {
        return null;
      }
      try {
        const Model = this.collections[collectionName];
        return await Model.findById(id).lean();
      } catch (err) {
        if (isStrictDb()) throw err;
        console.warn(`[Mongo findById Fallback]:`, err.message);
      }
    }

    if (isStrictDb()) {
      throw new Error(`[Database Error] MongoDB Atlas is not connected and local storage fallback is disabled.`);
    }

    const items = readCollection(collectionName);
    return items.find(i => i._id === id || i.id === id) || null;
  },

  async findOne(collectionName, query = {}) {
    if (isMongoConnected) {
      try {
        const Model = this.collections[collectionName];
        return await Model.findOne(query).lean();
      } catch (err) {
        if (isStrictDb()) throw err;
        console.warn(`[Mongo findOne Fallback]:`, err.message);
      }
    }

    if (isStrictDb()) {
      throw new Error(`[Database Error] MongoDB Atlas is not connected and local storage fallback is disabled.`);
    }

    const items = await this.find(collectionName, query);
    return items[0] || null;
  },

  async create(collectionName, data) {
    const timestamp = new Date().toISOString();
    if (isMongoConnected) {
      try {
        const Model = this.collections[collectionName];
        const doc = await Model.create(data);
        return doc.toObject();
      } catch (err) {
        if (isStrictDb()) throw err;
        console.warn(`[Mongo create Fallback]:`, err.message);
      }
    }

    if (isStrictDb()) {
      throw new Error(`[Database Error] MongoDB Atlas is not connected and local storage fallback is disabled.`);
    }

    const items = readCollection(collectionName);
    const newItem = {
      _id: generateId(),
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    items.unshift(newItem);
    writeCollection(collectionName, items);
    return newItem;
  },

  async findByIdAndUpdate(collectionName, id, updateData) {
    const timestamp = new Date().toISOString();
    if (isMongoConnected) {
      if (!mongoose.isValidObjectId(id)) {
        return null;
      }
      try {
        const Model = this.collections[collectionName];
        return await Model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
      } catch (err) {
        if (isStrictDb()) throw err;
        console.warn(`[Mongo update Fallback]:`, err.message);
      }
    }

    if (isStrictDb()) {
      throw new Error(`[Database Error] MongoDB Atlas is not connected and local storage fallback is disabled.`);
    }

    const items = readCollection(collectionName);
    const index = items.findIndex(i => i._id === id || i.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updateData,
      updatedAt: timestamp
    };
    writeCollection(collectionName, items);
    return items[index];
  },

  async findByIdAndDelete(collectionName, id) {
    if (isMongoConnected) {
      if (!mongoose.isValidObjectId(id)) {
        return null;
      }
      try {
        const Model = this.collections[collectionName];
        return await Model.findByIdAndDelete(id).lean();
      } catch (err) {
        if (isStrictDb()) throw err;
        console.warn(`[Mongo delete Fallback]:`, err.message);
      }
    }

    if (isStrictDb()) {
      throw new Error(`[Database Error] MongoDB Atlas is not connected and local storage fallback is disabled.`);
    }

    let items = readCollection(collectionName);
    const itemToDelete = items.find(i => i._id === id || i.id === id);
    if (!itemToDelete) return null;

    items = items.filter(i => i._id !== id && i.id !== id);
    writeCollection(collectionName, items);
    return itemToDelete;
  },

  async count(collectionName, query = {}) {
    if (isMongoConnected) {
      try {
        const Model = this.collections[collectionName];
        return await Model.countDocuments(query);
      } catch (err) {
        if (isStrictDb()) throw err;
      }
    }
    const items = await this.find(collectionName, query);
    return items.length;
  }
};
