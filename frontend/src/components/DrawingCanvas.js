import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ onSaveDrawing }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#4e7de9'); // Using primary color from home screen
  const [brushSize, setBrushSize] = useState(10);
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
      setCanvasHeight(newWidth * 0.625);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    showTemporaryMessage("Undo successful!");
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
  
  // Fun color options matching the site's design
  const colorOptions = [
    '#4e7de9', // Primary blue from gradient
    '#ff6d00', // Orange from gradient
    '#f44336', // Red
    '#4caf50', // Green
    '#9c27b0', // Purple
    '#ffc107', // Yellow
    '#000000', // Black
    '#ffffff', // White
  ];

  // Brush size options with descriptive names
  const brushOptions = [
    { name: "Thin", size: 3 },
    { name: "Small", size: 8 },
    { name: "Medium", size: 15 },
    { name: "Large", size: 25 },
    { name: "Extra Large", size: 40 }
  ];

  return (
    <div 
      style={{
        maxWidth: '950px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'inherit', // Using the site's font
      }}
      role="application"
      aria-label="Drawing application"
    >
      {/* Message pop-up */}
      {showMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff6d00',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '999px', // Pill shape like home buttons
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <div 
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}
      >
        <h1 
          style={{
            textAlign: 'center',
            color: '#4e7de9', // Primary blue from home
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '20px'
          }}
        >
          Draw Your Character
        </h1>
        
        <div 
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
              style={{ fontSize: '20px', marginBottom: '12px', color: '#333', fontWeight: 600 }}
              id="color-label"
            >
              Choose a Color
            </h2>
            <div 
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '12px',
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
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: colorOption,
                    cursor: 'pointer',
                    border: color === colorOption ? '3px solid #4e7de9' : '1px solid #ddd',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
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
              style={{ fontSize: '20px', marginBottom: '12px', color: '#333', fontWeight: 600 }}
              id="brush-label"
            >
              Brush Size
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
                    borderRadius: '999px', // Pill shape like home buttons
                    border: 'none',
                    backgroundColor: brushSize === option.size ? '#4e7de9' : '#e0e0e0',
                    color: brushSize === option.size ? 'white' : '#333',
                    cursor: 'pointer',
                    fontWeight: brushSize === option.size ? 'bold' : 'normal',
                    fontSize: '16px',
                    transition: 'all 0.2s',
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
              gap: '12px',
              marginTop: '20px' 
            }}
          >
            <button
              onClick={undo}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#4e7de9',
                border: '1px solid #4e7de9',
                borderRadius: '999px', // Pill shape like home buttons
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(78, 125, 233, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              aria-label="Undo last drawing action"
            >
              Undo
            </button>

            <button
              onClick={clearCanvas}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#ff6d00',
                border: '1px solid #ff6d00',
                borderRadius: '999px', // Pill shape like home buttons
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 109, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              aria-label="Clear the entire drawing"
            >
              Clear Canvas
            </button>

            <button
              onClick={saveDrawing}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#ff6d00', // Secondary color from home
                color: 'white',
                border: 'none',
                borderRadius: '999px', // Pill shape like home buttons
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              aria-label="Save your drawing and create a story"
            >
              Create Story
            </button>
          </div>
        </div>

        {/* Help text */}
        <div 
          style={{
            marginTop: '24px',
            padding: '12px',
            backgroundColor: 'rgba(78, 125, 233, 0.1)', // Light primary color bg
            borderRadius: '12px',
            fontSize: '14px',
            color: '#4e7de9', // Primary color
            textAlign: 'center'
          }}
          aria-live="polite"
        >
          <p><strong>Tip:</strong> Use your mouse or finger to draw. Press Ctrl+Z for undo.</p>
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