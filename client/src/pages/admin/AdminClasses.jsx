import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Check, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    danceStyle: 'Bollywood',
    description: '',
    ageGroup: 'All Ages (Kids & Adults)',
    level: 'All Levels (Beginner to Advanced)',
    schedule: 'Mon, Wed, Fri | 6:00 PM - 7:30 PM',
    instructor: 'Master Choreographers',
    image: '/images/bollywood-hiphop.jpg',
    status: 'active'
  });

  const fetchClasses = async () => {
    try {
      const res = await api.getClasses('');
      if (res.success && res.classes) {
        setClasses(res.classes);
      }
    } catch (err) {
      alert('Error fetching classes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      danceStyle: 'Bollywood',
      description: '',
      ageGroup: 'All Ages',
      level: 'All Levels',
      schedule: 'Mon - Fri',
      instructor: 'Lead Choreographer',
      image: '/images/bollywood-hiphop.jpg',
      status: 'active'
    });
    setModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingId(cls._id);
    setFormData({
      name: cls.name || '',
      danceStyle: cls.danceStyle || 'Bollywood',
      description: cls.description || '',
      ageGroup: cls.ageGroup || 'All Ages',
      level: cls.level || 'All Levels',
      schedule: cls.schedule || 'Mon - Fri',
      instructor: cls.instructor || 'Lead Choreographer',
      image: cls.image || '/images/bollywood-hiphop.jpg',
      status: cls.status || 'active'
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
        setFormData(prev => ({ ...prev, image: res.file.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.danceStyle || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await api.updateClass(editingId, formData);
        alert('Class updated successfully');
      } else {
        await api.createClass(formData);
        alert('Class created successfully');
      }
      setModalOpen(false);
      fetchClasses();
    } catch (err) {
      alert('Failed to save class: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dance class?')) return;
    try {
      await api.deleteClass(id);
      setClasses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Dance Classes Curriculum
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage the studio programs, style categories, batch timings, and instructors.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Classes Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ margin: 0 }}>
          <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Class Name & Style</th>
              <th>Level & Ages</th>
              <th>Batch Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td style={{ width: '80px' }}>
                  <img
                    src={cls.image || '/images/hero-dance.jpg'}
                    alt={cls.name}
                    style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '1rem' }}>{cls.name}</strong>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                    {cls.danceStyle}
                  </span>
                </td>
                <td>
                  <div>{cls.level}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{cls.ageGroup}</div>
                </td>
                <td>{cls.schedule}</td>
                <td>
                  <span className={`status-badge ${cls.status === 'active' ? 'status-CONVERTED' : 'status-CLOSED'}`}>
                    {cls.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(cls)}
                      className="admin-btn"
                      style={{ background: '#1e1e28', color: '#fff', padding: '6px 12px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
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

      {/* Add / Edit Modal */}
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
                {editingId ? 'Edit Dance Class' : 'Create New Dance Class'}
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
                <label className="form-label">Class Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Authentic Garba Masterclass"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dance Style *</label>
                  <input
                    type="text"
                    required
                    value={formData.danceStyle}
                    onChange={(e) => setFormData({ ...formData, danceStyle: e.target.value })}
                    placeholder="e.g. Garba / Contemporary / Bollywood"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Level</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g. Beginner to Advanced"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Age Group</label>
                  <input
                    type="text"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    placeholder="e.g. Teens & Adults (13+)"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Batch Schedule</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="e.g. Mon, Wed, Fri | 6:00 PM"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Instructor / Faculty</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="e.g. Lead Garba Choreographer"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Class Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-input"
                    style={{ background: '#1c1c24', color: '#fff' }}
                  >
                    <option value="active">Active (Visible on Site)</option>
                    <option value="inactive">Inactive (Archived)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of curriculum, techniques taught..."
                  className="form-textarea"
                />
              </div>

              {/* Direct Image Upload */}
              <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={formData.image || '/images/hero-dance.jpg'}
                    alt="Preview"
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
                      <Upload size={14} />
                      <span>{uploading ? 'Uploading...' : 'Select File from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      JPG, PNG, WEBP (Direct upload)
                    </span>
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
                  {editingId ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
