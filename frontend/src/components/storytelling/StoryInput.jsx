import React, { useRef, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import VoiceInput from './VoiceInput';

const StoryInput = ({ 
  userInput, 
  setUserInput, 
  isLoading, 
  continueStory, 
  handleKeyPress
}) => {
  const theme = useTheme();
  const inputRef = useRef(null);

  const handleVoiceInput = (text) => {
    setUserInput(text);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        mb: 3,
        alignItems: 'flex-start',
        gap: 1,
      }}
      aria-label="Story input section"
    >
      <TextField
        inputRef={inputRef}
        fullWidth
        id="story-input"
        label="What happens next?"
        multiline
        rows={2}
        variant="outlined"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        aria-label="Enter your next story input"
        aria-describedby="story-input"
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />

      <VoiceInput onInputReceived={handleVoiceInput} disabled={isLoading} />

      <Button 
        variant="contained" 
        color="primary"
        onClick={continueStory}
        disabled={isLoading || !userInput.trim()}
        startIcon={isLoading ? null : <SendIcon />}
        sx={{ 
          borderRadius: 8, 
          minWidth: '120px',
          height: '100%',
          py: 1.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[3],
          },
          '&:focus-visible': {
            outline: '3px solid rgba(78, 125, 233, 0.5)',
          },
        }}
        aria-label="Continue the story"
        title="Click to continue the story"
      >
        {isLoading ? <CircularProgress size={24} /> : 'Continue'}
      </Button>
    </Box>
  );
};

export default StoryInput;
