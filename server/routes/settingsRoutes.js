import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const defaultSettings = {
  studioName: 'OM NATRAJ DANCE STUDIO',
  tagline: 'Where Movement Becomes Expression.',
  secondaryText: 'Learn. Move. Perform. Create.',
  phone: '+91 9713799075',
  whatsappNumber: '919713799075',
  email: 'kushanikt667@gmail.com',
  address: 'Indore, Madhya Pradesh, India',
  city: 'Indore',
  state: 'Madhya Pradesh',
  country: 'India',
  youtubeUrl: 'https://www.youtube.com/@OMNDS',
  instagramUrl: 'https://instagram.com/omnatrajdancestudio',
  facebookUrl: '',
  introHeading: "Dance is not just about learning steps.\nIt's about finding your own rhythm.",
  introSubtext: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers in Indore.',
  statistics: [
    { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+', description: 'Nurturing dance excellence in Indore' },
    { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+', description: 'Across kids, youth & adult batches' },
    { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+', description: 'Bollywood, Garba, Hip-Hop, Contemporary & more' },
    { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+', description: 'Annual concerts, sangeet & cultural fests' }
  ],
  footerText: 'A premier dance academy fostering rhythm, confidence, and artistic performance in Indore, Madhya Pradesh.'
};

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    const list = await StorageService.find('settings');
    let settings = list[0];
    if (!settings) {
      settings = await StorageService.create('settings', defaultSettings);
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Settings error:', error);
    res.json({ success: true, settings: defaultSettings });
  }
});

// PUT /api/settings - Admin Update
router.put('/', protectAdmin, async (req, res) => {
  try {
    const list = await StorageService.find('settings');
    let settings = list[0];
    let updated;
    if (settings) {
      updated = await StorageService.findByIdAndUpdate('settings', settings._id, req.body);
    } else {
      updated = await StorageService.create('settings', { ...defaultSettings, ...req.body });
    }
    res.json({ success: true, message: 'Settings updated successfully', settings: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

export default router;
