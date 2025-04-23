import React from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { brushOptions } from './constants/drawingOptions';

const BrushControls = ({ brushSize, setBrushSize }) => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 
        style={{ fontSize: '20px', marginBottom: '12px', color: '#333', fontWeight: 600 }}
        id="brush-label"
      >
        {t('Brush Size')}
      </h2>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px' 
        }}
        role="radiogroup"
        aria-labelledby="brush-label"
      >
        {brushOptions.map((option) => (
          <button
            key={option.size}
            onClick={() => setBrushSize(option.size)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: brushSize === option.size ? '#4e7de9' : '#e0e0e0',
              color: brushSize === option.size ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: brushSize === option.size ? 'bold' : 'normal',
              fontSize: '16px',
              transition: 'all 0.2s',
            }}
            aria-label={`${t(option.name)} ${t('brush size')}`}
            aria-pressed={brushSize === option.size}
            role="radio"
          >
            {t(option.name)}
          </button>
        ))}
      </div>
      
      {/* Visual preview of brush size */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '12px',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: `${brushSize}px`,
            height: `${brushSize}px`,
            borderRadius: '50%',
            backgroundColor: '#4e7de9',
            transition: 'all 0.2s',
          }}
        />
      </div>
    </div>
  );
};

export default BrushControls;