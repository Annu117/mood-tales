import React, { useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';

const KeyboardShortcutsHelp = () => {
  const { t } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {/* Button to show keyboard shortcuts */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#4e7de9',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 100,
        }}
        aria-label={t('Keyboard shortcuts help')}
        aria-expanded={showHelp}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 18H13V16H11V18ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z" fill="white" />
        </svg>
      </button>

      {/* Keyboard shortcuts dialog */}
      {showHelp && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            padding: '16px',
            zIndex: 100,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 
              id="shortcuts-title"
              style={{ margin: 0, color: '#4e7de9', fontSize: '18px' }}
            >
              {t('Keyboard Shortcuts')}
            </h3>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={t('Close keyboard shortcuts')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
            <li style={{ margin: '8px 0' }}>
              <kbd style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>Ctrl + Z</kbd> 
              {' '}{t('Undo last action')}
            </li>
            <li style={{ margin: '8px 0' }}>
              <kbd style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>Escape</kbd>
              {' '}{t('Clear canvas')}
            </li>
            <li style={{ margin: '8px 0' }}>
              <kbd style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>Tab</kbd>
              {' '}{t('Navigate between controls')}
            </li>
          </ul>
          
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
          {t('For screen reader users: The canvas can be used with touch or mouse input. All drawing actions have keyboard alternatives, and color/brush selection controls are fully accessible.')}
          </p>
          
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#4e7de9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {t('Got it!')}
            </button>
          </div>
        </div>
      )}

      {/* Hidden accessible instructions for screen reader users */}
      <div className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>
        <h2>{t('Keyboard shortcuts')}:</h2>
        <ul>
          <li>{t('Press Control+Z to undo your last drawing action')}</li>
          <li>{t('Press Escape key to clear the canvas')}</li>
          <li>{t('Use Tab key to navigate between controls')}</li>
        </ul>
      </div>
      
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
};

export default KeyboardShortcutsHelp;