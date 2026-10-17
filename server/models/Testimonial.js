import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  testimonial: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'Dance Student'
  },
  rating: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  }
}, {
  timestamps: true
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
