import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  danceStyle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  ageGroup: {
    type: String,
    default: 'All Ages (Kids & Adults)'
  },
  level: {
    type: String,
    default: 'All Levels (Beginner to Advanced)'
  },
  schedule: {
    type: String,
    default: 'Mon - Fri | Multiple Batches'
  },
  instructor: {
    type: String,
    default: 'Master Choreographers'
  },
  image: {
    type: String,
    default: '/images/bollywood-hiphop.jpg'
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);
