import { useState } from 'react';

/**
 * Custom hook for handling story API interactions
 */
const useStoryApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  /**
   * Start a new story
   * @param {string} theme - The story theme
   * @param {number} storyLength - Story length (1-short, 2-medium, 3-long)
   * @param {string} initialPrompt - The initial story prompt
   * @returns {Promise<Object>} - Story data response
   */
  const startStory = async (theme, storyLength, initialPrompt) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/start-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          storyLength,
          initialPrompt: initialPrompt || "Tell me a story"
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setIsLoading(false);
      return data;
      
    } catch (error) {
      console.error('Error starting story:', error);
      setError('Failed to start the story. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Continue an existing story
   * @param {Array} storyHistory - Previous story exchanges
   * @param {string} userInput - User's latest input
   * @param {number} storyLength - Story length setting
   * @param {string} theme - Story theme
   * @returns {Promise<Object>} - Story continuation data
   */
  const continueStory = async (storyHistory, userInput, storyLength, theme) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/continue-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyHistory: storyHistory.map(item => ({
            role: item.type === 'user' ? 'user' : 'assistant',
            content: item.content
          })),
          userInput,
          storyLength,
          theme
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setIsLoading(false);
      return data;
      
    } catch (error) {
      console.error('Error continuing story:', error);
      setError('Failed to continue the story. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  return {
    startStory,
    continueStory,
    isLoading,
    error,
    setError
  };
};

export default useStoryApi;