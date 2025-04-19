import React, { useRef, useState, useEffect } from 'react';
import { Box, Paper, Button, Slider, Stack, Typography } from '@mui/material';
import { CirclePicker } from 'react-color';

const DrawingCanvas = ({ onSaveDrawing }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    setContext(ctx);
    
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setLastPosition({ x: offsetX, y: offsetY });
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    context.closePath();
    setDrawing(false);
  };

  const getCoordinates = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY
    };
  };

  const clearCanvas = () => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveDrawing = () => {
    const image = canvasRef.current.toDataURL('image/png');
    onSaveDrawing(image);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Draw Your Character
      </Typography>
      
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2
        }}
      >
        <canvas
          ref={canvasRef}
          width={540}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </Box>
      
      <Stack spacing={2}>
        <Typography>Brush Size</Typography>
        <Slider
          value={brushSize}
          min={1}
          max={30}
          onChange={(e, newValue) => setBrushSize(newValue)}
        />
        
        <Typography>Color</Typography>
        <CirclePicker
          color={color}
          onChange={(color) => setColor(color.hex)}
        />
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={clearCanvas}
            fullWidth
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            onClick={saveDrawing}
            fullWidth
          >
            Create Story
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DrawingCanvas;