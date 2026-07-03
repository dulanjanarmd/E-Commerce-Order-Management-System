import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '94771234567'; // LankaThread support number
  const message = encodeURIComponent('Hi LankaThread! I have a question about your products.');
  
  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button 
      className="whatsapp-btn"
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
      <span className="whatsapp-tooltip">Chat with us</span>
    </button>
  );
};

export default WhatsAppButton;
