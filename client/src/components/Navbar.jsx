import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { settings, getWhatsAppUrl } = useStudio();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & unlock scroll
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Classes', path: '/classes' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Videos', path: '/videos' },
    { label: 'Products', path: '/products' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className={`navbar-glass ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="site-container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }} data-cursor="HOME">
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: '1px solid var(--border-gold)',
              background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 80%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
            }}>
              <svg width="22" height="22" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="4"/>
                <path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill="#d4af37"/>
                <circle cx="50" cy="50" r="8" fill="#e2632b"/>
              </svg>
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--text-main)',
                display: 'block',
                lineHeight: 1.1
              }}>
                OM NATRAJ
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                display: 'block'
              }}>
                DANCE STUDIO • {(settings.city || 'ACADEMY').toUpperCase()}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                data-cursor="GO"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-cta">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ padding: '10px 20px', fontSize: '0.8rem' }}
              data-cursor="CHAT"
            >
              <MessageSquare size={16} />
              WhatsApp
            </a>

            <Link
              to="/contact"
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.8rem' }}
              data-cursor="JOIN"
            >
              Enquire Now
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              minWidth: '44px',
              minHeight: '44px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            className="mobile-toggle"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={28} color="var(--accent-gold)" /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'is-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {settings.studioName || 'OM NATRAJ'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent-gold)' }}>
              {(settings.city || 'BANMORE').toUpperCase()} ACADEMY
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px'
            }}
            aria-label="Close navigation menu"
          >
            <X size={28} color="var(--accent-gold)" />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((item, idx) => (
            <Link
              key={item.path}
              to={item.path}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-gold)', opacity: 0.7 }}>
                0{idx + 1}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ width: '100%' }}
          >
            <MessageSquare size={18} />
            Chat on WhatsApp
          </a>
          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              <Phone size={18} />
              Call: {settings.phone}
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 1025px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
