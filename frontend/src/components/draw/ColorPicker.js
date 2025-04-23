import React, { useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { Popover, IconButton } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { SketchPicker } from 'react-color';
import { colorOptions } from './constants/drawingOptions';

const ColorPicker = ({ color, setColor }) => {
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handlePaletteClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowColorPicker(true);
  };

  const handleClosePalette = () => {
    setAnchorEl(null);
    setShowColorPicker(false);
  };

  return (
    <div>
      <h2 
        style={{ fontSize: '20px', marginBottom: '12px', color: '#333', fontWeight: 600 }} 
        id="color-label"
      >
        {t('Choose a Color')}
      </h2>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}
        aria-labelledby="color-label"
        role="group"
      >
        {/* Custom color button */}
        <IconButton 
          onClick={handlePaletteClick}
          aria-label={t('Open color palette')}
          aria-expanded={showColorPicker}
          aria-haspopup="dialog"
          style={{
            backgroundColor: color,
            border: '2px solid #4e7de9',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
          }}
        >
          <PaletteIcon style={{ color: '#fff' }} />
        </IconButton>

        {/* Predefined colors */}
        {colorOptions.map((colorOption) => (
          <button
            key={colorOption}
            onClick={() => setColor(colorOption)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: colorOption,
              cursor: 'pointer',
              border: color === colorOption ? '3px solid #4e7de9' : '1px solid #ddd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: color === colorOption ? 'scale(1.1)' : 'scale(1)',
            }}
            aria-label={`${t('Color')} ${colorOption}`}
            aria-pressed={color === colorOption}
          />
        ))}
      </div>

      {/* Color picker popover */}
      <Popover
        open={showColorPicker}
        anchorEl={anchorEl}
        onClose={handleClosePalette}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: { marginLeft: '8px' },
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': t('Color picker')
        }}
      >
        <div style={{ padding: '10px' }}>
          <SketchPicker 
            color={color}
            onChangeComplete={(newColor) => setColor(newColor.hex)}
            aria-label={t('Select a custom color')}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginTop: '10px' 
          }}>
            <button
              onClick={handleClosePalette}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                backgroundColor: '#4e7de9',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {t('Done')}
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default ColorPicker;