import React, { useEffect, useState } from 'react';

// This component helps announce actions to screen readers
const AccessibilityAnnouncer = () => {
  const [message, setMessage] = useState('');
  
  // Global function for announcing messages
  useEffect(() => {
    // Expose a global function to announce messages
    window.announceToScreenReader = (text) => {
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
      aria-live="assertive" 
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

export default AccessibilityAnnouncer;

// Utility hook for screen reader announcements
export const useScreenReaderAnnouncement = () => {
  const announce = (message) => {
    if (window.announceToScreenReader) {
      window.announceToScreenReader(message);
    }
  };
  
  return { announce };
};