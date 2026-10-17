import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/events - Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const events = await StorageService.find('events', filter);
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// POST /api/events - Admin
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, date, time, location, description, image, badge, status } = req.body;
    if (!name || !date || !description) {
      return res.status(400).json({ success: false, message: 'Event name, date and description are required' });
    }

    const newEvent = await StorageService.create('events', {
      name: name.trim(),
      date: date.trim(),
      time: time || '6:00 PM onwards',
      location: location || 'Om Natraj Dance Studio, Indore',
      description: description.trim(),
      image: image || '/images/garba-dance.jpg',
      badge: badge || 'Workshop',
      status: status || 'upcoming'
    });

    res.status(201).json({ success: true, message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Admin
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updated = await StorageService.findByIdAndUpdate('events', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event updated successfully', event: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await StorageService.findByIdAndDelete('events', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

export default router;
