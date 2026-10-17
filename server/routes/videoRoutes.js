import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/videos - Public
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    let videos = await StorageService.find('videos');
    if (!all) {
      videos = videos.filter(v => v.published !== false);
    }
    res.json({ success: true, count: videos.length, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
});

// POST /api/videos - Admin
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, posterUrl, duration, featured, published } = req.body;
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and video are required' });
    }

    const newVideo = await StorageService.create('videos', {
      title: title.trim(),
      description: (description || '').trim(),
      videoUrl: videoUrl.trim(),
      posterUrl: posterUrl || '/images/hero-dance.jpg',
      duration: duration || '01:30',
      featured: Boolean(featured),
      published: published !== undefined ? published : true
    });

    res.status(201).json({ success: true, message: 'Video added successfully', video: newVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create video' });
  }
});

// PUT /api/videos/:id - Admin
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updated = await StorageService.findByIdAndUpdate('videos', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video updated', video: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update video' });
  }
});

// DELETE /api/videos/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await StorageService.findByIdAndDelete('videos', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
});

export default router;
