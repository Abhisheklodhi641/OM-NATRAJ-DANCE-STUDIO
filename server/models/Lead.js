import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  interestedIn: {
    type: String,
    trim: true,
    default: 'General Dance Training'
  },
  preferredClass: {
    type: String,
    trim: true,
    default: 'Any Style'
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'FOLLOW-UP', 'CONVERTED', 'CLOSED'],
    default: 'NEW',
    index: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

LeadSchema.index({ name: 'text', phone: 'text', email: 'text' });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
