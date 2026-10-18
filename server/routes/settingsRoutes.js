import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const getDefaultSettings = () => ({
  studioName: process.env.STUDIO_NAME || 'OM NATRAJ DANCE STUDIO',
  tagline: 'Where Movement Becomes Expression.',
  secondaryText: 'Learn. Move. Perform. Create.',
  phone: process.env.STUDIO_PHONE || '+91 9713799075',
  whatsappNumber: process.env.STUDIO_WHATSAPP || '919713799075',
  email: process.env.STUDIO_EMAIL || 'kushanikt667@gmail.com',
  address: process.env.STUDIO_LOCATION || 'Banmore, Morena, Madhya Pradesh, India',
  city: 'Banmore, Morena',
  state: 'Madhya Pradesh',
  country: 'India',
  pincode: '476444',
  googleMapsUrl: 'https://maps.google.com/?q=Banmore,Morena,Madhya+Pradesh',
  latitude: 26.3533,
  longitude: 78.1182,
  youtubeUrl: 'https://www.youtube.com/@OMNDS',
  instagramUrl: 'https://instagram.com/omnatrajdancestudio',
  facebookUrl: '',
  heroMedia: '/images/hero-dance.jpg',
  aboutImage: '/images/masterclass-action.jpg',
  cinematicVideo: '',
  ctaImage: '/images/workshop-banner.jpg',
  introHeading: "Dance is not just about learning steps.\nIt's about finding your own rhythm.",
  introSubtext: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers.',
  statistics: [
    { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+', description: 'Nurturing dance excellence' },
    { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+', description: 'Across kids, youth & adult batches' },
    { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+', description: 'Bollywood, Garba, Hip-Hop, Contemporary & more' },
    { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+', description: 'Annual concerts, sangeet & cultural fests' }
  ],
  footerText: 'A premier dance academy fostering rhythm, confidence, and artistic performance.'
});

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    const list = await StorageService.find('settings');
    let settings = list[0];
    if (!settings) {
      settings = await StorageService.create('settings', getDefaultSettings());
    } else if (list.length > 1) {
      // Clean up any extraneous duplicate settings
      for (let i = 1; i < list.length; i++) {
        await StorageService.findByIdAndDelete('settings', list[i]._id);
      }
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Settings error:', error);
    res.json({ success: true, settings: getDefaultSettings() });
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
      // Clean up any extraneous duplicate settings
      if (list.length > 1) {
        for (let i = 1; i < list.length; i++) {
          await StorageService.findByIdAndDelete('settings', list[i]._id);
        }
      }
    } else {
      updated = await StorageService.create('settings', { ...getDefaultSettings(), ...req.body });
    }
    res.json({ success: true, message: 'Settings updated successfully', settings: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

export default router;
