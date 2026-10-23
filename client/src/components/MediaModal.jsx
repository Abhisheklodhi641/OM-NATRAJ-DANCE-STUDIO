import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Normalizes Cloudinary video URLs for universal browser & mobile playback.
 * Injects f_auto,q_auto,vc_h264 transformations so Cloudinary delivers universal
 * H.264 MP4 streams to all browsers (Chromium, Firefox, Safari, iOS, Android)
 * without blindly renaming extensions or breaking delivery.
 */
const getOptimizedVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    let transformed = url;
    if (!transformed.includes('/video/upload/f_') && !transformed.includes('/video/upload/vc_') && !transformed.includes('/video/upload/q_')) {
      transformed = transformed.replace('/video/upload/', '/video/upload/f_auto,q_auto,vc_h264/');
    }
    return transformed;
  }
  return url;
};

export const MediaModal = ({ isOpen, onClose, mediaUrl, mediaType = 'image', title = '' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mediaUrl) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close modal">
          <X size={32} />
        </button>

        {mediaType === 'video' ? (
          <div style={{ width: '100%', borderRadius: '6px', overflow: 'hidden', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <video
              src={getOptimizedVideoUrl(mediaUrl)}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '80vh', display: 'block' }}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', maxWidth: '100%' }}>
            <img
              src={mediaUrl}
              alt={title || 'Enlarged Preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '6px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            />
          </div>
        )}

        {title && (
          <div style={{
            marginTop: '1.25rem',
            textAlign: 'center',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem'
          }}>
            {title}
          </div>
        )}

      </div>
    </div>
  );
};
