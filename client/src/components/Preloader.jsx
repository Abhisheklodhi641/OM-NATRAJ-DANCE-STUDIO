import React, { useEffect, useState } from 'react';

export const Preloader = () => {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setRemoved(true), 700);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (removed) return null;

  return (
    <div className={`preloader-screen ${fading ? 'fade-out' : ''}`}>
      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          marginBottom: '24px',
          background: 'rgba(212, 175, 55, 0.05)',
          boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)'
        }}>
          <svg width="32" height="32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="3" opacity="0.6"/>
            <path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill="#d4af37"/>
            <circle cx="50" cy="50" r="8" fill="#e2632b"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#f7f4ee',
          marginBottom: '6px'
        }}>
          OM NATRAJ
        </h1>
        
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--accent-gold)',
          marginBottom: '28px'
        }}>
          DANCE STUDIO • INDORE
        </p>

        {/* Minimal Animated Line / Movement Indicator */}
        <div style={{
          width: '180px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            background: 'linear-gradient(90deg, transparent, #d4af37, #e2632b)',
            animation: 'loaderSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes loaderSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};
