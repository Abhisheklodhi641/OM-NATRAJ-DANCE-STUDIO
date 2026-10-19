import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUpRight, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { Hero } from '../components/Hero';
import { IntroStatement } from '../components/IntroStatement';
import { DanceStyles } from '../components/DanceStyles';
import { WhyOmNatraj } from '../components/WhyOmNatraj';
import { PinnedStory } from '../components/PinnedStory';
import { HorizontalGallery } from '../components/HorizontalGallery';
import { DanceMomentsVideo } from '../components/DanceMomentsVideo';
import { WorkshopsEvents } from '../components/WorkshopsEvents';
import { ProductsShowcase } from '../components/ProductsShowcase';
import { Testimonials } from '../components/Testimonials';
import { LeadEnquiryForm } from '../components/LeadEnquiryForm';
import { MediaModal } from '../components/MediaModal';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';

export const HomePage = () => {
  const { settings, getWhatsAppUrl } = useStudio();
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Media Modal state
  const [modalMedia, setModalMedia] = useState({
    isOpen: false,
    url: '',
    type: 'image',
    title: ''
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [clsRes, evRes, vidRes, prodRes, testRes, galRes] = await Promise.allSettled([
          api.getClasses('active'),
          api.getEvents('upcoming'),
          api.getVideos(),
          api.getProducts(),
          api.getTestimonials(),
          api.getGallery()
        ]);

        if (clsRes.status === 'fulfilled' && clsRes.value.classes) setClasses(clsRes.value.classes);
        if (evRes.status === 'fulfilled' && evRes.value.events) setEvents(evRes.value.events);
        if (vidRes.status === 'fulfilled' && vidRes.value.videos) setVideos(vidRes.value.videos);
        if (prodRes.status === 'fulfilled' && prodRes.value.products) setProducts(prodRes.value.products);
        if (testRes.status === 'fulfilled' && testRes.value.testimonials) setTestimonials(testRes.value.testimonials);
        if (galRes.status === 'fulfilled' && (galRes.value.gallery || galRes.value.items)) {
          setGallery(galRes.value.gallery || galRes.value.items);
        }
      } catch (e) {
        console.warn('Home data partial load fallback:', e);
      }
    };

    loadHomeData();
  }, []);

  const openImageModal = (url, title) => {
    setModalMedia({
      isOpen: true,
      url,
      type: 'image',
      title
    });
  };

  const openVideoModal = (url, title) => {
    setModalMedia({
      isOpen: true,
      url,
      type: 'video',
      title
    });
  };

  const closeModal = () => {
    setModalMedia(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div>
      {/* 1. Cinematic Hero */}
      <Hero />

      {/* 2. Editorial Philosophy Statement */}
      <IntroStatement />

      {/* 3. Dance Disciplines & Interactive Preview */}
      <DanceStyles classes={classes} />

      {/* 4. Why Om Natraj Dance Studio */}
      <WhyOmNatraj />

      {/* 5. Pinned Storytelling Section ("01 - Find Your Rhythm", "02 - Build Confidence", "03 - Own Stage") */}
      <PinnedStory />

      {/* 6. Horizontal Gallery ("Move. Feel. Express.") */}
      <HorizontalGallery items={gallery} onImageClick={openImageModal} />


      {/* 8. Dance Moments & Video Reels */}
      <DanceMomentsVideo videos={videos} onPlayVideo={openVideoModal} />

      {/* 9. Upcoming Events & Workshops */}
      <WorkshopsEvents events={events} />

      {/* 10. Studio Boutique & Seasonal Garba Products */}
      <ProductsShowcase products={products} />

      {/* 11. Performer Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* 12. Final High-Impact Cinematic CTA */}
      <section className="section-spacer" style={{
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, #100b12 50%, var(--bg-primary) 100%)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Glow & Spotlight */}
        <div className="spotlight-glow spotlight-gold" style={{ width: '600px', height: '600px', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />

        <div className="site-container" style={{ position: 'relative', zIndex: 1, maxWidth: '840px' }}>
          <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
            Take The Stage
          </span>

          <h2 className="editorial-section-title" style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Ready to Find <span className="editorial-italic">Your Rhythm?</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--text-main)',
            lineHeight: 1.5,
            marginBottom: '2.5rem',
            fontWeight: 300
          }}>
            Whether you are stepping into a dance studio for the first time, preparing for Navratri Garba, or choreographing a royal wedding{settings.city ? ` in ${settings.city}` : ''}, we are here to guide every step.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '18px' }}>
            <a href="#lead-booking-section" className="btn btn-primary" data-cursor="JOIN">
              Join A Class
              <ArrowUpRight size={18} />
            </a>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              data-cursor="WHATSAPP"
            >
              <MessageSquare size={18} />
              Talk On WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 13. Contact & Lead Capture Section */}
      <section id="lead-booking-section" className="section-spacer" style={{ background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="site-container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center'
          }}>
            
            {/* Left Studio Information */}
            <div>
              <span className="section-eyebrow">Studio Location & Inquiries</span>
              <h2 className="editorial-section-title" style={{ marginBottom: '1.75rem' }}>
                Visit Our Studio <span className="editorial-italic">{settings.city ? `In ${settings.city}` : 'Today'}</span>
              </h2>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                marginBottom: '2.5rem'
              }}>
                Experience professional dance education in a premium, welcoming environment equipped with mirrored walls, sound systems, and dedicated choreographers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '2.5rem' }}>
                
                {settings.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '4px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)'
                    }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Call Us Directly
                      </span>
                      <a
                        href={`tel:${settings.phone}`}
                        style={{ display: 'block', fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '4px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)'
                    }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Email Inquiries
                      </span>
                      <a
                        href={`mailto:${settings.email}`}
                        style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-muted)' }}
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '4px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Studio Address
                    </span>
                    <span style={{ display: 'block', fontSize: '1.05rem', color: '#fff' }}>
                      {settings.address || 'Studio Address'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Action */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ padding: '14px 28px' }}
              >
                <MessageSquare size={18} />
                Connect With Dance Director
              </a>
            </div>

            {/* Right Lead Capture Form */}
            <div>
              <LeadEnquiryForm />
            </div>

          </div>

        </div>
      </section>

      {/* Lightbox / Video Modal */}
      <MediaModal
        isOpen={modalMedia.isOpen}
        onClose={closeModal}
        mediaUrl={modalMedia.url}
        mediaType={modalMedia.type}
        title={modalMedia.title}
      />
    </div>
  );
};
