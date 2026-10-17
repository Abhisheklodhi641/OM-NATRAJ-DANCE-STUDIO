import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const DanceStyles = ({ classes = [] }) => {
  // Styles list from classes or editable defaults
  const stylesList = classes.length > 0
    ? classes
    : [
        {
          _id: '1',
          name: 'Bollywood Commercial',
          danceStyle: 'Bollywood',
          description: 'High-energy choreography blending expressive Indian cinematic expressions with sharp modern stage footwork and camera performance technique.',
          image: '/images/bollywood-hiphop.jpg',
          level: 'All Levels'
        },
        {
          _id: '2',
          name: 'Authentic Gujarati Garba',
          danceStyle: 'Garba',
          description: 'Master traditional Gujarati Dodhiya, 2-Taali, 3-Taali, high-velocity spins, and energetic choreography tailored for Navratri and stage events.',
          image: '/images/garba-dance.jpg',
          level: 'Beginner to Pro'
        },
        {
          _id: '3',
          name: 'Contemporary & Lyrical Flow',
          danceStyle: 'Contemporary',
          description: 'Explore the boundaries of physical storytelling through floor work, release technique, spatial awareness, and deeply emotive musicality.',
          image: '/images/hero-dance.jpg',
          level: 'Intermediate+'
        },
        {
          _id: '4',
          name: 'Urban Street & Hip-Hop',
          danceStyle: 'Hip Hop',
          description: 'Grooves, popping, breaking basics, isolation, and fast-paced commercial routines with an emphasis on personal attitude and freestyle confidence.',
          image: '/images/bollywood-hiphop.jpg',
          level: 'All Ages'
        },
        {
          _id: '5',
          name: 'Little Stars - Kids Academy',
          danceStyle: 'Kids Dance',
          description: 'A playful and disciplined curriculum teaching young kids rhythm, motor coordination, flexibility, and stage presence with joyful confidence.',
          image: '/images/kids-dance.jpg',
          level: 'Ages 4-12'
        },
        {
          _id: '6',
          name: 'Bespoke Wedding & Sangeet',
          danceStyle: 'Wedding Choreography',
          description: 'Personalized private couple routines, grand bridal entries, family group flashmobs, and concept performances customized to your love story.',
          image: '/images/wedding-dance.jpg',
          level: 'Couples & Family'
        }
      ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeStyle = stylesList[activeIndex] || stylesList[0];

  return (
    <section className="section-spacer" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', gap: '20px' }}>
          <div>
            <span className="section-eyebrow">Curated Disciplines</span>
            <h2 className="editorial-section-title">
              Dance Styles & <span className="editorial-italic">Art Forms</span>
            </h2>
          </div>
          <Link to="/classes" className="btn btn-outline" data-cursor="ALL">
            View All Programs
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Interactive Split Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          
          {/* Style Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {stylesList.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item._id || idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    padding: '1.5rem 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  data-cursor="PREVIEW"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: isActive ? 'var(--accent-gold)' : 'var(--text-dim)',
                      transition: 'color 0.3s ease'
                    }}>
                      0{idx + 1}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                      color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                      transition: 'color 0.3s ease, transform 0.3s ease',
                      transform: isActive ? 'translateX(10px)' : 'none',
                      fontWeight: isActive ? 600 : 400
                    }}>
                      {item.danceStyle || item.name}
                    </h3>
                  </div>

                  <div style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateX(0)' : 'translateX(-10px)',
                    transition: 'all 0.3s ease',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                      EXPLORE
                    </span>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Image & Details Preview Card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{
              overflow: 'hidden',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
            }}>
              
              {/* Preview Image with Smooth Transition */}
              <div style={{
                position: 'relative',
                height: '380px',
                borderRadius: '4px',
                overflow: 'hidden',
                background: '#121218'
              }}>
                <img
                  key={activeStyle.image}
                  src={activeStyle.image || '/images/hero-dance.jpg'}
                  alt={activeStyle.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'fadeIn 0.5s ease'
                  }}
                />
                
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(7,7,9,0.92) 100%)'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(7, 7, 9, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--accent-gold)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  borderRadius: '20px'
                }}>
                  {activeStyle.level || 'All Batches'}
                </div>
              </div>

              {/* Information below image */}
              <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.65rem',
                  color: 'var(--text-main)',
                  marginBottom: '0.5rem'
                }}>
                  {activeStyle.name}
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}>
                  {activeStyle.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--accent-gold)',
                    letterSpacing: '0.1em'
                  }}>
                    BATCHES AVAILABLE IN INDORE
                  </span>

                  <Link
                    to="/contact"
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.75rem' }}
                  >
                    Join Class
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
