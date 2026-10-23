import express from 'express';
import mongoose from 'mongoose';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { deleteMediaByUrl } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET /api/gallery - Public (published only by default)
router.get('/', async (req, res) => {
  try {
    const { all, category } = req.query;
    let items = await StorageService.find('gallery');
    if (!all) {
      items = items.filter(i => i.published !== false);
    }
    if (category && category !== 'All') {
      items = items.filter(i => i.category === category);
    }
    res.json({ success: true, count: items.length, gallery: items, items: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery' });
  }
});

// GET /api/gallery/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID format' });
    }
    const item = await StorageService.findById('gallery', id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gallery item' });
  }
});

// POST /api/gallery - Admin
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { title, description, category, imageUrl, mediaType, aspectRatio, published } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required' });
    }

    const newItem = await StorageService.create('gallery', {
      title: title.trim(),
      description: (description || '').trim(),
      category: category || 'Performances',
      imageUrl: imageUrl.trim(),
      mediaType: mediaType || 'image',
      aspectRatio: aspectRatio || 'landscape',
      published: published !== undefined ? published : true
    });

    res.status(201).json({ success: true, message: 'Gallery item added', item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add gallery item' });
  }
});

// PUT /api/gallery/:id - Admin
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID format' });
    }
    const updated = await StorageService.findByIdAndUpdate('gallery', id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Gallery item updated', item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update gallery item' });
  }
});

// DELETE /api/gallery/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID format' });
    }
    const deleted = await StorageService.findByIdAndDelete('gallery', id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Item not found' });

    // Permanently destroy Cloudinary / storage asset if present
    if (deleted.imageUrl) {
      try {
        await deleteMediaByUrl(deleted.imageUrl, deleted.mediaType || 'image');
      } catch (mediaErr) {
        console.warn('[Gallery Media Delete Warning]', mediaErr.message);
      }
    }

    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete gallery item' });
  }
});

export default router;
