import React, { useState, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import { api } from '../services/api';
import { MediaModal } from '../components/MediaModal';

export const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const [activeMedia, setActiveMedia] = useState({
    isOpen: false,
    url: '',
    type: 'image',
    title: ''
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.getGallery();
        if (res.success && res.gallery) {
          setGallery(res.gallery);
        }
      } catch (err) {
        console.warn('Gallery load fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', ...new Set(gallery.map(g => g.category))];
  const filtered = category === 'All' ? gallery : gallery.filter(g => g.category === category);

  const openLightbox = (item) => {
    setActiveMedia({
      isOpen: true,
      url: item.imageUrl,
      type: item.mediaType || 'image',
      title: item.title
    });
  };

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      
      {/* Header */}
      <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="site-container">
          <span className="section-eyebrow">Studio Photography & Visuals</span>
          <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Cinematic <br />
            <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
              Dance Gallery
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
            Explore stage performances, studio rehearsals, Garba nights, and wedding choreography captured through editorial theater photography.
          </p>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '2.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '2px',
                  background: category === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                  color: category === cat ? '#070709' : '#fff',
                  border: '1px solid',
                  borderColor: category === cat ? 'var(--accent-gold)' : 'var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: category === cat ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artistic Masonry / Editorial Grid */}
      <section className="section-spacer" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
        <div className="site-container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}>
            {filtered.map((item, idx) => {
              // Create dynamic visual variety: some large cards, some portrait
              const isLarge = idx % 5 === 0;
              return (
                <div
                  key={item._id}
                  onClick={() => openLightbox(item)}
                  style={{
                    position: 'relative',
                    height: isLarge ? '520px' : '380px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    background: '#121218',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                  className="cinematic-card"
                  data-cursor="EXPAND"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="cinematic-reveal-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Gradient Mask */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 35%, rgba(7,7,9,0.85) 100%)',
                    transition: 'background 0.3s ease'
                  }} />

                  {/* Text Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    zIndex: 2
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.18em',
                      color: 'var(--accent-gold)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px'
                    }}>
                      {item.category}
                    </span>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      color: '#fff',
                      lineHeight: 1.25,
                      marginBottom: '4px'
                    }}>
                      {item.title}
                    </h3>

                    {item.description && (
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Floating Eye Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(7,7,9,0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}>
                    <Eye size={18} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Lightbox */}
      <MediaModal
        isOpen={activeMedia.isOpen}
        onClose={() => setActiveMedia(prev => ({ ...prev, isOpen: false }))}
        mediaUrl={activeMedia.url}
        mediaType={activeMedia.type}
        title={activeMedia.title}
      />
    </div>
  );
};
