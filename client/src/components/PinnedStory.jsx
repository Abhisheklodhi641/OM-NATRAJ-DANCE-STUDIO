import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useStudio } from '../context/StudioContext';

gsap.registerPlugin(ScrollTrigger);

export const PinnedStory = () => {
  const { settings } = useStudio();
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  const steps = [
    {
      num: '01',
      title: 'FIND YOUR RHYTHM',
      subtitle: 'The Awakening of Movement',
      desc: 'Step into an inspiring environment where rhythm becomes second nature. Whether starting with basic counts or Kathak tatkar, you unlock your body’s natural instinct for tempo and musicality.',
      image: settings?.heroMedia || '/images/hero-dance.jpg',
      quote: 'Every dancer starts with a single beat.'
    },
    {
      num: '02',
      title: 'BUILD YOUR CONFIDENCE',
      subtitle: 'Technique Meets Emotion',
      desc: 'Move past self-doubt. Under the guidance of master choreographers, you develop sharp isolations, graceful arm extensions, posture, and facial expressions that speak louder than words.',
      image: settings?.ctaImage || '/images/garba-dance.jpg',
      quote: 'Confidence is born when technique turns into feeling.'
    },
    {
      num: '03',
      title: 'OWN THE STAGE',
      subtitle: 'The Electric Spotlight',
      desc: 'From intimate studio reels to grand Navratri arenas and annual concerts in front of 1,000+ viewers, you experience the unforgettable rush of live applause and artistic fulfillment.',
      image: settings?.aboutImage || '/images/wedding-dance.jpg',
      quote: 'When the spotlight hits, you don’t just perform — you inspire.'
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Step trigger observer
      const stepElements = document.querySelectorAll('.story-scroll-trigger');
      stepElements.forEach((el, index) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index)
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="section-spacer" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="site-container">
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
            The Dancer's Transformation
          </span>
          <h2 className="editorial-section-title">
            The Journey <span className="editorial-italic">At Om Natraj</span>
          </h2>
        </div>

        {/* 2-Column Split: Left Sticky Visual, Right Scrolling Story Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(2rem, 4vw, 4rem)',
          position: 'relative'
        }}>
          
          {/* Sticky Visual Preview (Left) */}
          <div style={{ position: 'relative' }}>
            <div className="pinned-visual-container">
              {steps.map((s, idx) => (
                <div
                  key={s.num}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: activeStep === idx ? 1 : 0,
                    transition: 'opacity 0.65s var(--ease-cinematic), transform 0.65s var(--ease-cinematic)',
                    transform: activeStep === idx ? 'scale(1)' : 'scale(1.05)',
                  }}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Subtle Gradient & Badge */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(7,7,9,0.2) 0%, rgba(7,7,9,0.85) 100%)'
                  }} />

                  <div style={{
                    position: 'absolute',
                    bottom: '28px',
                    left: '28px',
                    right: '28px',
                    zIndex: 2
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.15em',
                      color: 'var(--accent-gold)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '6px'
                    }}>
                      Phase {s.num} • {s.subtitle}
                    </span>
                    <p style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      fontStyle: 'italic',
                      color: '#fff',
                      lineHeight: 1.4
                    }}>
                      "{s.quote}"
                    </p>
                  </div>
                </div>
              ))}

              {/* Progress Indicator Dots */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 3,
                display: 'flex',
                gap: '8px',
                background: 'rgba(7,7,9,0.7)',
                backdropFilter: 'blur(8px)',
                padding: '8px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-gold)'
              }}>
                {steps.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      width: activeStep === i ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeStep === i ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scrolling Steps (Right) */}
          <div>
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="pinned-step-item story-scroll-trigger"
                style={{
                  opacity: activeStep === idx ? 1 : 0.45,
                  transition: 'opacity 0.4s ease'
                }}
              >
                <span className="step-num">{step.num} — STAGE EVOLUTION</span>
                
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                  color: activeStep === idx ? 'var(--accent-gold)' : 'var(--text-main)',
                  lineHeight: 1.15,
                  marginBottom: '1rem',
                  fontWeight: 600,
                  transition: 'color 0.3s ease'
                }}>
                  {step.title}
                </h3>

                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem'
                }}>
                  {step.subtitle}
                </h4>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '2rem'
                }}>
                  {step.desc}
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  <span>EXPERIENCE AT OM NATRAJ</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
