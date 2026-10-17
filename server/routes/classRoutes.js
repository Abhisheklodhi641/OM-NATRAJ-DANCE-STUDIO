import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/classes - Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const classes = await StorageService.find('classes', filter);
    res.json({ success: true, count: classes.length, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch classes' });
  }
});

// GET /api/classes/:id
router.get('/:id', async (req, res) => {
  try {
    const danceClass = await StorageService.findById('classes', req.params.id);
    if (!danceClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, class: danceClass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching class' });
  }
});

// POST /api/classes - Admin
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, danceStyle, description, ageGroup, level, schedule, instructor, image, status } = req.body;
    if (!name || !danceStyle || !description) {
      return res.status(400).json({ success: false, message: 'Name, dance style, and description are required' });
    }

    const newClass = await StorageService.create('classes', {
      name: name.trim(),
      danceStyle: danceStyle.trim(),
      description: description.trim(),
      ageGroup: ageGroup || 'All Ages',
      level: level || 'All Levels',
      schedule: schedule || 'Mon - Fri',
      instructor: instructor || 'Lead Choreographer',
      image: image || '/images/bollywood-hiphop.jpg',
      status: status || 'active'
    });

    res.status(201).json({ success: true, message: 'Class created successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create class' });
  }
});

// PUT /api/classes/:id - Admin
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updated = await StorageService.findByIdAndUpdate('classes', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, message: 'Class updated successfully', class: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update class' });
  }
});

// DELETE /api/classes/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await StorageService.findByIdAndDelete('classes', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete class' });
  }
});

export default router;
