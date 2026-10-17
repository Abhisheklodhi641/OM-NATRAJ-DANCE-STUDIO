import React, { useEffect, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const IntroStatement = () => {
  const { settings } = useStudio();
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.intro-reveal-line',
        {
          opacity: 0.15,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.25,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center 45%',
            scrub: 0.8,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro-statement"
      ref={sectionRef}
      className="section-spacer"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Soft Glow */}
      <div className="spotlight-glow spotlight-ember" style={{ width: '450px', height: '450px', top: '-10%', left: '10%' }} />

      <div className="site-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '960px' }}>
        <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
          Philosophy & Soul
        </span>

        <blockquote
          ref={textRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.1rem, 4.8vw, 3.8rem)',
            fontWeight: 400,
            lineHeight: 1.25,
            color: 'var(--text-main)',
            marginBottom: '2rem'
          }}
        >
          <div className="intro-reveal-line">
            "Dance is not just about learning steps.
          </div>
          <div className="intro-reveal-line editorial-italic">
            It's about finding your own rhythm."
          </div>
        </blockquote>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
          {settings.introSubtext || 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers right here in Indore.'}
        </p>

        {/* Decorative Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '3.5rem'
        }}>
          <span style={{ width: '60px', height: '1px', background: 'var(--border-gold)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
          <span style={{ width: '60px', height: '1px', background: 'var(--border-gold)' }} />
        </div>
      </div>
    </section>
  );
};
