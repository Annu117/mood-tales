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
import LanguageIcon from '@mui/icons-material/Language';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ur', name: 'Urdu' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ko', name: 'Korean' }
];

const StorySettings = ({ 
  theme, 
  setTheme, 
  storyLength, 
  setStoryLength, 
  userInput, 
  setUserInput,
  isLoading,
  startNewStory,
  handleKeyPress,
  language,
  setLanguage
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
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="theme-select-label">Story Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              value={theme}
              label="Story Theme"
              onChange={(e) => setTheme(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="adventure">Adventure</MenuItem>
              <MenuItem value="fantasy">Fantasy</MenuItem>
              <MenuItem value="mystery">Mystery</MenuItem>
              <MenuItem value="animal">Animal Tales</MenuItem>
              <MenuItem value="mythology">Mythology</MenuItem>
              <MenuItem value="bedtime">Bedtime Stories</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
            >
              {LANGUAGES.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
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
          disabled={isLoading}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <VoiceInput onInputReceived={handleVoiceInput} disabled={isLoading} />
          </Box>
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