import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    default: 'Free Size'
  }],
  colors: [{
    type: String
  }],
  stockStatus: {
    type: String,
    enum: ['in_stock', 'pre_order', 'out_of_stock'],
    default: 'in_stock'
  },
  category: {
    type: String,
    default: 'Garba Dresses'
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
