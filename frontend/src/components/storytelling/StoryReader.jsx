// components/storytelling/StoryReader.jsx
import React from 'react';
import VoiceControls from './VoiceControls.jsx';
import { useLanguage } from '../../utils/LanguageContext';

const StoryReader = ({ storyHistory }) => {
  const { language } = useLanguage();
  const lastMessage = storyHistory[storyHistory.length - 1];
  const lastStoryContent = lastMessage?.type === 'ai' ? lastMessage.content : '';

  return (
    <div style={{ marginTop: '10px' }}>
      {/* {lastStoryContent && <VoiceControls text={lastStoryContent} />} */}
      {lastStoryContent && (
        <VoiceControls 
          storyHistory={[{ type: 'ai', content: lastStoryContent }]} 
          language={language}
        />
      )}
    </div>
  );
};

export default StoryReader;
