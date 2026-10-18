import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#070709',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Soft Glow */}
      <div className="spotlight-glow spotlight-gold" style={{ width: '450px', height: '450px', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />

      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '3rem 2.5rem',
        border: '1px solid var(--border-gold)',
        borderRadius: '8px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--accent-gold)'
          }}>
            <Lock size={26} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '0.08em',
            marginBottom: '4px'
          }}>
            OM NATRAJ DANCE
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: 'var(--accent-gold)',
            textTransform: 'uppercase'
          }}>
            ADMINISTRATION PORTAL
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 67, 54, 0.12)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            color: '#ef5350',
            padding: '12px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1.75rem',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-user">Admin Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-user"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                autoComplete="username"
              />
              <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" htmlFor="admin-pass">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                style={{ paddingLeft: '44px', paddingRight: '48px' }}
                autoComplete="current-password"
              />
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: showPassword ? 'var(--accent-gold)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
