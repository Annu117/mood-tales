import React from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import TranslatedText from './common/TranslatedText';

const StoryInput = ({ 
  userInput, 
  setUserInput, 
  isLoading, 
  continueStory, 
  handleKeyPress,
  onShowDrawing,
  drawingAnalysis 
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your story input here..."
        disabled={isLoading}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={continueStory}
          disabled={isLoading || !userInput.trim()}
        >
          <TranslatedText text="Continue Story" />
        </Button>
        
        <Button
          variant="outlined"
          onClick={onShowDrawing}
          disabled={isLoading}
        >
          <TranslatedText text="Draw Instead" />
        </Button>
      </Box>
      
      {drawingAnalysis && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <TranslatedText text="Drawing Analysis" />: {drawingAnalysis}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StoryInput; 