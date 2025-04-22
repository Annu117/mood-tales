import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper,
  useTheme,
  Alert,
  AlertTitle,
  Snackbar,
  Link
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StorySettings from '../components/storytelling/StorySettings';
import StorySegment from '../components/storytelling/StorySegment';
import StoryInput from '../components/storytelling/StoryInput';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Zoom } from '@mui/material';
import StoryReader from '../components/storytelling/StoryReader';
import VoiceControls from '../components/storytelling/VoiceControls';

import { useLanguage } from '../utils/LanguageContext';

const Storytelling = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [storyHistory, setStoryHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storyLength, setStoryLength] = useState(2); // 1-short, 2-medium, 3-long
  const [storyTheme, setStoryTheme] = useState('adventure');
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const storyEndRef = useRef(null);
  const announcementRef = useRef(null);
  const [language, setLanguage] = useState('en'); // Default to English

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const saved = localStorage.getItem('storyHistory');
    if (saved) {
      setStoryHistory(JSON.parse(saved));
      setIsStarted(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('storyHistory', JSON.stringify(storyHistory));
  }, [storyHistory]);

  useEffect(() => {
    if (storyEndRef.current) {
      storyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [storyHistory]);

  useEffect(() => {
    if (announcement) {
      const timeoutId = setTimeout(() => {
        setAnnouncement('');
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [announcement]);

  const startNewStory = async () => {
    setIsLoading(true);
    setIsStarted(true);
    setAnnouncement(t('Starting a new story...'));
    
    try {
      const response = await fetch(`${API_BASE_URL}/start-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: storyTheme,
          storyLength,

          initialPrompt: userInput || t("Tell me a story"),

//           initialPrompt: userInput || "Tell me a story",

          language: language
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setStoryHistory([{
        type: 'user',
        content: userInput || t("Tell me a story")
      }, {
        type: 'ai',
        content: data.storySegment
      }]);
      
      setAnnouncement(t('Story started!'));
      
    } catch (error) {
      console.error('Error starting story:', error);
      setError(t('Failed to start story. Please try again.'));
    }
    
    setUserInput('');
    setIsLoading(false);
  };

  const continueStory = async () => {
    if (!userInput.trim()) return;
    
    setStoryHistory([...storyHistory, {
      type: 'user',
      content: userInput
    }]);
    
    setIsLoading(true);
    setAnnouncement(t('Continuing your story...'));
    
    try {
      const response = await fetch(`${API_BASE_URL}/continue-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyHistory: storyHistory.map(item => ({
            role: item.type === 'user' ? 'user' : 'assistant',
            content: item.content
          })),
          userInput,
          storyLength,
          theme: storyTheme,
          language: language
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setStoryHistory(prev => [...prev, {
        type: 'ai',
        content: data.storySegment
      }]);
      
      setAnnouncement(t('Story continued!'));
      
    } catch (error) {
      console.error('Error continuing story:', error);
      setError(t('Failed to continue story. Please try again.'));
    }
    
    setUserInput('');
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isStarted) {
        continueStory();
      } else {
        startNewStory();
      }
    }
  };

  const handleStartNewStory = () => {
    setIsStarted(false);
    setStoryHistory([]);
    setUserInput('');
    setError(null);
    setAnnouncement(t('Story reset'));
  };

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <>
      <StoryReader storyHistory={storyHistory} />

      <Link
        href="#main-storytelling-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          '&:focus': {
            left: '20px',
            top: '20px',
            width: 'auto',
            height: 'auto',
            padding: '10px',
            zIndex: 9999,
            textDecoration: 'none',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          },
        }}
      >
        {t('Skip to main content')}
      </Link>
      
      <div 
        aria-live="polite" 
        ref={announcementRef}
        style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {announcement}
      </div>
      
      <Container 
        maxWidth="md" 
        id="main-storytelling-content"
        component="main"
      >
        <Box sx={{
          py: 4,
          px: { xs: 2, md: 4 },
          mt: 4,
          mb: 4,
        }}>
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              color: theme.palette.primary.main,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontFamily: theme.typography.fontFamily
            }}
            component="h2"
          >
            {t('Interactive Storytelling Adventure')}
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 4, 
              maxWidth: '600px', 
              mx: 'auto',
              color: theme.palette.text.secondary 
            }}
          >
            {t('Create an interactive story together with AI. You provide the ideas and direction, and we\'ll craft an engaging tale that evolves as you participate.')}
          </Typography>

          {!isStarted && (
            <StorySettings 
              theme={storyTheme}
              setTheme={setStoryTheme}
              storyLength={storyLength}
              setStoryLength={setStoryLength}
              userInput={userInput}
              setUserInput={setUserInput}
              isLoading={isLoading}
              startNewStory={startNewStory}
              handleKeyPress={handleKeyPress}
              language={language}
              setLanguage={setLanguage}
            />
          )}

          {isStarted && (
            <>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  height: '60vh', 
                  overflow: 'auto',
                  backgroundColor: 'rgba(255, 255, 245, 0.95)',
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
                role="log"
                aria-label={t('Story conversation')}
                aria-live="polite"
                tabIndex={0}
              >
                {storyHistory.map((entry, index) => (
                  <StorySegment 
                    key={index}
                    entry={entry}
                    isUser={entry.type === 'user'}
                  />
                ))}
                <StoryReader storyHistory={storyHistory} />
                <div ref={storyEndRef} tabIndex={-1} />
              </Paper>

              <VoiceControls storyHistory={storyHistory} language={language} />

              <StoryInput 
                userInput={userInput}
                setUserInput={setUserInput}
                isLoading={isLoading}
                continueStory={continueStory}
                handleKeyPress={handleKeyPress}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={handleStartNewStory}
                  startIcon={<RestartAltIcon />}
                  sx={{ 
                    borderRadius: 8,
                    px: 4,
                    py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    '&:focus-visible': {
                      outline: '3px solid rgba(255, 109, 0, 0.5)',
                    },
                  }}
                  aria-label={t('Start a new story')}
                >
                  {t('Start New Story')}
                </Button>
              </Box>
            </>
          )}
        </Box>
        <Fab
          color="primary"
          size="small"
          aria-label={t('scroll back to top')}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 999,
            boxShadow: theme.shadows[6],
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleErrorClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleErrorClose} 
            severity="error" 
            sx={{ width: '100%' }}
            variant="filled"
          >
            <AlertTitle>{t('Error')}</AlertTitle>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Storytelling;