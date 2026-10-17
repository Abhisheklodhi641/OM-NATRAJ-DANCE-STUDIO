import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const { settings, getWhatsAppUrl } = useStudio();
  const heroRef = useRef(null);
  const bgImageRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.3 }
      )
      .fromTo(
        '.hero-line-reveal',
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.2 },
        '-=0.6'
      )
      .fromTo(
        '.hero-subtext',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        '.hero-cta-group',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      );

      // 2. Cinematic Scroll Parallax
      if (bgImageRef.current && heroRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { scale: 1.15, y: 0 },
          {
            scale: 1.0,
            y: 140,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            }
          }
        );
      }

      if (contentRef.current && heroRef.current) {
        gsap.to(contentRef.current, {
          y: -70,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

      if (overlayRef.current && heroRef.current) {
        gsap.to(overlayRef.current, {
          backgroundColor: 'rgba(7, 7, 9, 0.88)',
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#070709',
        paddingTop: 'var(--navbar-height)'
      }}
    >
      {/* Background Cinematic Dance Visual */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <img
          ref={bgImageRef}
          src="/images/hero-dance.jpg"
          alt="Om Natraj Dance Studio Hero Performer"
          style={{
            width: '100%',
            height: '115%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
            transformOrigin: 'center center',
          }}
        />

        {/* Cinematic Gradient Overlays */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7,7,9,0.45) 0%, rgba(7,7,9,0.7) 65%, #070709 100%)',
            transition: 'background-color 0.3s ease',
          }}
        />

        {/* Ambient Warm Spotlight */}
        <div
          className="spotlight-glow spotlight-gold animate-pulse-glow"
          style={{
            width: '650px',
            height: '650px',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="site-container"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '1050px',
          paddingTop: '3rem',
          paddingBottom: '5rem',
        }}
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-gold)',
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} color="var(--accent-gold)" />
            INDORE'S PREMIER DANCE ACADEMY
          </span>
        </div>

        {/* Large Editorial Heading */}
        <h1 className="editorial-hero-title" style={{ marginBottom: '1.25rem' }}>
          <div className="hero-line-reveal">OM NATRAJ</div>
          <div className="hero-line-reveal" style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(2.4rem, 6.2vw, 5.5rem)',
            color: 'var(--accent-gold)',
            marginTop: '-0.1em'
          }}>
            DANCE STUDIO
          </div>
        </h1>

        {/* Tagline */}
        <p className="hero-subtext" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.25rem, 2.8vw, 2.1rem)',
          fontWeight: 300,
          color: 'var(--text-main)',
          lineHeight: 1.35,
          marginBottom: '1rem',
          letterSpacing: '0.02em'
        }}>
          "{settings.tagline || 'Where Movement Becomes Expression.'}"
        </p>

        {/* Secondary Text */}
        <p className="hero-subtext" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.88rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '2.5rem'
        }}>
          {settings.secondaryText || 'Learn. Move. Perform. Create.'}
        </p>

        {/* Buttons CTA */}
        <div className="hero-cta-group" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px'
        }}>
          <Link
            to="/classes"
            className="btn btn-primary"
            data-cursor="CLASSES"
          >
            Explore Classes
            <ArrowUpRight size={18} />
          </Link>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            data-cursor="WHATSAPP"
          >
            <MessageSquare size={18} />
            Enquire On WhatsApp
          </a>

          <Link
            to="/contact"
            className="btn btn-outline"
            data-cursor="JOIN"
          >
            Book Free Trial Batch
          </Link>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <a
        href="#intro-statement"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
        }}
        className="animate-float-slow"
        aria-label="Scroll to intro section"
        data-cursor="SCROLL"
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <ArrowDown size={18} color="var(--accent-gold)" />
      </a>
    </section>
  );
};
