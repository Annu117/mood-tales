// src/utils/imageAnalysis.js
/**
 * Analyzes an image and extracts features from it
 * 
 * @param {string} imageData - Base64 encoded image data
 * @returns {object} Object containing extracted features
 */
export const analyzeImage = async (imageData) => {
    try {
      // In a production environment, this would be a call to the backend API
      // For now, we'll mock the analysis with a local function
      
      // Create a temporary image element to analyze
      const img = document.createElement('img');
      img.src = imageData;
      
      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Create a temporary canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      // Analyze colors
      const colorInfo = analyzeColors(pixelData, canvas.width, canvas.height);
      
      // Analyze shapes (simplified)
      const shapeInfo = analyzeShapes(pixelData, canvas.width, canvas.height);
      
      // Generate description
      const description = generateDescription(colorInfo, shapeInfo);
      
      return {
        dominantColors: colorInfo.dominantColors,
        colorDescription: colorInfo.description,
        shapeFeatures: shapeInfo.features,
        width: canvas.width,
        height: canvas.height,
        aspectRatio: canvas.width / canvas.height,
        characterDescription: description,
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        dominantColors: ['#000000'],
        colorDescription: 'unknown',
        shapeFeatures: [],
        characterDescription: 'a mysterious character',
      };
    }
  };
  
  /**
   * Analyzes the colors in image data
   */
  const analyzeColors = (pixelData, width, height) => {
    const colorCounts = {};
    let totalPixels = 0;
    
    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < pixelData.length; i += 16) {
      // Check if pixel is not transparent
      if (pixelData[i + 3] > 20) {
        totalPixels++;
        
        // Quantize colors to reduce variation
        const r = Math.floor(pixelData[i] / 32) * 32;
        const g = Math.floor(pixelData[i + 1] / 32) * 32;
        const b = Math.floor(pixelData[i + 2] / 32) * 32;
        
        const colorKey = `${r},${g},${b}`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }
    }
    
    // Sort colors by frequency
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    // Convert to hex and get names
    const dominantColors = sortedColors.map(([rgb]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return rgbToHex(r, g, b);
    });
    
    const colorNames = sortedColors.map(([rgb]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return getColorName(r, g, b);
    });
    
    // Create description
    let description = '';
    if (colorNames.length === 1) {
      description = colorNames[0];
    } else if (colorNames.length === 2) {
      description = `${colorNames[0]} and ${colorNames[1]}`;
    } else if (colorNames.length >= 3) {
      description = `${colorNames[0]}, ${colorNames[1]}, and ${colorNames[2]}`;
    }
    
    return {
      dominantColors,
      description
    };
  };
  
  /**
   * Analyzes the shapes in the image
   */
  const analyzeShapes = (pixelData, width, height) => {
    // Find edges of the drawing (non-transparent pixels)
    let left = width;
    let right = 0;
    let top = height;
    let bottom = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        if (pixelData[index + 3] > 20) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
    }
    
    // Calculate aspect ratio and drawing density
    const boundingWidth = right - left;
    const boundingHeight = bottom - top;
    const aspectRatio = boundingWidth / boundingHeight;
    
    // Determine shape features
    const features = [];
    
    if (aspectRatio > 1.5) {
      features.push('wide');
    } else if (aspectRatio < 0.67) {
      features.push('tall');
    } else {
      features.push('round');
    }
    
    // Count filled pixels in the bounding box
    let filledPixels = 0;
    const totalBoundingBoxPixels = boundingWidth * boundingHeight;
    
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        const index = (y * width + x) * 4;
        if (pixelData[index + 3] > 20) {
          filledPixels++;
        }
      }
    }
    
    // Calculate fill density
    const fillRatio = filledPixels / totalBoundingBoxPixels;
    
    if (fillRatio > 0.7) {
      features.push('solid');
    } else if (fillRatio < 0.3) {
      features.push('sparse');
    }
    
    return {
      boundingBox: { left, right, top, bottom },
      aspectRatio,
      fillRatio,
      features
    };
  };
  
  /**
   * Generate a natural language description from features
   */
  const generateDescription = (colorInfo, shapeInfo) => {
    const { description: colorDesc } = colorInfo;
    const { features } = shapeInfo;
    
    let description = `a ${colorDesc}`;
    
    if (features.includes('tall')) {
      description += ' tall';
    } else if (features.includes('wide')) {
      description += ' wide';
    } else if (features.includes('round')) {
      description += ' round';
    }
    
    if (features.includes('solid')) {
      description += ' solid';
    } else if (features.includes('sparse')) {
      description += ' sketchy';
    }
    
    description += ' character';
    
    return description;
  };
  
  /**
   * Converts RGB values to hex color code
   */
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  /**
   * Maps RGB values to color names
   */
  const getColorName = (r, g, b) => {
    // Simple color naming algorithm
    if (r > 200 && g > 200 && b > 200) return 'white';
    if (r < 50 && g < 50 && b < 50) return 'black';
    if (r > 200 && g < 100 && b < 100) return 'red';
    if (r < 100 && g > 200 && b < 100) return 'green';
    if (r < 100 && g < 100 && b > 200) return 'blue';
    if (r > 200 && g > 200 && b < 100) return 'yellow';
    if (r > 200 && g < 100 && b > 200) return 'purple';
    if (r < 100 && g > 200 && b > 200) return 'cyan';
    if (r > 200 && g > 100 && b < 100) return 'orange';
    if (r > 150 && g > 75 && b < 80) return 'brown';
    if (r > 150 && g > 150 && b > 150) return 'gray';
    if (r > 200 && g > 150 && b > 150) return 'pink';
    
    return 'colorful';
  };