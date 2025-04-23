import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../../utils/LanguageContext';

export const useCanvas = (onSaveDrawingCallback, showMessage) => {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#4e7de9');
  const [brushSize, setBrushSize] = useState(10);
  const [history, setHistory] = useState([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    setContext(ctx);

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Update context when color or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context]);

  // Keyboard shortcuts
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

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL();
    setHistory((prev) => [...prev, imageData]);
  };

  const undo = () => {
    if (history.length === 0) {
      showMessage(t("Nothing to undo!"));
      return;
    }
    
    const previous = history[history.length - 1];
    const img = new Image();
    img.src = previous;
    img.onload = () => {
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
        setHistory((prev) => prev.slice(0, -1));
      }
    };
    showMessage(t("Undo successful!"));
  };

  const startDrawing = (e) => {
    if (!context) return;
    
    saveToHistory();
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing || !context) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    
    context.closePath();
    setDrawing(false);
  };

  const getCoordinates = (e) => {
    if (!canvasRef.current) {
      return { offsetX: 0, offsetY: 0 };
    }
    
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
    if (!context || !canvasRef.current) return;
    
    saveToHistory();
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    showMessage(t("Canvas cleared!"));
  };

  const saveDrawing = () => {
    if (!canvasRef.current) return;
    
    const image = canvasRef.current.toDataURL('image/png');
    onSaveDrawingCallback(image);
    showMessage(t("Creating your story!"));
  };

  return {
    canvasRef,
    color,
    setColor,
    brushSize,
    setBrushSize,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    clearCanvas,
    saveDrawing
  };
};