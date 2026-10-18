import express from 'express';
import mongoose from 'mongoose';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/testimonials - Public
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    let items = await StorageService.find('testimonials');
    if (!all) {
      items = items.filter(t => t.status !== 'draft');
    }
    res.json({ success: true, count: items.length, testimonials: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// GET /api/testimonials/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial ID format' });
    }
    const item = await StorageService.findById('testimonials', id);
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, testimonial: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching testimonial' });
  }
});

// POST /api/testimonials - Admin
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, photo, testimonial, role, rating, status } = req.body;
    if (!name || !testimonial) {
      return res.status(400).json({ success: false, message: 'Name and testimonial are required' });
    }

    const newTestimonial = await StorageService.create('testimonials', {
      name: name.trim(),
      photo: photo || '',
      testimonial: testimonial.trim(),
      role: role || 'Dance Enthusiast',
      rating: rating ? Number(rating) : 5,
      status: status || 'published'
    });

    res.status(201).json({ success: true, message: 'Testimonial created', testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create testimonial' });
  }
});

// PUT /api/testimonials/:id - Admin
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial ID format' });
    }
    const updated = await StorageService.findByIdAndUpdate('testimonials', id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial updated', testimonial: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
});

// DELETE /api/testimonials/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial ID format' });
    }
    const deleted = await StorageService.findByIdAndDelete('testimonials', id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
});

export default router;
