import React, { useState } from 'react';
import { Play, Film, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DanceMomentsVideo = ({ videos = [], onPlayVideo }) => {
  const videoList = videos.length > 0
    ? videos
    : [
        {
          _id: '1',
          title: 'OM NATRAJ DANCE STUDIO - Studio Reel 2026',
          description: 'A cinematic montage capturing our contemporary, Bollywood, and Garba choreography.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          posterUrl: '/images/hero-dance.jpg',
          duration: '01:45',
          featured: true
        },
        {
          _id: '2',
          title: 'Grand Navratri Garba Highlights',
          description: 'Live performance of our senior Garba troupe performing authentic Gujarati steps.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: '/images/garba-dance.jpg',
          duration: '02:10',
          featured: false
        },
        {
          _id: '3',
          title: 'Royal Wedding Sangeet Choreography',
          description: 'Romantic couple choreography and energetic family flashmob staged with grace.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          posterUrl: '/images/wedding-dance.jpg',
          duration: '01:50',
          featured: false
        }
      ];

  const featured = videoList.find(v => v.featured) || videoList[0];
  const others = videoList.filter(v => v._id !== featured._id);

  return (
    <section className="section-spacer" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      
      {/* Background Soft Spotlight */}
      <div className="spotlight-glow spotlight-wine" style={{ width: '550px', height: '550px', top: '15%', left: '5%' }} />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', gap: '20px' }}>
          <div>
            <span className="section-eyebrow">Cinematic Showcase</span>
            <h2 className="editorial-section-title">
              Dance Moments & <span className="editorial-italic">Motion Reels</span>
            </h2>
          </div>
          <Link to="/videos" className="btn btn-outline" data-cursor="ALL">
            View All Videos
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Featured Video + Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)', alignItems: 'stretch' }}>
          
          {/* Main Hero Video Card */}
          <div
            onClick={() => onPlayVideo && onPlayVideo(featured.videoUrl, featured.title)}
            style={{
              gridColumn: 'span 1',
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#0f0f15',
              border: '1px solid var(--border-gold)',
              minHeight: '440px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2.5rem'
            }}
            className="cinematic-card"
            data-cursor="PLAY"
          >
            <img
              src={featured.posterUrl || '/images/hero-dance.jpg'}
              alt={featured.title}
              className="cinematic-reveal-img"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(7,7,9,0.2) 20%, rgba(7,7,9,0.92) 100%)'
            }} />

            {/* Play Button Indicator */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.9)',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070709',
              transition: 'transform 0.3s ease, background-color 0.3s ease'
            }}>
              <Play size={36} fill="#070709" style={{ marginLeft: '4px' }} />
            </div>

            {/* Bottom Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                  background: 'rgba(7,7,9,0.7)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  border: '1px solid var(--border-gold)'
                }}>
                  FEATURED REEL • {featured.duration || '01:45'}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                color: '#fff',
                marginBottom: '0.5rem',
                lineHeight: 1.2
              }}>
                {featured.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6
              }}>
                {featured.description}
              </p>
            </div>
          </div>

          {/* Secondary Video Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {others.slice(0, 2).map((item) => (
              <div
                key={item._id}
                onClick={() => onPlayVideo && onPlayVideo(item.videoUrl, item.title)}
                style={{
                  position: 'relative',
                  flex: 1,
                  minHeight: '200px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#121218',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.5rem'
                }}
                className="cinematic-card"
                data-cursor="PLAY"
              >
                <img
                  src={item.posterUrl || '/images/garba-dance.jpg'}
                  alt={item.title}
                  className="cinematic-reveal-img"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(7,7,9,0.2) 20%, rgba(7,7,9,0.9) 100%)'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(7,7,9,0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)'
                }}>
                  <Play size={20} fill="var(--accent-gold)" style={{ marginLeft: '2px' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.15em',
                    color: 'var(--accent-gold)',
                    textTransform: 'uppercase'
                  }}>
                    {item.duration || '02:00'}
                  </span>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    color: '#fff',
                    marginTop: '4px'
                  }}>
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
