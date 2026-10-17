import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalGallery = ({ onImageClick }) => {
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);

  const galleryItems = [
    {
      id: 1,
      title: 'MOVE.',
      subtitle: 'The Velocity of Kathak & Fusion',
      image: '/images/hero-dance.jpg',
      category: 'Contemporary'
    },
    {
      id: 2,
      title: 'FEEL.',
      subtitle: 'The Soul of Traditional Garba',
      image: '/images/garba-dance.jpg',
      category: 'Garba'
    },
    {
      id: 3,
      title: 'EXPRESS.',
      subtitle: 'Urban Stage Presence & Power',
      image: '/images/bollywood-hiphop.jpg',
      category: 'Hip-Hop'
    },
    {
      id: 4,
      title: 'CONNECT.',
      subtitle: 'Romantic Wedding Sangeet Glow',
      image: '/images/wedding-dance.jpg',
      category: 'Wedding Dance'
    },
    {
      id: 5,
      title: 'INSPIRE.',
      subtitle: 'Joyful Little Steps in Motion',
      image: '/images/kids-dance.jpg',
      category: 'Kids Batch'
    },
    {
      id: 6,
      title: 'DISCOVER.',
      subtitle: 'Sprung Wooden Dance Floor',
      image: '/images/studio-interior.jpg',
      category: 'Studio Space'
    }
  ];

  const scrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="section-spacer" style={{ background: 'var(--bg-secondary)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Editorial Header */}
      <div className="site-container" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
          <div>
            <span className="section-eyebrow">Visual Poetry</span>
            <h2 className="editorial-section-title">
              Move. Feel. <span className="editorial-italic">Express.</span>
            </h2>
          </div>

          {/* Navigation Arrows for Smooth Horizontal Panning */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={scrollLeft}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-gold)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              aria-label="Previous gallery cards"
              data-cursor="PREV"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={scrollRight}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                border: 'none',
                color: '#070709',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              aria-label="Next gallery cards"
              data-cursor="NEXT"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Touch-Friendly Horizontal Track (Desktop & Mobile optimized) */}
      <div
        ref={scrollTrackRef}
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          paddingLeft: 'max(1.5rem, calc((100vw - 1400px) / 2 + 1.5rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1400px) / 2 + 1.5rem))',
          paddingBottom: '2rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
          cursor: 'grab'
        }}
        className="horizontal-gallery-track"
      >
        {galleryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onImageClick && onImageClick(item.image, item.title)}
            style={{
              flex: '0 0 clamp(290px, 28vw, 420px)',
              height: '480px',
              position: 'relative',
              borderRadius: '4px',
              overflow: 'hidden',
              scrollSnapAlign: 'start',
              cursor: 'pointer'
            }}
            className="cinematic-card"
            data-cursor="EXPAND"
          >
            <img
              src={item.image}
              alt={item.title}
              className="cinematic-reveal-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Gradient Mask */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(7,7,9,0.1) 30%, rgba(7,7,9,0.88) 100%)',
              transition: 'background 0.3s ease'
            }} />

            {/* Content Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              zIndex: 2
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px'
              }}>
                {item.category}
              </span>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                marginBottom: '6px'
              }}>
                {item.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                color: 'var(--text-main)',
                fontStyle: 'italic',
                lineHeight: 1.3
              }}>
                {item.subtitle}
              </p>
            </div>

            {/* Hover Icon */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(7,7,9,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}>
              <Eye size={16} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .horizontal-gallery-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
