import React, { useState, useEffect } from 'react';
import { Save, BarChart3, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useStudio } from '../../context/StudioContext';

export const AdminStatistics = () => {
  const { refreshSettings } = useStudio();
  const [stats, setStats] = useState([
    { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+', description: 'Nurturing dance excellence' },
    { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+', description: 'Across kids, youth & adult batches' },
    { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+', description: 'Bollywood, Garba, Hip-Hop, Contemporary & more' },
    { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+', description: 'Annual concerts, sangeet & cultural fests' }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings && res.settings.statistics) {
          setStats(res.settings.statistics);
        }
      } catch (err) {
        console.warn('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  const handleChange = (index, field, value) => {
    setStats(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: field === 'value' ? Number(value) : value };
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({ statistics: stats });
      await refreshSettings();
      alert('Studio statistics updated successfully!');
    } catch (err) {
      alert('Failed to update statistics: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Statistics & Milestone Counters
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Customize the animated counter numbers displayed on the homepage.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.75rem' }}>
        {stats.map((item, idx) => (
          <div key={item.id || idx} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                COUNTER 0{idx + 1}
              </span>
              <BarChart3 size={18} color="var(--accent-gold)" />
            </div>

            <div className="form-group">
              <label className="form-label">Metric Label</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleChange(idx, 'label', e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Target Number</label>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => handleChange(idx, 'value', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Suffix</label>
                <input
                  type="text"
                  value={item.suffix || '+'}
                  onChange={(e) => handleChange(idx, 'suffix', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Short Description</label>
              <input
                type="text"
                value={item.description || ''}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                placeholder="Brief explanatory note..."
                className="form-input"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
