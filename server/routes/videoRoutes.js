import express from 'express';
import mongoose from 'mongoose';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { deleteMediaByUrl } from '../middleware/uploadMiddleware.js';

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

// GET /api/videos/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid video ID format' });
    }
    const video = await StorageService.findById('videos', id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching video' });
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
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid video ID format' });
    }
    const updated = await StorageService.findByIdAndUpdate('videos', id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video updated', video: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update video' });
  }
});

// DELETE /api/videos/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid video ID format' });
    }
    const deleted = await StorageService.findByIdAndDelete('videos', id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Video not found' });

    // Permanently destroy Cloudinary video and poster asset
    if (deleted.videoUrl) {
      try {
        await deleteMediaByUrl(deleted.videoUrl, 'video');
      } catch (mediaErr) {
        console.warn('[Video Media Delete Warning]', mediaErr.message);
      }
    }
    if (deleted.posterUrl) {
      try {
        await deleteMediaByUrl(deleted.posterUrl, 'image');
      } catch (mediaErr) {
        console.warn('[Video Poster Delete Warning]', mediaErr.message);
      }
    }

    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
});

export default router;
