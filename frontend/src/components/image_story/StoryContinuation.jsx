import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, useTheme, IconButton, Tooltip, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useLanguage } from '../../utils/LanguageContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const StoryContinuation = ({ userInput, setUserInput, handleContinueStory, isContinuing }) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
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
    <Box 
      sx={{ 
        mt: 6,
        pt: 3,
        borderTop: `1px solid ${theme.palette.divider}` 
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        color="primary" 
        fontWeight="bold"
        id="continue-story-heading"
      >
        {t('Continue the Story')}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 3 }}
      >
        {t('What happens next? Add your ideas to continue the story.')}
      </Typography>
      
      <Box 
        sx={{ display: 'flex', gap: 2 }}
        component="form"
        role="form"
        aria-labelledby="continue-story-heading"
        onSubmit={(e) => {
          e.preventDefault();
          if (userInput.trim() && !isContinuing) {
            handleContinueStory();
          }
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('Type your idea here...')}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isContinuing}
          aria-label={t('Your continuation idea')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }
          }}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          height: '100%',
          minWidth: '48px'
        }}>
          <Tooltip 
            title={isListening ? t('Stop Voice Input') : t('Start Voice Input')}
            placement="top"
            arrow
          >
            <IconButton
              onClick={isListening ? stopVoiceInput : handleVoiceInput}
              disabled={isContinuing}
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
                boxShadow: theme.shadows[2],
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip 
            title={t('Send your continuation')}
            placement="top"
            arrow
          >
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              endIcon={<SendIcon />}
              onClick={handleContinueStory}
              disabled={!userInput.trim() || isContinuing}
              aria-label={t('Submit your continuation idea')}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                minWidth: '48px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[4],
                },
                '&:focus-visible': {
                  outline: '3px solid rgba(255, 109, 0, 0.5)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1.25rem'
                }
              }}
            >
              {isContinuing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('Continue')
              )}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {voiceError && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[1]
          }}
          onClose={() => setVoiceError(null)}
        >
          {voiceError}
        </Alert>
      )}
    </Box>
  );
};

export default StoryContinuation;