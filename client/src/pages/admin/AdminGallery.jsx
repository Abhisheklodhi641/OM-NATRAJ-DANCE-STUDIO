import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, EyeOff, Plus, Check, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'Performances',
    imageUrl: '',
    published: true
  });

  const fetchGallery = async () => {
    try {
      const res = await api.getGallery('?all=true');
      if (res.success && res.gallery) {
        setGallery(res.gallery);
      }
    } catch (err) {
      alert('Error fetching gallery: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setNewItem(prev => ({
          ...prev,
          imageUrl: res.file.url,
          title: prev.title || file.name.split('.')[0].replace(/[-_]/g, ' ')
        }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newItem.imageUrl) {
      alert('Please upload an image first');
      return;
    }
    if (!newItem.title) {
      alert('Please enter a title');
      return;
    }

    try {
      await api.createGalleryItem(newItem);
      alert('Image added to gallery!');
      setModalOpen(false);
      setNewItem({ title: '', description: '', category: 'Performances', imageUrl: '', published: true });
      fetchGallery();
    } catch (err) {
      alert('Failed to save gallery item: ' + err.message);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await api.updateGalleryItem(id, { published: !currentStatus });
      setGallery(prev => prev.map(g => (g._id === id ? { ...g, published: !currentStatus } : g)));
    } catch (err) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      await api.deleteGalleryItem(id);
      setGallery(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Gallery & Media Assets
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Upload photographs directly from your computer or phone. No external URLs needed.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="admin-btn admin-btn-primary">
          <Upload size={16} />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Gallery Media Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.75rem'
      }}>
        {gallery.map((item) => (
          <div key={item._id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '220px', background: '#0e0e14' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => handleTogglePublish(item._id, item.published)}
                  style={{
                    background: item.published ? 'rgba(76, 175, 80, 0.85)' : 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={item.published ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                >
                  {item.published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    background: 'rgba(244, 67, 54, 0.85)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Delete image"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(7,7,9,0.8)',
                padding: '4px 10px',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-gold)'
              }}>
                {item.category || 'Performances'}
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.description || 'No description provided'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Upload Modal */}
      {modalOpen && (
        <div className="lightbox-backdrop">
          <div className="glass-panel" style={{
            maxWidth: '540px',
            width: '100%',
            padding: '2.5rem',
            background: '#121218',
            border: '1px solid var(--border-gold)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                Upload Dance Photo
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              {/* File Drop / Select Area */}
              <div style={{
                border: '2px dashed var(--border-gold)',
                borderRadius: '6px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                background: 'rgba(212, 175, 55, 0.03)'
              }}>
                {newItem.imageUrl ? (
                  <div>
                    <img
                      src={newItem.imageUrl}
                      alt="Uploaded preview"
                      style={{ maxHeight: '180px', margin: '0 auto 1rem', borderRadius: '4px' }}
                    />
                    <span style={{ color: '#81c784', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.88rem' }}>
                      <Check size={16} /> File uploaded successfully
                    </span>
                  </div>
                ) : (
                  <div>
                    <Upload size={36} color="var(--accent-gold)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>
                      Select photo from your device
                    </p>
                    <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
                      <span>{uploading ? 'Processing File...' : 'Choose Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Navratri Dandiya Twilight Twirl"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Performances">Performances</option>
                  <option value="Garba">Garba</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Wedding Dance">Wedding Dance</option>
                  <option value="Kids Dance">Kids Dance</option>
                  <option value="Studio Space">Studio Space</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Short caption or context..."
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                />
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
                  disabled={uploading || !newItem.imageUrl}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.82rem' }}
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
