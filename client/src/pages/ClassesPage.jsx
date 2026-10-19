import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowUpRight, MessageSquare, Filter } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import { LeadEnquiryForm } from '../components/LeadEnquiryForm';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const ClassesPage = () => {
  const { settings = {}, getWhatsAppUrl } = useStudio();
  const [classes, setClasses] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getClasses('active');
      if (res && res.success && Array.isArray(res.classes)) {
        setClasses(res.classes);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.warn('Failed to load classes from API:', err);
      setError('Unable to load classes from server. Please retry or contact us.');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const styles = ['All', ...new Set(classes.map(c => c?.danceStyle).filter(Boolean))];
  const filtered = selectedStyle === 'All'
    ? classes
    : classes.filter(c => c?.danceStyle === selectedStyle);

  const studioName = settings?.studioName || 'Om Natraj Dance Studio';
  const city = settings?.city || '';

  return (
    <ErrorBoundary>
      <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
        
        {/* Header */}
        <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          <div className="site-container">
            <span className="section-eyebrow">Disciplines & Schedules</span>
            <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
              Dance Programs & <br />
              <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
                Curated Batches
              </span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              color: 'var(--text-main)',
              maxWidth: '820px',
              lineHeight: 1.5,
              fontWeight: 300
            }}>
              Explore our curriculum spanning classical foundations, high-energy festival Garba, urban street culture, and bespoke wedding choreography.
            </p>

            {/* Style Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '2.5rem' }}>
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '2px',
                    background: selectedStyle === style ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                    color: selectedStyle === style ? '#070709' : '#fff',
                    border: '1px solid',
                    borderColor: selectedStyle === style ? 'var(--accent-gold)' : 'var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: selectedStyle === style ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Classes Grid */}
        <section className="section-spacer" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
          <div className="site-container">
            
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                marginBottom: '5rem'
              }}>
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="class-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.02)',
                      minHeight: '480px'
                    }}
                  >
                    <div>
                      <div style={{ height: '240px', background: 'rgba(255,255,255,0.04)' }} />
                      <div style={{ padding: '2rem' }}>
                        <div style={{ height: '18px', width: '40%', background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem', borderRadius: '2px' }} />
                        <div style={{ height: '28px', width: '75%', background: 'rgba(255,255,255,0.08)', marginBottom: '1rem', borderRadius: '2px' }} />
                        <div style={{ height: '14px', width: '90%', background: 'rgba(255,255,255,0.04)', marginBottom: '0.6rem', borderRadius: '2px' }} />
                        <div style={{ height: '14px', width: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                marginBottom: '5rem'
              }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.8rem' }}>
                  No Batches Currently Available
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 2rem auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {error || 'We are regularly opening new morning, evening, and weekend batches. Connect directly with our studio counselors on WhatsApp for bespoke batch timings and upcoming admissions.'}
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {error && (
                    <button
                      onClick={fetchClasses}
                      className="btn btn-outline"
                      style={{ padding: '12px 22px', fontSize: '0.84rem' }}
                    >
                      Retry Loading
                    </button>
                  )}
                  <a
                    href={getWhatsAppUrl(`Hi ${studioName}! I would like to inquire about upcoming dance batch schedules${city ? ` in ${city}` : ''}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ padding: '12px 22px', fontSize: '0.84rem' }}
                  >
                    <MessageSquare size={16} />
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                marginBottom: '5rem'
              }}>
                {filtered.map((item) => (
                  <div key={item._id} className="class-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="class-card-image-box">
                        <img
                          src={item.image || '/images/bollywood-hiphop.jpg'}
                          alt={item.name}
                          className="class-card-image"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/bollywood-hiphop.jpg';
                          }}
                        />
                        <span className="class-card-badge">{item.danceStyle}</span>
                      </div>

                      <div style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                            color: 'var(--accent-gold)',
                            background: 'rgba(212, 175, 55, 0.1)',
                            padding: '4px 10px',
                            border: '1px solid var(--border-gold)'
                          }}>
                            {item.level || 'All Levels'}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                            color: 'var(--text-dim)',
                            padding: '4px 8px'
                          }}>
                            {item.ageGroup || 'All Ages'}
                          </span>
                        </div>

                        <h3 style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.75rem',
                          color: '#fff',
                          marginBottom: '0.75rem',
                          lineHeight: 1.25
                        }}>
                          {item.name}
                        </h3>

                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.94rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.65,
                          marginBottom: '1.75rem'
                        }}>
                          {item.description}
                        </p>

                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                            <Clock size={15} color="var(--accent-gold)" />
                            <span>Schedule: <strong>{item.schedule || 'Mon - Fri batches'}</strong></span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                            <User size={15} color="var(--accent-gold)" />
                            <span>Faculty: <strong>{item.instructor || 'Senior Faculty'}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', gap: '12px' }}>
                      <a
                        href={getWhatsAppUrl(`Hi ${studioName}! I would like to enquire about the "${item.name}" batch${city ? ` in ${city}` : ''}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                        style={{ flex: 1, padding: '12px', fontSize: '0.8rem' }}
                      >
                        <MessageSquare size={16} />
                        Enquire WhatsApp
                      </a>
                      <a
                        href="#enrol-form"
                        className="btn btn-primary"
                        style={{ padding: '12px 18px', fontSize: '0.8rem' }}
                      >
                        Enrol
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Registration Form Box */}
            <div id="enrol-form" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <LeadEnquiryForm defaultStyle={selectedStyle !== 'All' ? selectedStyle : 'Bollywood Commercial'} />
            </div>

          </div>
        </section>

      </div>
    </ErrorBoundary>
  );
};
