import mongoose from 'mongoose';

const StatisticItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: Number, required: true },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '+' },
  description: { type: String, default: '' }
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  studioName: {
    type: String,
    default: 'OM NATRAJ DANCE STUDIO'
  },
  tagline: {
    type: String,
    default: 'Where Movement Becomes Expression.'
  },
  secondaryText: {
    type: String,
    default: 'Learn. Move. Perform. Create.'
  },
  phone: {
    type: String,
    default: '+91 9713799075'
  },
  whatsappNumber: {
    type: String,
    default: '919713799075'
  },
  email: {
    type: String,
    default: 'kushanikt667@gmail.com'
  },
  address: {
    type: String,
    default: 'Indore, Madhya Pradesh, India'
  },
  city: {
    type: String,
    default: 'Indore'
  },
  state: {
    type: String,
    default: 'Madhya Pradesh'
  },
  country: {
    type: String,
    default: 'India'
  },
  youtubeUrl: {
    type: String,
    default: 'https://www.youtube.com/@OMNDS'
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/omnatrajdancestudio'
  },
  facebookUrl: {
    type: String,
    default: ''
  },
  introHeading: {
    type: String,
    default: "Dance is not just about learning steps.\nIt's about finding your own rhythm."
  },
  introSubtext: {
    type: String,
    default: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers.'
  },
  statistics: {
    type: [StatisticItemSchema],
    default: [
      { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+', description: 'Nurturing dance excellence in Indore' },
      { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+', description: 'Across all age groups and skill levels' },
      { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+', description: 'Bollywood, Garba, Hip-Hop, Contemporary & more' },
      { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+', description: 'Annual concerts, sangeet & cultural fests' }
    ]
  },
  footerText: {
    type: String,
    default: 'A premier dance academy fostering rhythm, confidence, and artistic performance in Indore, Madhya Pradesh.'
  }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
