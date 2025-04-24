import React, { useState, useRef, useEffect } from 'react';
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

const DrawingExplanation = ({ explanation, onClose }) => {
  const { t } = useLanguage();
  
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
                      {item.details && (
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

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/voice`, {
        language: language
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
          {drawingAnalysis && (
            <Tooltip title={t('View drawing analysis')}>
              <IconButton
                onClick={() => setShowExplanation(true)}
                sx={{
                  backgroundColor: 'info.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'info.dark',
                  },
                }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={continueStory}
            disabled={isLoading || !userInput.trim()}
            endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              minWidth: '48px',
              height: '48px',
              borderRadius: '50%',
              padding: 0,
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>
      </Box>

      {/* Voice Error Alert */}
      {voiceError && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          onClose={() => setVoiceError(null)}
        >
          {voiceError}
        </Alert>
      )}

      {showExplanation && (
        <DrawingExplanation 
          explanation={drawingAnalysis} 
          onClose={() => setShowExplanation(false)} 
        />
      )}
    </>
  );
};

export default StoryInput;
