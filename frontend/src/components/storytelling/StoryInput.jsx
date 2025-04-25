import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useLanguage } from '../../utils/LanguageContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const DrawingExplanation = ({ explanation, onClose }) => {
  const { t } = useLanguage();
  
  // Check if explanation is valid
  if (!explanation || !Array.isArray(explanation) || explanation.length === 0) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('Drawing Analysis')}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <SendIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" color="text.secondary">
            {t('No drawing analysis available.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('Drawing Analysis')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <SendIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {explanation.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.aspect}
                      </Typography>
                      <Chip 
                        label={item.confidence} 
                        size="small"
                        color={item.confidence === 'high' ? 'success' : 'warning'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body1" paragraph>
                        {item.text}
                      </Typography>
                      {item.details && Array.isArray(item.details) && item.details.length > 0 && (
                        <List dense>
                          {item.details.map((detail, idx) => (
                            <ListItem key={idx}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">
                                      {detail.label}
                                    </Typography>
                                    <Chip 
                                      label={detail.score} 
                                      size="small"
                                      color="info"
                                    />
                                  </Box>
                                }
                                secondary={detail.explanation}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < explanation.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StoryInput = ({ 
  userInput, 
  setUserInput, 
  isLoading, 
  continueStory, 
  handleKeyPress,
  onShowDrawing,
  drawingAnalysis,
  language 
}) => {
  const { t } = useLanguage();
  const [showExplanation, setShowExplanation] = useState(false);
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
    <>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'flex-start',
        position: 'relative'
      }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('What happens next?')}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          height: '100%'
        }}>
          <Tooltip title={isListening ? t('Stop Voice Input') : t('Start Voice Input')}>
            <IconButton
              onClick={isListening ? stopVoiceInput : handleVoiceInput}
              disabled={isLoading}
              sx={{
                backgroundColor: isListening ? 'error.main' : 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: isListening ? 'error.dark' : 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                },
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Draw something')}>
            <IconButton
              onClick={onShowDrawing}
              disabled={isLoading}
              sx={{
                backgroundColor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                },
              }}
            >
              <BrushIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Send')}>
            <IconButton
              onClick={continueStory}
              disabled={isLoading || !userInput.trim()}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {voiceError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" onClose={() => setVoiceError(null)}>
            {voiceError}
          </Alert>
        </Box>
      )}

      {drawingAnalysis && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity="info" 
            action={
              <Button color="inherit" size="small" onClick={() => setShowExplanation(true)}>
                {t('View Details')}
              </Button>
            }
          >
            {t('Drawing analyzed! Click to view details.')}
          </Alert>
        </Box>
      )}

      {showExplanation && drawingAnalysis && (
        <DrawingExplanation 
          explanation={drawingAnalysis} 
          onClose={() => setShowExplanation(false)} 
        />
      )}
    </>
  );
};

export default StoryInput;
