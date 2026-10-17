import React from 'react';
import { Calendar, MapPin, Clock, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

export const WorkshopsEvents = ({ events = [] }) => {
  const { getWhatsAppUrl } = useStudio();

  const eventList = events.length > 0
    ? events
    : [
        {
          _id: '1',
          name: 'Grand Navratri Garba Intensive Bootcamp',
          date: 'OCT 24 - 28, 2026',
          time: '6:30 PM - 9:00 PM',
          location: 'Om Natraj Dance Studio, Main Arena, Indore',
          description: 'An electrifying 5-day workshop covering authentic Mandvi steps, rapid spinning endurance, and group formations before the festival season kicks off.',
          image: '/images/garba-dance.jpg',
          badge: 'Signature Workshop'
        },
        {
          name: 'Sangeet & Wedding Dance Masterclass',
          _id: '2',
          date: 'NOV 14 - 15, 2026',
          time: '5:00 PM - 8:00 PM',
          location: 'Om Natraj Dance Studio, Hall B, Indore',
          description: 'Exclusive 2-day session for brides, grooms, and bridal entourages to polish transitions, stage lift basics, and camera-ready dance poses.',
          image: '/images/wedding-dance.jpg',
          badge: 'Couples & Family'
        },
        {
          name: 'Annual Studio Showcase: "Tarang 2026"',
          _id: '3',
          date: 'DEC 20, 2026',
          time: '6:00 PM onwards',
          location: 'Ravindra Natya Grah, Indore, MP',
          description: 'Our premier annual dance festival where all Om Natraj academy students take the stage in front of a live 1,000+ audience in Indore.',
          image: '/images/hero-dance.jpg',
          badge: 'Annual Concert'
        }
      ];

  return (
    <section className="section-spacer" style={{ background: 'var(--bg-secondary)', position: 'relative' }}>
      <div className="site-container">
        
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', gap: '20px' }}>
          <div>
            <span className="section-eyebrow">Upcoming Sessions</span>
            <h2 className="editorial-section-title">
              Workshops & <span className="editorial-italic">Special Events</span>
            </h2>
          </div>
          <Link to="/events" className="btn btn-outline" data-cursor="ALL">
            View All Events
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Cinematic Event Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem'
        }}>
          {eventList.map((item) => (
            <div
              key={item._id}
              className="class-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              data-cursor="EVENT"
            >
              <div>
                {/* Event Image Box */}
                <div className="class-card-image-box">
                  <img src={item.image} alt={item.name} className="class-card-image" />
                  <span className="class-card-badge">{item.badge || 'Workshop'}</span>
                </div>

                {/* Event Body */}
                <div style={{ padding: '2rem' }}>
                  {/* Meta items */}
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
                    fontSize: '1.65rem',
                    color: '#fff',
                    marginBottom: '0.75rem',
                    lineHeight: 1.25
                  }}>
                    {item.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
                    <MapPin size={14} color="var(--accent-gold)" />
                    {item.location || 'Indore Studio'}
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

              {/* Action Buttons */}
              <div style={{
                padding: '0 2rem 2rem 2rem',
                display: 'flex',
                gap: '12px'
              }}>
                <a
                  href={getWhatsAppUrl(`Hi Om Natraj Studio! I would like to book a seat for the "${item.name}" event in Indore.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ flex: 1, padding: '12px 16px', fontSize: '0.8rem' }}
                >
                  <MessageSquare size={16} />
                  Book Seat
                </a>

                <Link
                  to="/contact"
                  className="btn btn-outline"
                  style={{ padding: '12px 18px', fontSize: '0.8rem' }}
                >
                  Details
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
