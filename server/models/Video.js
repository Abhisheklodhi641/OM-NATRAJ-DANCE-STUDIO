import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    default: '/images/hero-dance.jpg'
  },
  duration: {
    type: String,
    default: '01:45'
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
