// components/storytelling/StoryReader.jsx
import React from 'react';
import VoiceControls from './VoiceControls.jsx';

const StoryReader = ({ storyHistory }) => {
  const lastMessage = storyHistory[storyHistory.length - 1];
  const lastStoryContent = lastMessage?.type === 'ai' ? lastMessage.content : '';

  return (
    <div style={{ marginTop: '10px' }}>
      {lastStoryContent && <VoiceControls text={lastStoryContent} />}
    </div>
  );
};

export default StoryReader;
