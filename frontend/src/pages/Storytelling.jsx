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
  Link,
  CircularProgress
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StorySettings from '../components/storytelling/StorySettings';
import StorySegment from '../components/storytelling/StorySegment';
import StoryInput from '../components/storytelling/StoryInput';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Zoom } from '@mui/material';
import StoryReader from '../components/storytelling/StoryReader';
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

  const themeOptions = [
    { value: 'adventure', label: t('Adventure') },
    { value: 'fantasy', label: t('Fantasy') },
    { value: 'mystery', label: t('Mystery') },
    { value: 'scifi', label: t('Science Fiction') },
    { value: 'fairy_tale', label: t('Fairy Tale') }
  ];

  const lengthOptions = [
    { value: 1, label: t('Short') },
    { value: 2, label: t('Medium') },
    { value: 3, label: t('Long') }
  ];

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
          initialPrompt: userInput || t("Tell me a story")
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setStoryHistory([{
        type: 'ai',
        content: data.story,
        timestamp: new Date().toISOString()
      }]);
      setAnnouncement(t('Story started!'));
    } catch (err) {
      setError(t('Failed to start story. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const continueStory = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setAnnouncement(t('Generating next part...'));
    
    try {
      const response = await fetch(`${API_BASE_URL}/continue-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyHistory,
          userInput,
          theme: storyTheme,
          storyLength
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setStoryHistory([
        ...storyHistory,
        {
          type: 'user',
          content: userInput,
          timestamp: new Date().toISOString()
        },
        {
          type: 'ai',
          content: data.story,
          timestamp: new Date().toISOString()
        }
      ]);
      
      setUserInput('');
      setAnnouncement(t('Story continued!'));
    } catch (err) {
      setError(t('Failed to continue story. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      continueStory();
    }
  };

  const handleStartNewStory = () => {
    setStoryHistory([]);
    setUserInput('');
    setIsStarted(false);
    setAnnouncement(t('Story reset'));
  };

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('Interactive Storytelling')}
        </Typography>
        
        {!isStarted ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startNewStory}
              disabled={isLoading}
            >
              {t('Start New Story')}
            </Button>
          </Box>
        ) : (
          <>
            <StorySettings
              storyLength={storyLength}
              setStoryLength={setStoryLength}
              storyTheme={storyTheme}
              setStoryTheme={setStoryTheme}
              themeOptions={themeOptions}
              lengthOptions={lengthOptions}
            />
            
            <Box sx={{ my: 4 }}>
              {storyHistory.map((segment, index) => (
                <StorySegment
                  key={index}
                  type={segment.type}
                  content={segment.content}
                  timestamp={segment.timestamp}
                />
              ))}
              <div ref={storyEndRef} />
            </Box>
            
            <StoryInput
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onSubmit={continueStory}
              disabled={isLoading}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleStartNewStory}
              >
                {t('Start Over')}
              </Button>
              
              <Button
                variant="contained"
                onClick={continueStory}
                disabled={isLoading || !userInput.trim()}
              >
                {t('Continue Story')}
              </Button>
            </Box>
          </>
        )}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" onClose={handleErrorClose} sx={{ mt: 2 }}>
            <AlertTitle>{t('Error')}</AlertTitle>
            {error}
          </Alert>
        )}
        
        <Snackbar
          open={!!announcement}
          message={announcement}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
};

export default Storytelling;