import React, { useEffect, useState } from 'react';

const ScreenReaderAnnouncer = () => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Expose a global function to announce messages
    window.announceToScreenReader = (text, priority = 'polite') => {
      setMessage(text);
      // Clear after screen reader has time to announce
      setTimeout(() => {
        setMessage('');
      }, 1000);
    };
    
    return () => {
      window.announceToScreenReader = undefined;
    };
  }, []);

  return (
    <div 
      aria-live={message ? 'assertive' : 'polite'}
      role="status"
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
    >
      {message}
    </div>
  );
};

export default ScreenReaderAnnouncer;

// Utility hook for screen reader announcements
export const useScreenReaderAnnouncement = () => {
  const announce = (message, priority = 'polite') => {
    if (window.announceToScreenReader) {
      window.announceToScreenReader(message, priority);
    }
  };
  
  return { announce };
}; 