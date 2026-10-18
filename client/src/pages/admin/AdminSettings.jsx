import React, { useState, useEffect } from 'react';
import { Save, Settings, Phone, MessageSquare, Mail, MapPin, Check, Map } from 'lucide-react';
import { api } from '../../services/api';
import { useStudio } from '../../context/StudioContext';

export const AdminSettings = () => {
  const { refreshSettings } = useStudio();
  const [formData, setFormData] = useState({
    studioName: '',
    tagline: '',
    secondaryText: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    googleMapsUrl: '',
    latitude: '',
    longitude: '',
    youtubeUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    introHeading: '',
    introSubtext: '',
    footerText: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings) {
          setFormData(prev => ({
            ...prev,
            ...res.settings,
            latitude: res.settings.latitude ?? '',
            longitude: res.settings.longitude ?? ''
          }));
        }
      } catch (err) {
        console.warn('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude !== '' ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude !== '' ? parseFloat(formData.longitude) : null,
      };
      await api.updateSettings(payload);
      await refreshSettings();
      setSuccessMsg('Studio settings saved and published to website!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Studio Settings & Branding
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Update contact numbers, WhatsApp redirection target, email, location, Google Maps, and hero statements.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          <Save size={16} />
          <span>{saving ? 'Publishing...' : 'Save Settings'}</span>
        </button>
      </div>

      {successMsg && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.15)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          color: '#81c784',
          padding: '14px 20px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '2rem'
        }}>
          <Check size={18} />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave}>
        
        {/* Contact Information Card */}
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>
            Direct Contact & Messaging
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Studio Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 97137 99075"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <Phone size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Number (Digits only with country code)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="919876543210"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <MessageSquare size={18} color="#25d366" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                e.g. 919876543210 (Controls all WhatsApp enquiry CTA buttons on the site)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Studio Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@studio.com"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <Mail size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Studio Address / Location</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full studio street address"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <MapPin size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="form-input"
              />
            </div>
          </div>

          {/* Dynamic Map Settings */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>
              Google Maps Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Custom Google Maps Embed / Share URL (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="googleMapsUrl"
                    value={formData.googleMapsUrl}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/maps?q=... or embed iframe URL"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                  />
                  <Map size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Leave empty to auto-generate from Address and City
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Latitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 26.354"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 78.118"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>
            Social Channels & Video
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Official YouTube Channel Link</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/@OMNDS"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <div style={{ position: 'absolute', left: '16px', top: '16px', color: '#ff0000', display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/omnatrajdancestudio"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <div style={{ position: 'absolute', left: '16px', top: '16px', color: '#e1306c', display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Page URL (Optional)</label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Hero & Editorial Content */}
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>
            Hero & Homepage Typography
          </h3>

          <div className="form-group">
            <label className="form-label">Studio Name</label>
            <input
              type="text"
              name="studioName"
              value={formData.studioName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Main Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secondary Tagline</label>
            <input
              type="text"
              name="secondaryText"
              value={formData.secondaryText}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Intro Philosophy Statement</label>
            <textarea
              name="introHeading"
              value={formData.introHeading}
              onChange={handleChange}
              className="form-textarea"
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Intro Subtext / Paragraph</label>
            <textarea
              name="introSubtext"
              value={formData.introSubtext}
              onChange={handleChange}
              className="form-textarea"
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Footer Summary Paragraph</label>
            <textarea
              name="footerText"
              value={formData.footerText}
              onChange={handleChange}
              className="form-textarea"
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '16px 36px' }}>
            <Save size={18} />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
