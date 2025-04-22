// components/storytelling/StoryReader.jsx
import { useEffect } from 'react';

const StoryReader = ({ storyHistory }) => {
  useEffect(() => {
    const last = storyHistory[storyHistory.length - 1];
    if (last?.type === 'ai') {
      const utterance = new SpeechSynthesisUtterance(last.content);
      speechSynthesis.cancel(); // Stop any ongoing speech
      speechSynthesis.speak(utterance);
    }
  }, [storyHistory]);

  return null; // This component has no UI
};

export default StoryReader;
