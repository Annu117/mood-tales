import React from 'react';
import { useLanguage } from '../../utils/LanguageContext';

const ActionButtons = ({ onUndo, onClear, onSave }) => {
  const { t } = useLanguage();

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '20px' 
      }}
      role="toolbar"
      aria-label={t('Drawing actions')}
    >
      <button
        onClick={onUndo}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'white',
          color: '#4e7de9',
          border: '1px solid #4e7de9',
          borderRadius: '999px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(78, 125, 233, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        aria-label={t('Undo last drawing action')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 10H18C19.6569 10 21 11.3431 21 13V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V13C3 11.3431 4.34315 10 6 10" stroke="#4e7de9" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 10L13 6M9 10L13 14" stroke="#4e7de9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('Undo')}
      </button>

      <button
        onClick={onClear}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'white',
          color: '#ff6d00',
          border: '1px solid #ff6d00',
          borderRadius: '999px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 109, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        aria-label={t('Clear the entire drawing')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="#ff6d00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('Clear Canvas')}
      </button>

      <button
        onClick={onSave}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#ff6d00',
          color: 'white',
          border: 'none',
          borderRadius: '999px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
        aria-label={t('Save your drawing and create a story')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 16.5L4.5 12L9 7.5M4.5 12H19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('Create Story')}
      </button>
    </div>
  );
};

export default ActionButtons;