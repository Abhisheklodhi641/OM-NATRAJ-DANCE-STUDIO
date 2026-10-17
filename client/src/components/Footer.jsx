import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight, Lock } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const Footer = () => {
  const { settings, getWhatsAppUrl } = useStudio();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, #040405 100%)',
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '5rem',
      paddingBottom: '2.5rem'
    }}>
      {/* Background Ambient Spotlight */}
      <div className="spotlight-glow spotlight-gold" style={{ width: '500px', height: '500px', bottom: '-200px', right: '10%' }} />

      <div className="site-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3.5rem',
          marginBottom: '4.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Brand Column */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(212, 175, 55, 0.1)'
              }}>
                <svg width="20" height="20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="4"/>
                  <path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill="#d4af37"/>
                  <circle cx="50" cy="50" r="8" fill="#e2632b"/>
                </svg>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--text-main)'
              }}>
                OM NATRAJ
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontStyle: 'italic',
              color: 'var(--accent-gold)',
              lineHeight: 1.4,
              marginBottom: '1rem'
            }}>
              "{settings.tagline || 'Where Movement Becomes Expression.'}"
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '1.75rem'
            }}>
              {settings.footerText || 'A premier dance academy fostering rhythm, confidence, and artistic performance in Indore, Madhya Pradesh.'}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={settings.youtubeUrl || 'https://www.youtube.com/@OMNDS'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  transition: 'all 0.3s ease'
                }}
                aria-label="YouTube Channel"
                data-cursor="WATCH"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href={settings.instagramUrl || 'https://instagram.com/omnatrajdancestudio'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  transition: 'all 0.3s ease'
                }}
                aria-label="Instagram"
                data-cursor="FOLLOW"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0 16px',
                  height: '42px',
                  borderRadius: '4px',
                  background: 'rgba(37, 211, 102, 0.12)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#25d366',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
                data-cursor="CHAT"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '1.5rem'
            }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Home', 'About Studio', 'Dance Classes', 'Events & Workshops', 'Photo Gallery', 'Dance Videos', 'Dance Products', 'Contact'].map((name, i) => {
                const paths = ['/', '/about', '/classes', '/events', '/gallery', '/videos', '/products', '/contact'];
                return (
                  <li key={name}>
                    <Link
                      to={paths[i]}
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.92rem',
                        transition: 'color 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Dance Styles */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '1.5rem'
            }}>
              Dance Styles
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Bollywood Stage Dance', 'Authentic Gujarati Garba', 'Contemporary & Lyrical', 'Urban Hip-Hop Grooves', 'Kids Dance Foundation', 'Wedding & Couple Sangeet'].map((style) => (
                <li key={style}>
                  <Link
                    to="/classes"
                    style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    {style}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '1.5rem'
            }}>
              Studio Headquarters
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {settings.address || 'Indore, Madhya Pradesh, India'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <a
                  href={`tel:${settings.phone || '+919713799075'}`}
                  style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 500 }}
                >
                  {settings.phone || '+91 9713799075'}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <a
                  href={`mailto:${settings.email || 'kushanikt667@gmail.com'}`}
                  style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}
                >
                  {settings.email || 'kushanikt667@gmail.com'}
                </a>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <Link
                to="/contact"
                className="btn btn-outline"
                style={{ padding: '10px 18px', fontSize: '0.78rem', width: '100%' }}
                data-cursor="MAP"
              >
                Visit Studio In Indore
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            color: 'var(--text-dim)'
          }}>
            © {new Date().getFullYear()} OM NATRAJ DANCE STUDIO • INDORE. ALL RIGHTS RESERVED.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)'
            }}>
              Indore, Madhya Pradesh
            </span>

            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                textDecoration: 'none',
                opacity: 0.6,
                transition: 'opacity 0.2s ease, color 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = 'var(--text-dim)'; }}
              title="Admin Portal Login"
            >
              <Lock size={12} />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
