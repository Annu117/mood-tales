import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Button,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VoiceInput from './VoiceInput';

const StorySettings = ({ 
  theme, 
  setTheme, 
  storyLength, 
  setStoryLength, 
  userInput, 
  setUserInput,
  isLoading,
  startNewStory,
  handleKeyPress
}) => {
  const muiTheme = useTheme();
  
  const handleVoiceInput = (text) => {
    setUserInput(text);
  };

  return (
    <Card 
      sx={{ 
        mb: 4, 
        // backgroundColor: 'rgba(245, 245, 255, 0.8)',
        background: 'linear-gradient(135deg, rgba(78, 125, 233, 0.1) 0%, rgba(255, 109, 0, 0.1) 100%)',
        backgroundImage: 'linear-gradient(135deg, rgba(78, 125, 233, 0.05) 0%, rgba(255, 109, 0, 0.05) 100%)',
        borderRadius: 4,
        padding: 3,
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: muiTheme.palette.primary.main }}>
          Story Settings
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            id="theme-select"
            value={theme}
            label="Theme"
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Select story theme"
          >
            <MenuItem value="adventure">Adventure</MenuItem>
            <MenuItem value="fantasy">Fantasy</MenuItem>
            <MenuItem value="space">Space</MenuItem>
            <MenuItem value="animals">Animals</MenuItem>
            <MenuItem value="underwater">Underwater</MenuItem>
          </Select>
        </FormControl>
        
        <Typography id="story-length-slider-label" gutterBottom>
          Story Length
        </Typography>
        <Slider
          value={storyLength}
          min={1}
          max={3}
          step={1}
          marks={[
            { value: 1, label: 'Short' },
            { value: 2, label: 'Medium' },
            { value: 3, label: 'Long' }
          ]}
          onChange={(e, newValue) => setStoryLength(newValue)}
          sx={{ mb: 3 }}
          aria-labelledby="story-length-slider-label"
        />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <TextField
            fullWidth
            id="story-prompt"
            label="What would you like a story about?"
            multiline
            rows={1}
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Once upon a time in a magical forest..."
            sx={{ mr: 1 }}
            aria-label="Story prompt input"
          />
          <VoiceInput onInputReceived={handleVoiceInput} disabled={isLoading} />
        </Box>
        
        <Button 
          variant="contained" 
          color="secondary" 
          fullWidth 
          onClick={startNewStory}
          disabled={isLoading}
          startIcon={isLoading ? null : <AutoStoriesIcon />}
          sx={{ 
            borderRadius: 8,
            py: 1.5,
            fontSize: '1.05rem',
            boxShadow: muiTheme.shadows[4],
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: muiTheme.shadows[6],
            },
            '&:focus-visible': {
              outline: '3px solid rgba(255, 109, 0, 0.5)',
            },
          }}
          aria-label="Start my story"
        >
          {isLoading ? <CircularProgress size={24} /> : 'Start My Story!'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StorySettings;