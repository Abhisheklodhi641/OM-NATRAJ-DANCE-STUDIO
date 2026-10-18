import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  Calendar,
  Image,
  Video,
  ShoppingBag,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';

export const AdminLayout = () => {
  const { admin, loading, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090c', color: 'var(--accent-gold)' }}>
        Verifying Admin Access...
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Leads & Enquiries', path: '/admin/leads', icon: Users },
    { label: 'Dance Classes', path: '/admin/classes', icon: Layers },
    { label: 'Events & Workshops', path: '/admin/events', icon: Calendar },
    { label: 'Gallery Media', path: '/admin/gallery', icon: Image },
    { label: 'Dance Videos', path: '/admin/videos', icon: Video },
    { label: 'Products & Couture', path: '/admin/products', icon: ShoppingBag },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Statistics Counters', path: '/admin/statistics', icon: BarChart3 },
    { label: 'Studio Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Top Navigation Bar */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label={sidebarOpen ? "Close admin navigation menu" : "Open admin navigation menu"}
            className="admin-menu-toggle"
          >
            {sidebarOpen ? <X size={24} color="var(--accent-gold)" /> : <Menu size={24} color="#fff" />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              OM NATRAJ
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--accent-gold)' }}>
              ADMIN
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              textDecoration: 'none'
            }}
            aria-label="View Public Website"
          >
            <ExternalLink size={18} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef5350',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Backdrop Overlay on Mobile */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-brand">
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}>
            <svg width="18" height="18" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="4"/>
              <path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill="#d4af37"/>
              <circle cx="50" cy="50" r="8" fill="#e2632b"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              OM NATRAJ
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', color: 'var(--accent-gold)' }}>
              STUDIO CONTROL
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            to="/"
            target="_blank"
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
              borderRadius: '4px',
              marginBottom: '8px',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={16} />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              color: '#ef5350',
              background: 'rgba(244, 67, 54, 0.08)',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="admin-main">
        <ErrorBoundary isolated>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};
