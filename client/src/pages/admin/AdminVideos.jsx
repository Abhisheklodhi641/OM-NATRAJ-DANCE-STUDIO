import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, EyeOff, Play, Film, X, Check } from 'lucide-react';
import { api } from '../../services/api';
import { MediaModal } from '../../components/MediaModal';

export const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    posterUrl: '/images/hero-dance.jpg',
    duration: '01:30',
    featured: false,
    published: true
  });

  const fetchVideos = async () => {
    try {
      const res = await api.getVideos('?all=true');
      if (res.success && res.videos) {
        setVideos(res.videos);
      }
    } catch (err) {
      alert('Error fetching videos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await api.updateVideo(id, { published: !currentStatus });
      setVideos(prev => prev.map(v => (v._id === id ? { ...v, published: !currentStatus } : v)));
    } catch (err) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setNewVideo(prev => ({
          ...prev,
          videoUrl: res.file.url,
          title: prev.title || file.name.split('.')[0].replace(/[-_]/g, ' ')
        }));
      }
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPoster(true);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setNewVideo(prev => ({ ...prev, posterUrl: res.file.url }));
      }
    } catch (err) {
      alert('Poster upload failed: ' + err.message);
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newVideo.videoUrl) {
      alert('Please upload a video file or enter video source');
      return;
    }
    if (!newVideo.title) {
      alert('Please enter a video title');
      return;
    }

    try {
      await api.createVideo(newVideo);
      alert('Dance video added!');
      setModalOpen(false);
      setNewVideo({
        title: '',
        description: '',
        videoUrl: '',
        posterUrl: '/images/hero-dance.jpg',
        duration: '01:30',
        featured: false,
        published: true
      });
      fetchVideos();
    } catch (err) {
      alert('Failed to save video: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dance video?')) return;
    try {
      await api.deleteVideo(id);
      setVideos(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Dance Moments & Video Archives
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Upload rehearsal videos, studio choreography reels, and custom video thumbnails.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="admin-btn admin-btn-primary">
          <Upload size={16} />
          <span>Upload New Video</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
        gap: '2rem'
      }}>
        {videos.map((vid) => (
          <div key={vid._id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{ position: 'relative', height: '200px', background: '#000', cursor: 'pointer' }}
              onClick={() => setActiveVideo(vid)}
              title="Click to play video"
            >
              <img
                src={vid.posterUrl || '/images/hero-dance.jpg'}
                alt={vid.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#070709',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                  <Play size={24} fill="#070709" style={{ marginLeft: '3px' }} />
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '8px',
                zIndex: 2
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePublish(vid._id, vid.published);
                  }}
                  style={{
                    background: vid.published !== false ? 'rgba(76, 175, 80, 0.85)' : 'rgba(255, 152, 0, 0.85)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={vid.published !== false ? 'Published (Click to hide)' : 'Unpublished (Click to show)'}
                >
                  {vid.published !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(vid._id);
                  }}
                  style={{
                    background: 'rgba(244, 67, 54, 0.85)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Delete Video"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(7,7,9,0.85)',
                padding: '4px 8px',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-gold)'
              }}>
                {vid.duration || '01:30'}
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff', marginBottom: '4px' }}>
                {vid.title}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {vid.description || 'Dance Studio Reel'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="lightbox-backdrop">
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
            background: '#121218',
            border: '1px solid var(--border-gold)',
            borderRadius: '8px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                Upload Dance Video
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              {/* Video File Upload */}
              <div style={{
                border: '2px dashed var(--border-gold)',
                borderRadius: '6px',
                padding: '1.75rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                background: 'rgba(212, 175, 55, 0.03)'
              }}>
                {newVideo.videoUrl ? (
                  <div>
                    <span style={{ color: '#81c784', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem' }}>
                      <Check size={16} /> Video uploaded: {newVideo.videoUrl.split('/').pop()}
                    </span>
                  </div>
                ) : (
                  <div>
                    <Film size={34} color="var(--accent-gold)" style={{ margin: '0 auto 10px' }} />
                    <p style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '8px' }}>
                      Select MP4, WebM, or MOV video file
                    </p>
                    <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
                      <span>{uploadingVideo ? 'Uploading Video...' : 'Choose Video File'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Poster File Upload */}
              <div className="form-group">
                <label className="form-label">Video Poster / Thumbnail</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={newVideo.posterUrl || '/images/hero-dance.jpg'}
                    alt="Poster Preview"
                    style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <label className="admin-btn" style={{ background: '#1c1c24', color: '#fff', cursor: 'pointer' }}>
                    <Upload size={14} />
                    <span>{uploadingPoster ? 'Uploading...' : 'Upload Thumbnail'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Video Title *</label>
                <input
                  type="text"
                  required
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="e.g. Navratri Garba Highlights 2026"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                  placeholder="e.g. 02:15"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  placeholder="Short description of performance..."
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '10px 20px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingVideo || !newVideo.videoUrl}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.82rem' }}
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Video Lightbox Player */}
      <MediaModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        mediaUrl={activeVideo?.videoUrl || activeVideo?.url}
        mediaType="video"
        title={activeVideo?.title}
      />
    </div>
  );
};
