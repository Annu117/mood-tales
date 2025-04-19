// import React, { useRef, useState, useEffect } from 'react';
// import { Box, Paper, Button, Slider, Stack, Typography } from '@mui/material';
// import { CirclePicker } from 'react-color';

// const DrawingCanvas = ({ onSaveDrawing }) => {
//   const canvasRef = useRef(null);
//   const [context, setContext] = useState(null);
//   const [drawing, setDrawing] = useState(false);
//   const [color, setColor] = useState('#000000');
//   const [brushSize, setBrushSize] = useState(5);
//   const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.lineJoin = 'round';
//     ctx.lineCap = 'round';
//     ctx.lineWidth = brushSize;
//     setContext(ctx);
    
//     // Clear canvas with white background
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, []);

//   useEffect(() => {
//     if (context) {
//       context.strokeStyle = color;
//       context.lineWidth = brushSize;
//     }
//   }, [color, brushSize, context]);

//   const startDrawing = (e) => {
//     const { offsetX, offsetY } = getCoordinates(e);
//     context.beginPath();
//     context.moveTo(offsetX, offsetY);
//     setLastPosition({ x: offsetX, y: offsetY });
//     setDrawing(true);
//   };

//   const draw = (e) => {
//     if (!drawing) return;
    
//     const { offsetX, offsetY } = getCoordinates(e);
//     context.lineTo(offsetX, offsetY);
//     context.stroke();
//     setLastPosition({ x: offsetX, y: offsetY });
//   };

//   const stopDrawing = () => {
//     context.closePath();
//     setDrawing(false);
//   };

//   const getCoordinates = (e) => {
//     if (e.touches && e.touches[0]) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       return {
//         offsetX: e.touches[0].clientX - rect.left,
//         offsetY: e.touches[0].clientY - rect.top
//       };
//     }
//     return {
//       offsetX: e.nativeEvent.offsetX,
//       offsetY: e.nativeEvent.offsetY
//     };
//   };

//   const clearCanvas = () => {
//     context.fillStyle = 'white';
//     context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//   };

//   const saveDrawing = () => {
//     const image = canvasRef.current.toDataURL('image/png');
//     onSaveDrawing(image);
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
//       <Typography variant="h6" gutterBottom>
//         Draw Your Character
//       </Typography>
      
//       <Box
//         sx={{
//           border: '1px solid #ccc',
//           borderRadius: 2,
//           overflow: 'hidden',
//           mb: 2
//         }}
//       >
//         <canvas
//           ref={canvasRef}
//           width={540}
//           height={400}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           onTouchStart={startDrawing}
//           onTouchMove={draw}
//           onTouchEnd={stopDrawing}
//           style={{ touchAction: 'none' }}
//         />
//       </Box>
      
//       <Stack spacing={2}>
//         <Typography>Brush Size</Typography>
//         <Slider
//           value={brushSize}
//           min={1}
//           max={30}
//           onChange={(e, newValue) => setBrushSize(newValue)}
//         />
        
//         <Typography>Color</Typography>
//         <CirclePicker
//           color={color}
//           onChange={(color) => setColor(color.hex)}
//         />
        
//         <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//           <Button 
//             variant="outlined" 
//             onClick={clearCanvas}
//             fullWidth
//           >
//             Clear
//           </Button>
//           <Button 
//             variant="contained" 
//             onClick={saveDrawing}
//             fullWidth
//           >
//             Create Story
//           </Button>
//         </Stack>
//       </Stack>
//     </Paper>
//   );
// };

// export default DrawingCanvas;

import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ onSaveDrawing }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#FF4136'); // Start with a fun red color
  const [brushSize, setBrushSize] = useState(10); // Larger default brush for kids
  const [history, setHistory] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    setContext(ctx);

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Make canvas responsive
    const handleResize = () => {
      const container = canvas.parentElement;
      const newWidth = Math.min(container.clientWidth - 20, 800);
      setCanvasWidth(newWidth);
      setCanvasHeight(newWidth * 0.625); // Maintain aspect ratio
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update context when color or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context]);

  const saveToHistory = () => {
    const imageData = canvasRef.current.toDataURL();
    setHistory((prev) => [...prev, imageData]);
  };

  const undo = () => {
    if (history.length === 0) {
      showTemporaryMessage("Nothing to undo!");
      return;
    }
    
    const previous = history[history.length - 1];
    const img = new Image();
    img.src = previous;
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
      setHistory((prev) => prev.slice(0, -1));
    };
    showTemporaryMessage("Undo!");
  };

  const startDrawing = (e) => {
    saveToHistory();
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
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
        offsetY: e.touches[0].clientY - rect.top,
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    };
  };

  const clearCanvas = () => {
    saveToHistory();
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    showTemporaryMessage("Canvas cleared!");
  };

  const saveDrawing = () => {
    const image = canvasRef.current.toDataURL('image/png');
    onSaveDrawing(image);
    showTemporaryMessage("Creating your story!");
  };

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
      } else if (e.key === 'Escape') {
        clearCanvas();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]);

  // Fun color options for kids
  const colorOptions = [
    '#FF4136', // Red
    '#FF851B', // Orange
    '#FFDC00', // Yellow
    '#2ECC40', // Green
    '#0074D9', // Blue
    '#B10DC9', // Purple
    '#F012BE', // Magenta
    '#111111', // Black
    '#AAAAAA', // Gray
    '#FFFFFF', // White
  ];

  // Brush size options with fun names
  const brushOptions = [
    { name: "Tiny", size: 3 },
    { name: "Small", size: 8 },
    { name: "Medium", size: 15 },
    { name: "Large", size: 25 },
    { name: "HUGE!", size: 40 }
  ];

  return (
    <div 
      style={{
        maxWidth: '950px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif"
      }}
      role="application"
      aria-label="Drawing application for kids"
    >
      {/* Message pop-up */}
      {showMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFEB3B',
            color: '#333',
            padding: '15px 30px',
            borderRadius: '50px',
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            animation: 'bounce 0.5s'
          }}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <div 
        style={{
          backgroundColor: '#F0F8FF',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          border: '3px solid #4A90E2',
          position: 'relative'
        }}
      >
        <h1 
          style={{
            textAlign: 'center',
            color: '#4A90E2',
            fontSize: '32px',
            marginBottom: '20px'
          }}
        >
          🎨 Draw Your Amazing Character! 🎨
        </h1>
        
        <div 
          style={{
            borderRadius: '15px',
            overflow: 'hidden',
            marginBottom: '20px',
            border: '3px dashed #4A90E2',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center'
          }}
          aria-label="Drawing area"
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ 
              touchAction: 'none', 
              display: 'block',
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              cursor: 'crosshair'
            }}
            aria-label="Drawing canvas"
          />
        </div>

        {/* Instruction for screen readers */}
        <div className="sr-only" aria-live="polite">
          Use mouse or touch to draw. Press Ctrl+Z to undo. Press Escape to clear canvas.
        </div>
        
        {/* Controls split into sections */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Color selection */}
          <div>
            <h2 
              style={{ fontSize: '24px', marginBottom: '10px', color: '#4A90E2' }}
              id="color-label"
            >
              Pick a Color:
            </h2>
            <div 
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px',
                justifyContent: 'center' 
              }}
              role="radiogroup"
              aria-labelledby="color-label"
            >
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: colorOption,
                    cursor: 'pointer',
                    border: color === colorOption ? '4px solid #333' : '2px solid #ccc',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                    transform: color === colorOption ? 'scale(1.1)' : 'scale(1)'
                  }}
                  aria-label={`Color ${colorOption}`}
                  aria-pressed={color === colorOption}
                  title={colorOption}
                />
              ))}
            </div>
          </div>

          {/* Brush size selection */}
          <div>
            <h2 
              style={{ fontSize: '24px', marginBottom: '10px', color: '#4A90E2' }}
              id="brush-label"
            >
              Choose Brush Size:
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
                    padding: '10px 15px',
                    borderRadius: '15px',
                    border: brushSize === option.size ? '3px solid #4A90E2' : '1px solid #ccc',
                    backgroundColor: brushSize === option.size ? '#E3F2FD' : 'white',
                    cursor: 'pointer',
                    fontWeight: brushSize === option.size ? 'bold' : 'normal',
                    fontSize: '18px',
                    transition: 'all 0.2s',
                    transform: brushSize === option.size ? 'scale(1.05)' : 'scale(1)'
                  }}
                  aria-label={`${option.name} brush size`}
                  aria-pressed={brushSize === option.size}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              marginTop: '10px' 
            }}
          >
            <button
              onClick={undo}
              style={{
                padding: '12px 25px',
                fontSize: '20px',
                backgroundColor: '#FFC107',
                color: '#333',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #DFA700',
                transition: 'transform 0.1s, box-shadow 0.1s',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = '0 0 0 #DFA700';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #DFA700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #DFA700';
              }}
              aria-label="Undo last drawing action"
            >
              ↩️ Oops! Undo
            </button>

            <button
              onClick={clearCanvas}
              style={{
                padding: '12px 25px',
                fontSize: '20px',
                backgroundColor: '#FF5722',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #D84315',
                transition: 'transform 0.1s, box-shadow 0.1s',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = '0 0 0 #D84315';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #D84315';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #D84315';
              }}
              aria-label="Clear the entire drawing"
            >
              🧹 Start Over
            </button>

            <button
              onClick={saveDrawing}
              style={{
                padding: '15px 30px',
                fontSize: '24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #388E3C',
                transition: 'transform 0.1s, box-shadow 0.1s',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(5px)';
                e.currentTarget.style.boxShadow = '0 0 0 #388E3C';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 0 #388E3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 0 #388E3C';
              }}
              aria-label="Save your drawing and create a story"
            >
              ✨ Create My Story! ✨
            </button>
          </div>
        </div>

        {/* Help text */}
        <div 
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#E8F5E9',
            borderRadius: '15px',
            fontSize: '18px',
            color: '#388E3C',
            textAlign: 'center'
          }}
          aria-live="polite"
        >
          <p><strong>Tips:</strong> Click and drag to draw! Use Ctrl+Z to undo and Escape to clear.</p>
        </div>
      </div>

      {/* Hidden accessible instructions for screen reader users */}
      <div className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>
        <h2>Keyboard shortcuts:</h2>
        <ul>
          <li>Press Control+Z to undo your last drawing action</li>
          <li>Press Escape key to clear the canvas</li>
          <li>Use Tab key to navigate between controls</li>
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
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
    </div>
  );
};

export default DrawingCanvas;