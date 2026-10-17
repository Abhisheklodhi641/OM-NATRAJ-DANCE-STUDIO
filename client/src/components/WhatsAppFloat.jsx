import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const WhatsAppFloat = () => {
  const { getWhatsAppUrl } = useStudio();

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp with Om Natraj Dance Studio"
      data-cursor="WHATSAPP"
    >
      <MessageSquare size={26} />
    </a>
  );
};
