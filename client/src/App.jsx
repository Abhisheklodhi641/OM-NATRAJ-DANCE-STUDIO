import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudioProvider } from './context/StudioContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { WhatsAppFloat } from './components/WhatsAppFloat';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ClassesPage } from './pages/ClassesPage';
import { EventsPage } from './pages/EventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminClasses } from './pages/admin/AdminClasses';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminVideos } from './pages/admin/AdminVideos';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminStatistics } from './pages/admin/AdminStatistics';
import { AdminSettings } from './pages/admin/AdminSettings';

import { ErrorBoundary } from './components/ErrorBoundary';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper for public pages (with Navbar, Footer, WhatsApp Float)
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudioProvider>
          <ScrollToTop />
          {/* Subtle noise texture */}
          <div className="noise-overlay" />
          
          {/* Preloader and Desktop Cursor */}
          <Preloader />
          <CustomCursor />

          <Routes>
            {/* Public Routes with Navbar & Footer */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/classes" element={<PublicLayout><ClassesPage /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/videos" element={<PublicLayout><VideosPage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Portal with Separate Dashboard Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="statistics" element={<AdminStatistics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>
        </StudioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
