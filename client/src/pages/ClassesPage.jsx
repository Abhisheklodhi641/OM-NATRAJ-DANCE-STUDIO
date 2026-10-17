import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowUpRight, MessageSquare, Filter } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import { LeadEnquiryForm } from '../components/LeadEnquiryForm';

export const ClassesPage = () => {
  const { getWhatsAppUrl } = useStudio();
  const [classes, setClasses] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.getClasses('active');
        if (res.success && res.classes) {
          setClasses(res.classes);
        }
      } catch (err) {
        console.warn('Failed to load classes from API:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const styles = ['All', ...new Set(classes.map(c => c.danceStyle))];
  const filtered = selectedStyle === 'All' ? classes : classes.filter(c => c.danceStyle === selectedStyle);

  return (
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
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            marginBottom: '5rem'
          }}>
            {filtered.map((item) => (
              <div key={item._id} className="class-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="class-card-image-box">
                    <img src={item.image || '/images/bollywood-hiphop.jpg'} alt={item.name} className="class-card-image" />
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
                    href={getWhatsAppUrl(`Hi Om Natraj Studio! I would like to enquire about the "${item.name}" batch in Indore.`)}
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

          {/* Registration Form Box */}
          <div id="enrol-form" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <LeadEnquiryForm defaultStyle={selectedStyle !== 'All' ? selectedStyle : 'Bollywood Commercial'} />
          </div>

        </div>
      </section>

    </div>
  );
};
