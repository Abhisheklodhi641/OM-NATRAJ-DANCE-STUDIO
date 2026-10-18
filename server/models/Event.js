import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: '6:00 PM onwards'
  },
  location: {
    type: String,
    default: 'Banmore, Morena, MP'
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/garba-dance.jpg'
  },
  badge: {
    type: String,
    default: 'Workshop'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
