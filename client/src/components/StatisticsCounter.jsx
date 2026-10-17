import React, { useEffect, useState, useRef } from 'react';
import { useStudio } from '../context/StudioContext';

const AnimatedNumber = ({ targetValue, duration = 1800, prefix = '', suffix = '' }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuad
            const eased = 1 - (1 - progress) * (1 - progress);
            setCurrentValue(Math.floor(eased * targetValue));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCurrentValue(targetValue);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [targetValue, duration, hasAnimated]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  );
};

export const StatisticsCounter = () => {
  const { settings } = useStudio();

  const stats = settings.statistics || [
    { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+' },
    { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+' },
    { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+' },
    { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+' }
  ];

  return (
    <section className="section-spacer" style={{ background: '#050507', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="site-container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          textAlign: 'center'
        }}>
          {stats.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                padding: '2rem 1.5rem',
                borderRight: idx < stats.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                position: 'relative'
              }}
              data-cursor="STATS"
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 5vw, 4.4rem)',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                lineHeight: 1,
                marginBottom: '0.75rem'
              }}>
                <AnimatedNumber
                  targetValue={Number(item.value) || 0}
                  prefix={item.prefix || ''}
                  suffix={item.suffix || '+'}
                />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
                marginBottom: '0.5rem'
              }}>
                {item.label}
              </h3>

              {item.description && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)'
                }}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
