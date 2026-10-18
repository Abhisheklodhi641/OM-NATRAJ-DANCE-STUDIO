import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id, username, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production.');
  }
  return jwt.sign({ id, username, role }, secret || 'om_natraj_super_secret_jwt_key_2026_cinematic', { expiresIn: '7d' });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').toLowerCase().trim();
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username/email and password' });
    }

    // Look up by username or email
    let admin = await StorageService.findOne('admin', { username: identifier });
    if (!admin) {
      admin = await StorageService.findOne('admin', { email: identifier });
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (admin.status && admin.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Admin account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, admin.username, admin.role || 'admin');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status || 'active',
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', protectAdmin, async (req, res) => {
  try {
    const admin = await StorageService.findById('admin', req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status || 'active',
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving profile' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
