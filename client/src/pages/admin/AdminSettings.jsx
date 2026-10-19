import React, { useState, useEffect } from 'react';
import {
  Save,
  Settings,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Check,
  Map,
  Upload,
  Trash2,
  Image as ImageIcon,
  User,
  Info,
  Building2,
  FileText
} from 'lucide-react';
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
    pincode: '',
    googleMapsUrl: '',
    latitude: '',
    longitude: '',
    youtubeUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    logoUrl: '',
    founderName: '',
    founderDesignation: '',
    founderImage: '',
    shortIntroduction: '',
    biography: '',
    experience: '',
    specializations: '',
    achievements: '',
    founderQuote: '',
    introHeading: '',
    introSubtext: '',
    footerText: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [founderUploading, setFounderUploading] = useState(false);
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
            longitude: res.settings.longitude ?? '',
            pincode: res.settings.pincode ?? '',
            logoUrl: res.settings.logoUrl ?? '',
            founderName: res.settings.founderName ?? '',
            founderDesignation: res.settings.founderDesignation ?? '',
            founderImage: res.settings.founderImage ?? '',
            shortIntroduction: res.settings.shortIntroduction ?? '',
            biography: res.settings.biography ?? '',
            experience: res.settings.experience ?? '',
            specializations: res.settings.specializations ?? '',
            achievements: res.settings.achievements ?? '',
            founderQuote: res.settings.founderQuote ?? ''
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, WebP, JPG).');
      return;
    }

    setLogoUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setFormData(prev => ({
          ...prev,
          logoUrl: res.file.url
        }));
      }
    } catch (err) {
      alert('Logo upload failed: ' + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
  };

  const handleFounderImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, WebP, JPG).');
      return;
    }

    setFounderUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setFormData(prev => ({
          ...prev,
          founderImage: res.file.url
        }));
      }
    } catch (err) {
      alert('Founder image upload failed: ' + err.message);
    } finally {
      setFounderUploading(false);
    }
  };

  const handleRemoveFounderImage = () => {
    setFormData(prev => ({ ...prev, founderImage: '' }));
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
            Manage dynamic logo, studio contact info, founder profile, Google Maps, and editorial statements.
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

        {/* 1. BRANDING */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <ImageIcon size={22} color="var(--accent-gold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: 0 }}>
              Branding & Studio Logo
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Logo Preview */}
            <div>
              <label className="form-label">Studio Logo</label>
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '6px',
                border: '1px dashed var(--border-gold)',
                background: 'rgba(212, 175, 55, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={formData.logoUrl || '/images/logo.jpeg'}
                  alt="Studio Logo Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '120px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.jpeg';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  color: formData.logoUrl ? 'var(--accent-gold)' : 'var(--text-dim)',
                  textTransform: 'uppercase'
                }}>
                  {formData.logoUrl ? 'Custom Cloudinary Logo Active' : 'Default Local Logo Active (/images/logo.jpeg)'}
                </span>
              </div>

              {/* Upload & Action Controls */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
                <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', margin: 0 }}>
                  <Upload size={16} />
                  <span>{logoUploading ? 'Uploading to Cloudinary...' : (formData.logoUrl ? 'Replace Logo' : 'Upload Studio Logo')}</span>
                  <input
                    type="file"
                    accept="image/png, image/webp, image/jpeg"
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                    style={{ display: 'none' }}
                  />
                </label>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="admin-btn admin-btn-danger"
                    title="Reset to default local logo asset"
                  >
                    <Trash2 size={16} />
                    <span>Reset / Use Default Logo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Helper Instructions Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                <Info size={18} />
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                  Recommended Logo Requirements
                </h4>
              </div>

              <ul style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                paddingLeft: '1.2rem',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <li><strong>Preferred format:</strong> PNG or WebP</li>
                <li><strong>Background:</strong> Transparent background preferred</li>
                <li><strong>Recommended aspect ratio:</strong> Approximately 3:1 (wide horizontal logo)</li>
                <li><strong>Recommended resolution:</strong> Approximately 1200 × 400 px or equivalent high-resolution</li>
                <li><strong>Safe margins:</strong> Keep important logo text and emblems inside safe margins</li>
                <li><strong>File size:</strong> Avoid unnecessarily huge files (max 10MB)</li>
                <li><strong>Aspect ratio preservation:</strong> Original logo aspect ratio is preserved without forced cropping</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. STUDIO INFORMATION */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <Building2 size={22} color="var(--accent-gold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: 0 }}>
              Studio Information & Location
            </h3>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Studio Business Name</label>
            <input
              type="text"
              name="studioName"
              value={formData.studioName}
              onChange={handleChange}
              placeholder="OM NATRAJ DANCE STUDIO"
              className="form-input"
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Standard business branding: OM NATRAJ DANCE STUDIO (Location is stored separately below)
            </span>
          </div>

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
                e.g. 919713799075 (Controls all WhatsApp enquiry CTA buttons on the site)
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
                  placeholder="Banmore, Morena, Madhya Pradesh, India"
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
                placeholder="Banmore, Morena"
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
                placeholder="Madhya Pradesh"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="476444"
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
                  placeholder="e.g. 26.3533"
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
                  placeholder="e.g. 78.1182"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOUNDER / ABOUT */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <User size={22} color="var(--accent-gold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: 0 }}>
              Founder & About Section
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Founder / Owner Name</label>
              <input
                type="text"
                name="founderName"
                value={formData.founderName}
                onChange={handleChange}
                placeholder="e.g. Om Natraj"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Title</label>
              <input
                type="text"
                name="founderDesignation"
                value={formData.founderDesignation}
                onChange={handleChange}
                placeholder="e.g. Founder & Artistic Director"
                className="form-input"
              />
            </div>
          </div>

          {/* Profile Image with Cloudinary Upload */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <label className="form-label">Founder Profile Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                border: '1px solid var(--border-gold)',
                background: 'rgba(212, 175, 55, 0.05)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={formData.founderImage || formData.aboutImage || '/images/studio-interior.jpg'}
                  alt="Founder Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/images/studio-interior.jpg'; }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', margin: 0 }}>
                    <Upload size={16} />
                    <span>{founderUploading ? 'Uploading to Cloudinary...' : (formData.founderImage ? 'Change Image' : 'Upload Profile Image')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFounderImageUpload}
                      disabled={founderUploading}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {formData.founderImage && (
                    <button
                      type="button"
                      onClick={handleRemoveFounderImage}
                      className="admin-btn admin-btn-danger"
                    >
                      <Trash2 size={16} />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Cloudinary secure upload • Aspect ratio ~ 3:4 portrait or square recommended
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Short Introduction</label>
              <textarea
                name="shortIntroduction"
                value={formData.shortIntroduction}
                onChange={handleChange}
                placeholder="A compelling 1-2 sentence introduction about the founder and studio vision..."
                className="form-textarea"
                style={{ minHeight: '90px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Biography</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                placeholder="Detailed artistic background, training, pedagogy, and stage philosophy..."
                className="form-textarea"
                style={{ minHeight: '90px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Dance Experience / Years</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 12+ Years"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dance Specializations / Styles</label>
              <input
                type="text"
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                placeholder="e.g. Bollywood, Garba, Contemporary & Hip-Hop"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Achievements / Certifications</label>
              <input
                type="text"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="e.g. Trained 2,500+ Dancers • 150+ Stage Productions"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Personal Quote / Tagline (Optional)</label>
            <input
              type="text"
              name="founderQuote"
              value={formData.founderQuote}
              onChange={handleChange}
              placeholder='e.g. "Dance is not just about learning steps. It is about finding your own rhythm."'
              className="form-input"
            />
          </div>
        </div>

        {/* 4. SOCIAL CHANNELS & VIDEO */}
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

        {/* 5. HERO & HOMEPAGE TYPOGRAPHY */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <FileText size={22} color="var(--accent-gold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: 0 }}>
              Hero & Homepage Editorial Statements
            </h3>
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
