import React, { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import { api } from '../services/api';
import { MediaModal } from '../components/MediaModal';

export const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeMedia, setActiveMedia] = useState({
    isOpen: false,
    url: '',
    type: 'video',
    title: ''
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.getVideos();
        if (res.success && res.videos) {
          setVideos(res.videos);
        }
      } catch (err) {
        console.warn('Video load fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const playVideo = (v) => {
    setActiveMedia({
      isOpen: true,
      url: v.videoUrl,
      type: 'video',
      title: v.title
    });
  };

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      
      <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="site-container">
          <span className="section-eyebrow">Studio Motion Archives</span>
          <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Dance Films & <br />
            <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
              Choreography Reels
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
            Watch stage performances, studio highlight reels, Garba festival choreography, and wedding dances created by Om Natraj Dance Studio.
          </p>
        </div>
      </section>

      <section className="section-spacer" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
        <div className="site-container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)'
          }}>
            {videos.map((item) => (
              <div
                key={item._id}
                onClick={() => playVideo(item)}
                style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#121218',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '2rem'
                }}
                className="cinematic-card"
                data-cursor="PLAY"
              >
                <img
                  src={item.posterUrl || '/images/hero-dance.jpg'}
                  alt={item.title}
                  className="cinematic-reveal-img"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(7,7,9,0.2) 20%, rgba(7,7,9,0.92) 100%)'
                }} />

                {/* Central Play Icon */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.9)',
                  boxShadow: '0 0 35px rgba(212, 175, 55, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#070709',
                  transition: 'transform 0.3s ease'
                }}>
                  <Play size={28} fill="#070709" style={{ marginLeft: '4px' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: 'var(--accent-gold)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    DURATION: {item.duration || '02:00'}
                  </span>

                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.6rem',
                    color: '#fff',
                    marginBottom: '4px',
                    lineHeight: 1.25
                  }}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)'
                    }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Video Lightbox Player */}
      <MediaModal
        isOpen={activeMedia.isOpen}
        onClose={() => setActiveMedia(prev => ({ ...prev, isOpen: false }))}
        mediaUrl={activeMedia.url}
        mediaType="video"
        title={activeMedia.title}
      />
    </div>
  );
};
