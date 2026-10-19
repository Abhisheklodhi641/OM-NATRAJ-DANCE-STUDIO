import React from 'react';
import { Award, Users, Target, HeartHandshake, Sparkles, Calendar } from 'lucide-react';

export const WhyOmNatraj = () => {
  const pillars = [
    {
      icon: Award,
      title: 'Professional Training',
      desc: 'Structured curricula designed by seasoned choreographers, focusing on technique, posture, musicality, and stage expression.'
    },
    {
      icon: Users,
      title: 'Personal Attention',
      desc: 'Small student-to-teacher batches ensuring every dancer receives personalized feedback and guided progression.'
    },
    {
      icon: Target,
      title: 'Performance Focus',
      desc: 'Regular opportunities to dance on real theater stages, studio video reels, and prestigious cultural festivals.'
    },
    {
      icon: HeartHandshake,
      title: 'Beginner Friendly',
      desc: 'No prior dance background required. We nurture confidence, coordination, and rhythm from the ground up.'
    },
    {
      icon: Sparkles,
      title: 'Kids, Youth & Adults',
      desc: 'Tailored age-appropriate batches ranging from Little Stars (ages 4+) to adult evening hobby and fitness sessions.'
    },
    {
      icon: Calendar,
      title: 'Events & Workshops',
      desc: 'Seasonal masterclasses, Garba bootcamps, and bespoke wedding choreography designed for real-world celebrations.'
    }
  ];

  return (
    <section className="section-spacer" style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decorative Spotlight */}
      <div className="spotlight-glow spotlight-gold" style={{ width: '500px', height: '500px', top: '10%', right: '5%' }} />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4.5rem' }}>
          <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
            The Om Natraj Distinction
          </span>
          <h2 className="editorial-section-title">
            Why Dancers Choose <span className="editorial-italic">Om Natraj</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            marginTop: '1rem',
            lineHeight: 1.6
          }}>
            We combine the discipline of professional dance pedagogy with the celebratory, vibrant spirit of Indian music and world-class stagecraft.
          </p>
        </div>

        {/* 6 Feature Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(1.25rem, 2.5vw, 2rem)'
        }}>
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass-panel"
                style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                data-cursor="WHY"
              >
                <div>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '4px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    marginBottom: '1.5rem'
                  }}>
                    <Icon size={24} />
                  </div>

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--accent-gold)',
                    letterSpacing: '0.15em',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>
                    0{idx + 1} • CORE VALUE
                  </span>

                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.65rem',
                    color: 'var(--text-main)',
                    marginBottom: '0.75rem',
                    fontWeight: 500
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.94rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65
                  }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{
                  height: '2px',
                  width: '32px',
                  background: 'var(--accent-gold)',
                  marginTop: '1.75rem',
                  opacity: 0.5
                }} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
