import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StudioContext = createContext();

export const StudioProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    studioName: 'OM NATRAJ DANCE STUDIO',
    tagline: 'Where Movement Becomes Expression.',
    secondaryText: 'Learn. Move. Perform. Create.',
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    googleMapsUrl: '',
    latitude: null,
    longitude: null,
    youtubeUrl: 'https://www.youtube.com/@OMNDS',
    instagramUrl: 'https://instagram.com/omnatrajdancestudio',
    facebookUrl: '',
    introHeading: "Dance is not just about learning steps.\nIt's about finding your own rhythm.",
    introSubtext: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers.',
    statistics: [
      { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+' },
      { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+' },
      { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+' },
      { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+' }
    ],
    footerText: 'A premier dance academy fostering rhythm, confidence, and artistic performance.'
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings) {
        setSettings(prev => ({ ...prev, ...res.settings }));
      }
    } catch (err) {
      console.warn('Using default studio settings fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Synchronize dynamic SEO metadata and JSON-LD structured data with loaded settings
  useEffect(() => {
    if (!settings.studioName) return;

    // Dynamic Title
    const locationSuffix = settings.city ? ` in ${settings.city}` : '';
    document.title = `${settings.studioName} | Premier Dance Academy${locationSuffix}`;

    // Dynamic Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `${settings.studioName}${settings.city ? ` in ${settings.city}, ${settings.state || ''}` : ''}. ${settings.tagline || 'Where movement becomes expression.'} Premier dance academy offering Bollywood, Garba, Contemporary, Hip-Hop and wedding choreography.`
      );
    }

    // Dynamic OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${settings.studioName} | ${settings.tagline || 'Where Movement Becomes Expression'}`);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', `Premier dance academy${settings.city ? ` in ${settings.city}` : ''}. Experience world-class choreography, passionate faculty, and immersive stage craft.`);
    }

    // Dynamic JSON-LD Structured Data
    let scriptTag = document.getElementById('studio-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'studio-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "DanceStudio",
      "name": settings.studioName,
      "description": settings.tagline || settings.introHeading,
      "telephone": settings.phone || undefined,
      "email": settings.email || undefined,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": settings.address || undefined,
        "addressLocality": settings.city || undefined,
        "addressRegion": settings.state || undefined,
        "addressCountry": settings.country || 'IN'
      },
      "url": typeof window !== 'undefined' ? window.location.origin : undefined,
      "sameAs": [
        settings.youtubeUrl,
        settings.instagramUrl,
        settings.facebookUrl
      ].filter(Boolean)
    };

    if (settings.latitude && settings.longitude) {
      structuredData.geo = {
        "@type": "GeoCoordinates",
        "latitude": settings.latitude,
        "longitude": settings.longitude
      };
    }

    scriptTag.textContent = JSON.stringify(structuredData);
  }, [settings]);

  // Dynamic Google Maps Embed URL generator
  const getMapEmbedUrl = () => {
    if (settings.googleMapsUrl && settings.googleMapsUrl.trim()) {
      const match = settings.googleMapsUrl.match(/src=["'](.*?)["']/);
      if (match) return match[1];
      if (settings.googleMapsUrl.includes('output=embed')) return settings.googleMapsUrl;
      if (settings.googleMapsUrl.includes('google.com/maps') || settings.googleMapsUrl.includes('maps.google.com')) {
        const separator = settings.googleMapsUrl.includes('?') ? '&' : '?';
        return `${settings.googleMapsUrl}${separator}output=embed`;
      }
    }
    if (settings.latitude && settings.longitude) {
      return `https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
    const locationQuery = encodeURIComponent(settings.address || (settings.city ? `${settings.city}, ${settings.state || 'Madhya Pradesh'}` : 'Banmore, Morena, Madhya Pradesh, India'));
    return `https://maps.google.com/maps?q=${locationQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  // Helper to generate pre-filled WhatsApp links
  const getWhatsAppUrl = (customMessage = '') => {
    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const defaultMsg = `Hi ${settings.studioName || 'OM NATRAJ DANCE STUDIO'}! I am interested in joining dance classes${settings.city ? ` in ${settings.city}` : ''}. Please share batch timings and details.`;
    const text = encodeURIComponent(customMessage || defaultMsg);
    return cleanNumber ? `https://wa.me/${cleanNumber}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  // Helper to generate pre-filled Product WhatsApp inquiries
  const getProductWhatsAppUrl = ({ productName, price, size, quantity = 1, userName = '' }) => {
    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    let msg = `Hi ${settings.studioName || 'OM NATRAJ DANCE STUDIO'},\n\nI am interested in this product:\n\n• Product: ${productName}\n• Price: ₹${price}\n• Selected Size: ${size || 'Standard'}\n• Quantity: ${quantity}`;
    if (userName) {
      msg += `\n• My Name: ${userName}`;
    }
    msg += `\n\nPlease share availability and order details.`;
    return cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <StudioContext.Provider value={{
      settings,
      loading,
      refreshSettings: fetchSettings,
      getWhatsAppUrl,
      getProductWhatsAppUrl,
      getMapEmbedUrl
    }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    return {
      settings: {
        studioName: 'OM NATRAJ DANCE STUDIO',
        city: 'Banmore',
        state: 'Madhya Pradesh',
        whatsappNumber: '919893000000',
        phone: '+91 98930 00000',
        address: 'Near Old Bus Stand, Banmore, Morena, Madhya Pradesh',
      },
      loading: false,
      refreshSettings: () => {},
      getWhatsAppUrl: (msg) => `https://wa.me/?text=${encodeURIComponent(msg || '')}`,
      getProductWhatsAppUrl: () => 'https://wa.me/',
      getMapEmbedUrl: () => ''
    };
  }
  return context;
};
