import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, ShoppingBag, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: 3499,
    originalPrice: 4999,
    description: '',
    images: ['/images/garba-dress.jpg'],
    sizes: 'S, M, L, XL, Free Size',
    colors: 'Maroon & Indigo, Mustard Yellow',
    stockStatus: 'in_stock',
    category: 'Garba Dresses',
    published: true
  });

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts('?all=true');
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      alert('Error fetching products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: 2999,
      originalPrice: 3999,
      description: '',
      images: ['/images/garba-dress.jpg'],
      sizes: 'S, M, L, XL, Free Size',
      colors: 'Festive Red, Royal Blue',
      stockStatus: 'in_stock',
      category: 'Garba Dresses',
      published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name || '',
      price: p.price || 0,
      originalPrice: p.originalPrice || '',
      description: p.description || '',
      images: p.images || ['/images/garba-dress.jpg'],
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : 'Free Size',
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
      stockStatus: p.stockStatus || 'in_stock',
      category: p.category || 'Garba Dresses',
      published: p.published !== false
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setFormData(prev => ({
          ...prev,
          images: [res.file.url, ...prev.images]
        }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill product name, price, and description');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['Free Size'],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : []
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        alert('Product updated successfully');
      } else {
        await api.createProduct(payload);
        alert('Product created successfully');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from boutique?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Products & Dance Couture
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage Garba dresses, brass ghungroos, and dance accessories with direct WhatsApp inquiry generation.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ margin: 0 }}>
          <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes Available</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td style={{ width: '80px' }}>
                  <img
                    src={(p.images && p.images[0]) || '/images/garba-dress.jpg'}
                    alt={p.name}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '1rem' }}>{p.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.description}
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                    {p.category}
                  </span>
                </td>
                <td>
                  <strong style={{ color: 'var(--accent-gold)' }}>₹{p.price.toLocaleString()}</strong>
                  {p.originalPrice && <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString()}</div>}
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {Array.isArray(p.sizes) ? p.sizes.join(', ') : 'Free Size'}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${p.stockStatus === 'in_stock' ? 'status-CONVERTED' : 'status-CONTACTED'}`}>
                    {p.stockStatus || 'in_stock'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(p)}
                      className="admin-btn"
                      style={{ background: '#1e1e28', color: '#fff', padding: '6px 12px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '6px 12px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="lightbox-backdrop">
          <div className="glass-panel" style={{
            maxWidth: '640px',
            width: '100%',
            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
            background: '#121218',
            border: '1px solid var(--border-gold)',
            borderRadius: '8px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Navratri Garba Chaniya Choli Set"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3499"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original / MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="4999"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Garba Dresses">Garba Dresses</option>
                    <option value="Dance Accessories">Dance Accessories</option>
                    <option value="Practice Outfits">Practice Outfits</option>
                    <option value="Other Dance Products">Other Dance Products</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Status</label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                    className="form-select"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="pre_order">Pre-Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL, Free Size"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Colors (comma separated)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Royal Maroon, Indigo, Mustard Yellow"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fabric details, embroidery, mirror work..."
                  className="form-textarea"
                />
              </div>

              {/* Direct Image Upload */}
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={(formData.images && formData.images[0]) || '/images/garba-dress.jpg'}
                    alt="Preview"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
                      <Upload size={14} />
                      <span>{uploading ? 'Uploading...' : 'Upload Image from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '10px 20px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.82rem' }}
                >
                  {editingId ? 'Save Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
