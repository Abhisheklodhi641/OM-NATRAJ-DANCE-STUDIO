import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Layers, Calendar, Image, Video, ShoppingBag, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    classes: 0,
    events: 0,
    gallery: 0,
    videos: 0,
    products: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leadsRes, clsRes, evRes, galRes, vidRes, prodRes] = await Promise.allSettled([
          api.getLeads(),
          api.getClasses(),
          api.getEvents(),
          api.getGallery(),
          api.getVideos(),
          api.getProducts()
        ]);

        const leads = leadsRes.status === 'fulfilled' && leadsRes.value.leads ? leadsRes.value.leads : [];
        const newCount = leads.filter(l => l.status === 'NEW').length;

        setStats({
          totalLeads: leads.length,
          newLeads: newCount,
          classes: clsRes.status === 'fulfilled' && clsRes.value.classes ? clsRes.value.classes.length : 0,
          events: evRes.status === 'fulfilled' && evRes.value.events ? evRes.value.events.length : 0,
          gallery: galRes.status === 'fulfilled' && galRes.value.gallery ? galRes.value.gallery.length : 0,
          videos: vidRes.status === 'fulfilled' && vidRes.value.videos ? vidRes.value.videos.length : 0,
          products: prodRes.status === 'fulfilled' && prodRes.value.products ? prodRes.value.products.length : 0
        });

        setRecentLeads(leads.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateLead(id, { status: newStatus });
      setRecentLeads(prev => prev.map(l => (l._id === id ? { ...l, status: newStatus } : l)));
    } catch (err) {
      alert('Failed to update lead status: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
          Studio Control Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time enquiries, dance curriculum, media assets, and boutique inventory.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="admin-stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: '#9c99a6', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Total Leads Captured
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {stats.totalLeads}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '4px' }}>
              {stats.newLeads} Awaiting Response
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: '#9c99a6', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Active Dance Classes
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {stats.classes}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#81c784', marginTop: '4px' }}>
              All Batches Open
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(76, 175, 80, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#81c784' }}>
            <Layers size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: '#9c99a6', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Workshops & Events
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {stats.events}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64b5f6', marginTop: '4px' }}>
              Upcoming Sessions
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(33, 150, 243, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64b5f6' }}>
            <Calendar size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: '#9c99a6', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Products & Couture
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {stats.products}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#ba68c8', marginTop: '4px' }}>
              In Boutique
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(156, 39, 176, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ba68c8' }}>
            <ShoppingBag size={24} />
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff' }}>
              Recent Student Inquiries
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Incoming leads from website CTA buttons
            </span>
          </div>

          <Link to="/admin/leads" className="admin-btn admin-btn-primary">
            <span>View All Leads</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No enquiries received yet. Forms submitted on the website will instantly appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Phone / WhatsApp</th>
                  <th>Dance Style</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <strong style={{ color: '#fff' }}>{lead.name}</strong>
                      {lead.email && <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{lead.email}</div>}
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25d366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td>{lead.interestedIn || 'General'}</td>
                    <td>
                      <span className={`status-badge status-${lead.status || 'NEW'}`}>
                        {lead.status || 'NEW'}
                      </span>
                    </td>
                    <td>
                      <select
                        value={lead.status || 'NEW'}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        style={{
                          background: '#191921',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.82rem'
                        }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="FOLLOW-UP">FOLLOW-UP</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Launch Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Link to="/admin/classes" className="admin-card" style={{ textDecoration: 'none', transition: 'transform 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.75rem' }}>
            <Layers size={22} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Manage Classes</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Update dance styles, schedules, faculty, and batch descriptions.
          </p>
        </Link>

        <Link to="/admin/gallery" className="admin-card" style={{ textDecoration: 'none', transition: 'transform 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.75rem' }}>
            <Image size={22} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Direct Media Upload</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Upload high-resolution dance photographs directly from computer/mobile.
          </p>
        </Link>

        <Link to="/admin/settings" className="admin-card" style={{ textDecoration: 'none', transition: 'transform 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.75rem' }}>
            <Users size={22} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Studio Phone & WhatsApp</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Change studio phone, WhatsApp number, email, address, and counter statistics.
          </p>
        </Link>
      </div>
    </div>
  );
};
