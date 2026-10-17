import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, Heart, Users, Sparkles, ArrowUpRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AboutPage = () => {
  const { settings, getWhatsAppUrl } = useStudio();

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      
      {/* Editorial Header */}
      <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="site-container">
          <span className="section-eyebrow">Our Story & Heritage</span>
          <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Rooted in Tradition. <br />
            <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
              Driven by Innovation.
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.85rem)',
            color: 'var(--text-main)',
            maxWidth: '880px',
            lineHeight: 1.5,
            fontWeight: 300
          }}>
            OM NATRAJ DANCE STUDIO was founded in Indore with a singular vision: to create a home where Indian rhythmic roots meet modern contemporary choreography.
          </p>
        </div>
      </section>

      {/* Studio Image & Vision Story */}
      <section className="section-spacer" style={{ background: 'var(--bg-secondary)' }}>
        <div className="site-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Visual Box */}
            <div style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}>
              <img
                src="/images/studio-interior.jpg"
                alt="Om Natraj Dance Studio Space"
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                background: 'rgba(7,7,9,0.85)',
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  THE STUDIO FACILITY • INDORE
                </span>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fff', fontStyle: 'italic', marginTop: '4px' }}>
                  Acoustically treated studio, sprung wooden dance flooring & cinematic ambient stage lighting.
                </p>
              </div>
            </div>

            {/* Narrative Copy */}
            <div>
              <span className="section-eyebrow">Artistic Vision</span>
              <h2 className="editorial-section-title" style={{ fontSize: '2.6rem', marginBottom: '1.5rem' }}>
                Where Every Step Tells <span className="editorial-italic">A Story</span>
              </h2>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                At Om Natraj Dance Studio, dance is not treated as mere physical exercise or memorizing rigid steps. It is a language of emotion, culture, and individual empowerment.
              </p>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                From authentic Gujarat and Malwa folk Garba traditions to high-velocity commercial Bollywood and expressive lyrical Contemporary, our faculty ensures students master musicality, stamina, stage presence, and confidence.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '14px' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    100%
                  </h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Passionate Faculty
                  </span>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '14px' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    Indore
                  </h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Heart of Madhya Pradesh
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Link to="/classes" className="btn btn-primary">
                  Explore Classes
                  <ArrowUpRight size={16} />
                </Link>
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  Contact Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Studio Space & Facilities */}
      <section className="section-spacer">
        <div className="site-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
            <span className="section-eyebrow" style={{ justifyContent: 'center' }}>World Class Infrastructure</span>
            <h2 className="editorial-section-title">Designed for <span className="editorial-italic">High Performance</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem' }}>
                <Compass size={32} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem' }}>
                Sprung Wooden Floor
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.94rem' }}>
                Professional impact-absorbing wooden flooring designed to protect joints, knees, and ankles during high-intensity leaps and turns.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem' }}>
                <Sparkles size={32} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem' }}>
                Floor-to-Ceiling Mirrors
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.94rem' }}>
                Full-length studio mirrors with warm perimeter ambient LED backlighting to help dancers refine posture, alignment, and group synchronization.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem' }}>
                <Users size={32} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem' }}>
                Pro Sound & Lighting
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.94rem' }}>
                High-fidelity sound system and dynamic stage spotlights simulating live theater performance conditions right in our rehearsal rooms.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
