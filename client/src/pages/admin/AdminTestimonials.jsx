import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, Star, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Dance Student',
    testimonial: '',
    rating: 5,
    status: 'published'
  });

  const fetchTestimonials = async () => {
    try {
      const res = await api.getTestimonials('?all=true');
      if (res.success && res.testimonials) {
        setTestimonials(res.testimonials);
      }
    } catch (err) {
      alert('Error fetching testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: 'Dance Student',
      testimonial: '',
      rating: 5,
      status: 'published'
    });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingId(t._id);
    setFormData({
      name: t.name || '',
      role: t.role || 'Dance Student',
      testimonial: t.testimonial || '',
      rating: t.rating || 5,
      status: t.status || 'published'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.testimonial) {
      alert('Please fill student name and review');
      return;
    }

    try {
      if (editingId) {
        await api.updateTestimonial(editingId, formData);
        alert('Testimonial updated');
      } else {
        await api.createTestimonial(formData);
        alert('Testimonial added');
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to save testimonial: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Performer Testimonials
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage verified student stories and review ratings.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ margin: 0 }}>
          <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Role / Batch</th>
              <th>Review Text</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t._id}>
                <td>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '1rem' }}>{t.name}</strong>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{t.role}</span>
                </td>
                <td>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.5, margin: 0 }}>
                    "{t.testimonial}"
                  </p>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--accent-gold)' }}>
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--accent-gold)" />
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${t.status === 'published' ? 'status-CONVERTED' : 'status-CLOSED'}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(t)}
                      className="admin-btn"
                      style={{ background: '#1e1e28', color: '#fff', padding: '6px 12px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
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
            maxWidth: '540px',
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
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
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
                <label className="form-label">Student / Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pooja Verma"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role / Batch *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Garba Workshop Participant"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="form-select"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial Quote *</label>
                <textarea
                  required
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  placeholder="Write the review..."
                  className="form-textarea"
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
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.82rem' }}
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
