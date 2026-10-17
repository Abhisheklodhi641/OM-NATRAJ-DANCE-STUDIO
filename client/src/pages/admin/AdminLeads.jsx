import React, { useState, useEffect } from 'react';
import { Search, Trash2, MessageSquare, Phone, Mail, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notesInput, setNotesInput] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads(filterStatus, searchQuery);
      if (res.success && res.leads) {
        setLeads(res.leads);
      }
    } catch (err) {
      alert('Error fetching leads: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateLead(id, { status });
      setLeads(prev => prev.map(l => (l._id === id ? { ...l, status } : l)));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    try {
      await api.updateLead(selectedLead._id, { notes: notesInput });
      setLeads(prev => prev.map(l => (l._id === selectedLead._id ? { ...l, notes: notesInput } : l)));
      setSelectedLead(prev => ({ ...prev, notes: notesInput }));
      alert('Notes saved successfully');
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry lead?')) return;
    try {
      await api.deleteLead(id);
      setLeads(prev => prev.filter(l => l._id !== id));
      if (selectedLead && selectedLead._id === id) setSelectedLead(null);
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  const statuses = ['ALL', 'NEW', 'CONTACTED', 'FOLLOW-UP', 'CONVERTED', 'CLOSED'];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Student Inquiries & Leads
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Capture and track all class admissions, workshop bookings, and wedding choreography requests.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="admin-btn"
          style={{ background: '#1c1c24', color: '#fff' }}
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        
        {/* Status Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                background: filterStatus === st ? 'var(--accent-gold)' : '#191921',
                color: filterStatus === st ? '#070709' : '#9c99a6',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: filterStatus === st ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, email..."
              className="admin-search-input"
              style={{ paddingLeft: '36px', width: '260px' }}
            />
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '0 16px' }}>
            Search
          </button>
        </form>

      </div>

      {/* Main Table + Detail Drawer Split */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Leads Table */}
        <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-gold)' }}>
              Loading Leads...
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No leads found matching current filter.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Candidate</th>
                    <th>Phone / WhatsApp</th>
                    <th>Style & Batch</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                    return (
                      <tr
                        key={lead._id}
                        style={{
                          background: selectedLead && selectedLead._id === lead._id ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedLead(lead);
                          setNotesInput(lead.notes || '');
                        }}
                      >
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td>
                          <strong style={{ color: '#fff', display: 'block' }}>{lead.name}</strong>
                          {lead.email && <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{lead.email}</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: '#25d366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare size={14} />
                              {lead.phone}
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: 'var(--text-dim)' }}
                              title="Direct Phone Call"
                            >
                              <Phone size={14} />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.88rem', color: '#fff' }}>{lead.interestedIn || 'General Dance'}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>{lead.preferredClass || 'Any batch'}</div>
                        </td>
                        <td>
                          <select
                            value={lead.status || 'NEW'}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            style={{
                              background: '#191921',
                              color: '#fff',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '0.78rem'
                            }}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="FOLLOW-UP">FOLLOW-UP</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLead(lead._id);
                            }}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '6px 10px' }}
                            title="Delete Lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Lead Details Drawer */}
        {selectedLead && (
          <div className="admin-card" style={{ position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '2px' }}>
                  {selectedLead.name}
                </h3>
                <span className={`status-badge status-${selectedLead.status}`}>
                  {selectedLead.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>PHONE / WHATSAPP:</span>
                <strong style={{ color: '#fff' }}>{selectedLead.phone}</strong>
              </div>
              {selectedLead.email && (
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>EMAIL:</span>
                  <span style={{ color: '#fff' }}>{selectedLead.email}</span>
                </div>
              )}
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>DANCE STYLE:</span>
                <span style={{ color: 'var(--accent-gold)' }}>{selectedLead.interestedIn}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>PREFERRED BATCH:</span>
                <span>{selectedLead.preferredClass}</span>
              </div>
              {selectedLead.message && (
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>STUDENT MESSAGE:</span>
                  <p style={{ background: '#191921', padding: '10px', borderRadius: '4px', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    "{selectedLead.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <a
                href={`https://wa.me/${(selectedLead.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.name}, this is Om Natraj Dance Studio following up on your enquiry!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ flex: 1, padding: '10px', fontSize: '0.78rem' }}
              >
                <MessageSquare size={14} />
                WhatsApp
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="btn btn-outline"
                style={{ flex: 1, padding: '10px', fontSize: '0.78rem' }}
              >
                <Phone size={14} />
                Call
              </a>
            </div>

            {/* Admin Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Internal Follow-up Notes:
              </label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="e.g. Spoke on phone, wants trial class this Saturday at 6pm..."
                className="form-textarea"
                style={{ minHeight: '90px', fontSize: '0.85rem', marginBottom: '10px' }}
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="admin-btn admin-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Save Notes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
