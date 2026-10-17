import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useStudio } from '../context/StudioContext';

export const LeadEnquiryForm = ({ defaultStyle = 'General Dance Training' }) => {
  const { getWhatsAppUrl } = useStudio();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interestedIn: defaultStyle,
    preferredClass: 'Evening Batch',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitLead(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Unable to submit enquiry. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappFollowUpText = `Hi Om Natraj Dance Studio! I just submitted an enquiry on your website.\n\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Interested In: ${formData.interestedIn}\n• Preferred Batch: ${formData.preferredClass}\n\nLooking forward to speaking with you!`;

  return (
    <div className="glass-panel" style={{
      padding: 'clamp(2rem, 5vw, 3.5rem)',
      border: '1px solid var(--border-gold)',
      borderRadius: '8px',
      position: 'relative'
    }}>
      
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.4)',
            color: '#81c784',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            Enquiry Received!
          </h3>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '460px',
            margin: '0 auto 2.5rem'
          }}>
            Thank you, <strong style={{ color: 'var(--accent-gold)' }}>{formData.name}</strong>. Our choreographers will review your request and contact you at <strong style={{ color: '#fff' }}>{formData.phone}</strong> shortly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '380px', margin: '0 auto' }}>
            <a
              href={getWhatsAppUrl(whatsappFollowUpText)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%' }}
            >
              <MessageSquare size={18} />
              Instant Reply on WhatsApp
            </a>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  interestedIn: defaultStyle,
                  preferredClass: 'Evening Batch',
                  message: ''
                });
              }}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '2rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '6px'
            }}>
              Quick Booking & Inquiries
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              color: '#fff',
              lineHeight: 1.2
            }}>
              Reserve Your <span className="editorial-italic">Trial Batch</span>
            </h3>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 67, 54, 0.12)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: '#ef5350',
              padding: '12px 16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            <div className="form-group">
              <label className="form-label" htmlFor="lead-name">Your Full Name *</label>
              <input
                id="lead-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarti Sharma"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lead-phone">Phone / WhatsApp Number *</label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 97137 99075"
                className="form-input"
              />
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            <div className="form-group">
              <label className="form-label" htmlFor="lead-email">Email Address</label>
              <input
                id="lead-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. dancer@gmail.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lead-style">Interested Dance Style *</label>
              <select
                id="lead-style"
                name="interestedIn"
                value={formData.interestedIn}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Bollywood Commercial">Bollywood Commercial</option>
                <option value="Authentic Garba Workshop">Authentic Garba Workshop</option>
                <option value="Contemporary & Lyrical">Contemporary & Lyrical</option>
                <option value="Urban Street Hip-Hop">Urban Street Hip-Hop</option>
                <option value="Kids Dance Foundation">Kids Dance Foundation</option>
                <option value="Wedding / Sangeet Couple Choreography">Wedding / Sangeet Couple Choreography</option>
                <option value="Dance Fitness / Conditioning">Dance Fitness / Conditioning</option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lead-batch">Preferred Batch Timing</label>
            <select
              id="lead-batch"
              name="preferredClass"
              value={formData.preferredClass}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Morning Batch (8:00 AM - 10:00 AM)">Morning Batch (8:00 AM - 10:00 AM)</option>
              <option value="Evening Regular (5:30 PM - 7:30 PM)">Evening Regular (5:30 PM - 7:30 PM)</option>
              <option value="Late Evening Batch (7:30 PM - 9:00 PM)">Late Evening Batch (7:30 PM - 9:00 PM)</option>
              <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat & Sun)</option>
              <option value="Private 1-on-1 Session">Private 1-on-1 Session</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lead-message">Your Message or Dance Goals (Optional)</label>
            <textarea
              id="lead-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your prior dance experience or goals..."
              className="form-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', opacity: loading ? 0.7 : 1 }}
            data-cursor="SUBMIT"
          >
            {loading ? (
              <span>Submitting Details...</span>
            ) : (
              <>
                <span>Confirm Enquiry & Request Callback</span>
                <Send size={18} />
              </>
            )}
          </button>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
            marginTop: '1.25rem',
            letterSpacing: '0.05em'
          }}>
            🔒 No spam. Your phone number is only used to connect regarding studio batches in Indore.
          </p>

        </form>
      )}

    </div>
  );
};
