import React, { useState, useEffect, useRef } from 'react';
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
  useTheme,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LanguageIcon from '@mui/icons-material/Language';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useLanguage } from '../../utils/LanguageContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const recognitionRef = useRef(null);

  // Language code mapping for both gTTS and browser speech synthesis
  const languageCodes = {
    'en': { gtts: 'en', browser: 'en-US' },      // English
    'es': { gtts: 'es', browser: 'es-ES' },      // Spanish
    'fr': { gtts: 'fr', browser: 'fr-FR' },      // French
    'hi': { gtts: 'hi', browser: 'hi-IN' },      // Hindi
    'zh': { gtts: 'zh', browser: 'zh-CN' },      // Chinese
    'ar': { gtts: 'ar', browser: 'ar-SA' },      // Arabic
    'de': { gtts: 'de', browser: 'de-DE' },      // German
    'ja': { gtts: 'ja', browser: 'ja-JP' },      // Japanese
    'ru': { gtts: 'ru', browser: 'ru-RU' },      // Russian
    'pt': { gtts: 'pt', browser: 'pt-BR' },      // Portuguese
    'bn': { gtts: 'bn', browser: 'bn-BD' },      // Bengali
    'ur': { gtts: 'ur', browser: 'ur-PK' },      // Urdu
    'te': { gtts: 'te', browser: 'te-IN' },      // Telugu
    'ta': { gtts: 'ta', browser: 'ta-IN' },      // Tamil
    'mr': { gtts: 'mr', browser: 'mr-IN' },      // Marathi
    'ko': { gtts: 'ko', browser: 'ko-KR' }       // Korean
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languageCodes[language]?.browser || 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        setVoiceError(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const handleVoiceInput = async () => {
    try {
      setVoiceError(null);
      setIsListening(true);

      // Try backend voice recognition first
      const response = await axios.post(`${API_BASE_URL}/voice`, {
        language: languageCodes[language]?.gtts || 'en'
      });

      if (response.data.success) {
        setUserInput(response.data.transcript);
      } else {
        // Fallback to browser speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.start();
        } else {
          setVoiceError('Speech recognition is not supported in your browser.');
        }
      }
    } catch (err) {
      console.error('Error with voice input:', err);
      // Fallback to browser speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setVoiceError('Speech recognition is not supported in your browser.');
      }
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <Card 
      sx={{ 
        mb: 4, 
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
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1,
            height: '100%',
            minWidth: '48px'
          }}>
            <Tooltip 
              title={isListening ? "Stop Voice Input" : "Start Voice Input"}
              placement="top"
              arrow
            >
              <IconButton
                onClick={isListening ? stopVoiceInput : handleVoiceInput}
                disabled={isLoading}
                sx={{
                  backgroundColor: isListening ? 'error.main' : 'primary.main',
                  color: 'white',
                  width: '48px',
                  height: '48px',
                  minWidth: '48px',
                  '&:hover': {
                    backgroundColor: isListening ? 'error.dark' : 'primary.dark',
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: muiTheme.shadows[2],
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
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

        {voiceError && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              borderRadius: 2,
              boxShadow: muiTheme.shadows[1]
            }}
            onClose={() => setVoiceError(null)}
          >
            {voiceError}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default StorySettings;