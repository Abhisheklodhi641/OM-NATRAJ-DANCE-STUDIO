import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/leads - Public Lead Capture
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, interestedIn, preferredClass, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and Phone number are required'
      });
    }

    const newLead = await StorageService.create('leads', {
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim().toLowerCase(),
      interestedIn: interestedIn || 'General Dance Training',
      preferredClass: preferredClass || 'Any Style',
      message: (message || '').trim(),
      status: 'NEW',
      notes: ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our dance master will contact you shortly.',
      lead: newLead
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please try again or WhatsApp us directly.'
    });
  }
});

// GET /api/leads - Admin List, Search & Filter
router.get('/', protectAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let leads = await StorageService.find('leads');

    if (status && status !== 'ALL') {
      leads = leads.filter(l => l.status === status);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      leads = leads.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.interestedIn && l.interestedIn.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
});

// PATCH /api/leads/:id - Admin update status or notes
router.patch('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'FOLLOW-UP', 'CONVERTED', 'CLOSED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedLead = await StorageService.findByIdAndUpdate('leads', id, updateData);
    if (!updatedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id - Admin delete lead
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StorageService.findByIdAndDelete('leads', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
});

export default router;
