import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, TextField, Paper, Typography } from '@mui/material';
import { useLanguage } from '../../utils/LanguageContext';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

const DrawingInput = ({ onDrawingSubmit, onClose }) => {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [description, setDescription] = useState('');
  const [lastPoint, setLastPoint] = useState(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastPoint({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    setLastPoint({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDescription('');
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    onDrawingSubmit({
      image: imageData,
      description: description
    });
    clearCanvas();
    onClose();
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('Draw Your Story')}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'crosshair'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '40px', height: '40px' }}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          style={{ width: '100px' }}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('Describe your drawing...')}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearCanvas}
        >
          {t('Clear')}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={!description.trim()}
        >
          {t('Submit Drawing')}
        </Button>
      </Box>
    </Paper>
  );
};

export default DrawingInput; 