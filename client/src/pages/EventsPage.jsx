import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import { LeadEnquiryForm } from '../components/LeadEnquiryForm';

export const EventsPage = () => {
  const { getWhatsAppUrl, settings = {} } = useStudio();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getEvents();
        if (res.success && res.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.warn('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      
      <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="site-container">
          <span className="section-eyebrow">Workshops & Masterclasses</span>
          <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Stage Events & <br />
            <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
              Dance Bootcamps
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
            From seasonal Navratri Garba intensive training to annual stage festivals and masterclasses with guest choreographers{settings.city ? ` in ${settings.city}` : ''}.
          </p>
        </div>
      </section>

      <section className="section-spacer" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
        <div className="site-container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '5rem'
          }}>
            {events.map((item) => (
              <div key={item._id} className="class-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="class-card-image-box">
                    <img src={item.image || '/images/garba-dance.jpg'} alt={item.name} className="class-card-image" />
                    <span className="class-card-badge">{item.badge || 'Workshop'}</span>
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        <Calendar size={14} />
                        {item.date}
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        <Clock size={14} />
                        {item.time || 'Evening'}
                      </div>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
                      <MapPin size={14} color="var(--accent-gold)" />
                      {item.location || (settings.city ? `${settings.studioName || 'Om Natraj Dance Studio'}, ${settings.city}` : (settings.studioName || 'Om Natraj Dance Studio'))}
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.94rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.65,
                      marginBottom: '2rem'
                    }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', gap: '12px' }}>
                  <a
                    href={getWhatsAppUrl(`Hi ${settings.studioName || 'Om Natraj Studio'}! I would like to book a seat for the "${item.name}" event${settings.city ? ` in ${settings.city}` : ''}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ flex: 1, padding: '12px', fontSize: '0.8rem' }}
                  >
                    <MessageSquare size={16} />
                    Book via WhatsApp
                  </a>
                  <a
                    href="#event-enrol"
                    className="btn btn-primary"
                    style={{ padding: '12px 18px', fontSize: '0.8rem' }}
                  >
                    Register
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div id="event-enrol" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <LeadEnquiryForm defaultStyle="Authentic Garba Workshop" />
          </div>

        </div>
      </section>

    </div>
  );
};
