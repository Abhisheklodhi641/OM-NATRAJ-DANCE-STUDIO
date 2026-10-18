import React, { useState } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';

export const Testimonials = ({ testimonials = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = testimonials.length > 0
    ? testimonials
    : [
        {
          _id: '1',
          name: 'Pooja Verma',
          role: 'Garba Workshop Participant',
          testimonial: 'Om Natraj Dance Studio transformed my confidence completely. The instructors teach with so much patience and passion. Their Garba workshop prepared me to dance non-stop with real style!',
          rating: 5
        },
        {
          _id: '2',
          name: 'Rohit & Shreya Sharma',
          role: 'Wedding Sangeet Clients',
          testimonial: 'Neither my husband nor I had ever danced on stage before. The team choreographed a magical, graceful routine for our sangeet that had everyone on their feet cheering.',
          rating: 5
        },
        {
          _id: '3',
          name: 'Ananya Mehta',
          role: 'Contemporary Student (2 Years)',
          testimonial: 'The studio vibe is unlike anywhere else. High energy, artistic integrity, and true technique. It has become my second home.',
          rating: 5
        }
      ];

  const current = items[activeIndex] || items[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="section-spacer" style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Soft Spotlight */}
      <div className="spotlight-glow spotlight-gold" style={{ width: '500px', height: '500px', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />

      <div className="site-container" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', textAlign: 'center' }}>
        
        <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
          Real Student Journeys
        </span>
        <h2 className="editorial-section-title" style={{ marginBottom: '3.5rem' }}>
          Words From Our <span className="editorial-italic">Performers</span>
        </h2>

        {/* Featured Testimonial Card */}
        <div className="glass-panel" style={{
          padding: 'clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 4rem)',
          border: '1px solid var(--border-gold)',
          borderRadius: '8px',
          position: 'relative'
        }}>
          
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            color: 'var(--accent-gold)'
          }}>
            <Quote size={28} />
          </div>

          {/* Star Rating */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '1.75rem' }}>
            {[...Array(current.rating || 5)].map((_, i) => (
              <Star key={i} size={18} fill="var(--accent-gold)" color="var(--accent-gold)" />
            ))}
          </div>

          <blockquote style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.35rem, 3vw, 2.1rem)',
            lineHeight: 1.5,
            color: 'var(--text-main)',
            fontStyle: 'italic',
            fontWeight: 300,
            marginBottom: '2.5rem'
          }}>
            "{current.testimonial}"
          </blockquote>

          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--accent-gold)',
              marginBottom: '4px'
            }}>
              {current.name}
            </h4>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}>
              {current.role}
            </p>
          </div>

          {/* Slider Arrows */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '2.5rem'
          }}>
            <button
              onClick={handlePrev}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-gold)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Previous Testimonial"
              data-cursor="PREV"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                border: 'none',
                color: '#070709',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Next Testimonial"
              data-cursor="NEXT"
            >
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
