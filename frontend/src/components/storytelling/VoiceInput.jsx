

import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const VoiceInput = ({ onInputReceived, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [useBackend, setUseBackend] = useState(true); // try backend first


  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    listeningRef.current = isListening;
  }, [isListening]);
  
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
  
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      listeningRef.current = true;
      setIsListening(true);
      setTranscript('');
    };
  
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
  
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
  
      const combinedTranscript = finalTranscript + interimTranscript;
      setTranscript(combinedTranscript);
  
      if (finalTranscript) {
        onInputReceived(finalTranscript);
      }
    };
  
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setShowPermissionDialog(true);
      }
      setError(event.error);
      setIsListening(false);
    };
  
    // recognition.onend = () => {
    //   setIsListening(false);
  
    //   if (recognitionRef.current && isListening) {
    //     recognitionRef.current.start(); // Auto-restart
    //   }
    // };
    // recognition.onend = () => {
    //   setIsListening(false);
    
    //   if (recognitionRef.current && listeningRef.current) {
    //     recognitionRef.current.start(); // Auto-restart
    //   }
    // };
    recognition.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };
  
    return () => {
      recognition.abort();
    };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onInputReceived]);
  const tryBackendSpeechRecognition = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/voice`);

      const data = await response.json();
  
      if (data.success) {
        onInputReceived(data.transcript);
        setTranscript(data.transcript);
      } else {
        console.warn("Backend failed:", data.error);
        setUseBackend(false); // fallback to browser
      }
    } catch (err) {
      console.error("Backend unavailable:", err);
      setUseBackend(false); // fallback
    }
  };
  

  // const toggleListening = () => {
  //   const recognition = recognitionRef.current;
  //   if (!recognition) return;
  
  //   if (!listeningRef.current) {
  //     try {
  //       recognition.start();
  //       setIsListening(true);
  //     } catch (err) {
  //       console.error('Speech recognition error:', err);
  //     }
  //   } else {
  //     recognition.stop();
  //     setIsListening(false);
  //   }
  // };
  const toggleListening = () => {
    if (useBackend) {
      tryBackendSpeechRecognition();
    } else {
      const recognition = recognitionRef.current;
      if (!recognition) return;
  
      if (isListening) {
        recognition.stop();
      } else {
        try {
          recognition.start();
        } catch (err) {
          console.error('Speech recognition error:', err);
        }
      }
    }
  };
  
  
  
  const handleClosePermissionDialog = () => {
    setShowPermissionDialog(false);
  };

  if (error && error !== 'not-allowed' && error !== 'aborted') {
    return (
      <Tooltip title={`Voice input unavailable: ${error}`}>
        <span>
          <IconButton
            disabled
            aria-label="Voice input unavailable"
            sx={{ color: 'text.disabled' }}
          >
            <MicOffIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip title={isListening ? "Stop listening" : "Start voice input"}>
        <span>
          <IconButton
            onClick={toggleListening}
            color={isListening ? "secondary" : "primary"}
            disabled={disabled}
            aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
            sx={{
              position: 'relative',
              '&:focus-visible': {
                outline: '3px solid rgba(78, 125, 233, 0.5)'
              }
            }}
          >
            {isListening ? <MicIcon /> : <MicOffIcon />}
            {isListening && (
              <CircularProgress
                size={48}
                thickness={2}
                sx={{
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  color: 'secondary.main'
                }}
              />
            )}
          </IconButton>
          <Box sx={{ mt: 1 }}>
            <Button onClick={() => setUseBackend(prev => !prev)}>
              Switch to {useBackend ? "Browser" : "Server"} Mode
            </Button>
          </Box>

        </span>
      </Tooltip>

      {isListening && transcript && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            "{transcript}"
          </Typography>
        </Box>
      )}

      <Dialog
        open={showPermissionDialog}
        onClose={handleClosePermissionDialog}
        aria-labelledby="permission-dialog-title"
      >
        <DialogTitle id="permission-dialog-title">
          Microphone Permission Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To use voice input, you need to allow microphone access in your browser settings.
            Please enable microphone permissions and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceInput;
