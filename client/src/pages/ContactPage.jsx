import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { LeadEnquiryForm } from '../components/LeadEnquiryForm';

export const ContactPage = () => {
  const { settings, getWhatsAppUrl, getMapEmbedUrl } = useStudio();

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      
      {/* Header */}
      <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="site-container">
          <span className="section-eyebrow">Connect & Visit</span>
          <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Get In Touch <br />
            <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
              With {settings.studioName || 'Om Natraj'}
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--text-main)',
            maxWidth: '820px',
            lineHeight: 1.5,
            fontWeight: 300
          }}>
            Ready to find your rhythm? Visit our dance studio{settings.city ? ` in ${settings.city}` : ''}, message us on WhatsApp, or book your trial batch below.
          </p>
        </div>
      </section>

      {/* Main Split Grid */}
      <section className="section-spacer" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
        <div className="site-container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'flex-start'
          }}>
            
            {/* Left Contact Information */}
            <div>
              <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <span className="section-eyebrow">Direct Contact</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>
                  {settings.studioName || 'OM NATRAJ DANCE STUDIO'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Phone */}
                  {settings.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '4px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)'
                      }}>
                        <Phone size={22} />
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Studio Phone
                        </span>
                        <a
                          href={`tel:${settings.phone}`}
                          style={{ display: 'block', fontSize: '1.15rem', color: '#fff', fontWeight: 600 }}
                        >
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {settings.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '4px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)'
                      }}>
                        <Mail size={22} />
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Email Address
                        </span>
                        <a
                          href={`mailto:${settings.email}`}
                          style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)' }}
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)',
                      marginTop: '4px'
                    }}>
                      <MapPin size={22} />
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Studio Location
                      </span>
                      <p style={{ fontSize: '1.05rem', color: '#fff', lineHeight: 1.5, margin: 0 }}>
                        {settings.address || 'Studio Address'}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)'
                    }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Studio Operational Hours
                      </span>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                        Monday – Saturday: 7:00 AM – 9:30 PM <br />
                        Sunday: Special Masterclasses & Rehearsals
                      </p>
                    </div>
                  </div>

                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ flex: 1, padding: '14px' }}
                  >
                    <MessageSquare size={18} />
                    WhatsApp
                  </a>
                  {settings.phone && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '14px' }}
                    >
                      <Phone size={18} />
                      Direct Call
                    </a>
                  )}
                </div>
              </div>

              {/* Dynamic Google Maps Box */}
              <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '6px', height: '240px', position: 'relative' }}>
                <iframe
                  title="Studio Location Map"
                  src={getMapEmbedUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Booking Form */}
            <div>
              <LeadEnquiryForm />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
