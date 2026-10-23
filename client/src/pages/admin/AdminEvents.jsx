import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Calendar, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    date: 'OCT 24 - 28, 2026',
    time: '6:30 PM - 9:00 PM',
    location: 'Om Natraj Dance Studio, Main Arena',
    description: '',
    image: '/images/garba-dance.jpg',
    badge: 'Workshop',
    status: 'upcoming'
  });

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents();
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (err) {
      alert('Error fetching events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      date: 'OCT 24 - 28, 2026',
      time: '6:30 PM - 9:00 PM',
      location: 'Om Natraj Dance Studio, Main Arena',
      description: '',
      image: '/images/garba-dance.jpg',
      badge: 'Workshop',
      status: 'upcoming'
    });
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingId(ev._id);
    setFormData({
      name: ev.name || '',
      date: ev.date || '',
      time: ev.time || '',
      location: ev.location || '',
      description: ev.description || '',
      image: ev.image || '/images/garba-dance.jpg',
      badge: ev.badge || 'Workshop',
      status: ev.status || 'upcoming'
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
    if (!formData.name || !formData.date || !formData.description) {
      alert('Please fill required fields: name, date, description');
      return;
    }

    try {
      if (editingId) {
        await api.updateEvent(editingId, formData);
        alert('Event updated successfully');
      } else {
        await api.createEvent(formData);
        alert('Event created successfully');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert('Failed to save event: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Events & Workshops
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Schedule Garba workshops, wedding choreography crash courses, and annual festivals.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add New Event</span>
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ margin: 0 }}>
          <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Event Title</th>
              <th>Date & Timing</th>
              <th>Venue</th>
              <th>Badge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev._id}>
                <td style={{ width: '80px' }}>
                  <img
                    src={ev.image || '/images/garba-dance.jpg'}
                    alt={ev.name}
                    style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '1rem' }}>{ev.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.description}
                  </span>
                </td>
                <td>
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{ev.date}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{ev.time}</div>
                </td>
                <td style={{ fontSize: '0.88rem' }}>{ev.location}</td>
                <td>
                  <span className="status-badge status-NEW">
                    {ev.badge || 'Workshop'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(ev)}
                      className="admin-btn"
                      style={{ background: '#1e1e28', color: '#fff', padding: '6px 12px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(ev._id)}
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
                {editingId ? 'Edit Event' : 'Create New Event'}
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
                <label className="form-label">Event Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Grand Navratri Garba Intensive Bootcamp"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. OCT 24 - 28, 2026"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 6:30 PM - 9:00 PM"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location / Venue</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Om Natraj Main Studio Arena"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Signature Workshop / Annual Concert"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Status</label>
                  <select
                    value={formData.status || 'upcoming'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-input"
                    style={{ background: '#1c1c24', color: '#fff' }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Workshop itinerary, who can join..."
                  className="form-textarea"
                />
              </div>

              {/* Direct Image Upload */}
              <div className="form-group">
                <label className="form-label">Event Poster Image</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={formData.image || '/images/garba-dance.jpg'}
                    alt="Preview"
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
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
                  {editingId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
