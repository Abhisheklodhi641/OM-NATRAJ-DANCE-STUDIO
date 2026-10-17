import express from 'express';
import { StorageService } from '../services/storageService.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/products - Public
router.get('/', async (req, res) => {
  try {
    const { all, category } = req.query;
    let products = await StorageService.find('products');
    if (!all) {
      products = products.filter(p => p.published !== false);
    }
    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await StorageService.findById('products', req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
});

// POST /api/products - Admin
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, price, originalPrice, description, images, sizes, colors, stockStatus, category, published } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ success: false, message: 'Name, price and description are required' });
    }

    const newProduct = await StorageService.create('products', {
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      description: description.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/garba-dress.jpg'],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['Free Size'],
      colors: Array.isArray(colors) ? colors : [],
      stockStatus: stockStatus || 'in_stock',
      category: category || 'Garba Dresses',
      published: published !== undefined ? published : true
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Admin
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);

    const updated = await StorageService.findByIdAndUpdate('products', req.params.id, updateData);
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Admin
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await StorageService.findByIdAndDelete('products', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

export default router;
