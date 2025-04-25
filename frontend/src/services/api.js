// services/api.js
// const API_BASE_URL = 'http://127.0.0.1:5000/api';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const analyzeCharacter = async (imageData) => {
  const response = await fetch(`${API_BASE_URL}/analyze-character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze character');
  }
  
  return response.json();
};

export const generateStory = async (characterAnalysis) => {
  const response = await fetch(`${API_BASE_URL}/generate-story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ character: characterAnalysis }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate story');
  }
  
  return response.json();
};

export const generateStoryFromDrawing = async (drawingData) => {
  const response = await fetch(`${API_BASE_URL}/generate-story-from-drawing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      drawing: drawingData.drawing,
      analysis: drawingData.analysis,
      characterName: drawingData.characterName,
      emotion: drawingData.emotion,
      language: drawingData.language || 'en'
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate story from drawing');
  }
  
  return response.json();
};
