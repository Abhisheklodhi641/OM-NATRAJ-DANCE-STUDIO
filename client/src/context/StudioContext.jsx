import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StudioContext = createContext();

export const StudioProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    studioName: 'OM NATRAJ DANCE STUDIO',
    tagline: 'Where Movement Becomes Expression.',
    secondaryText: 'Learn. Move. Perform. Create.',
    phone: '+91 9713799075',
    whatsappNumber: '919713799075',
    email: 'kushanikt667@gmail.com',
    address: 'Indore, Madhya Pradesh, India',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    youtubeUrl: 'https://www.youtube.com/@OMNDS',
    instagramUrl: 'https://instagram.com/omnatrajdancestudio',
    introHeading: "Dance is not just about learning steps.\nIt's about finding your own rhythm.",
    introSubtext: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers right here in Indore.',
    statistics: [
      { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+' },
      { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+' },
      { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+' },
      { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+' }
    ],
    footerText: 'A premier dance academy fostering rhythm, confidence, and artistic performance in Indore, Madhya Pradesh.'
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

  // Helper to generate pre-filled WhatsApp links
  const getWhatsAppUrl = (customMessage = '') => {
    const cleanNumber = (settings.whatsappNumber || '919713799075').replace(/[^0-9]/g, '');
    const defaultMsg = 'Hi Om Natraj Dance Studio! I am interested in joining dance classes in Indore. Please share batch timings and details.';
    const text = encodeURIComponent(customMessage || defaultMsg);
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  // Helper to generate pre-filled Product WhatsApp inquiries
  const getProductWhatsAppUrl = ({ productName, price, size, quantity = 1, userName = '' }) => {
    const cleanNumber = (settings.whatsappNumber || '919713799075').replace(/[^0-9]/g, '');
    let msg = `Hi Om Natraj Dance Studio,\n\nI am interested in this product:\n\n• Product: ${productName}\n• Price: ₹${price}\n• Selected Size: ${size || 'Standard'}\n• Quantity: ${quantity}`;
    if (userName) {
      msg += `\n• My Name: ${userName}`;
    }
    msg += `\n\nPlease share availability and order details.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <StudioContext.Provider value={{
      settings,
      loading,
      refreshSettings: fetchSettings,
      getWhatsAppUrl,
      getProductWhatsAppUrl
    }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => useContext(StudioContext);
