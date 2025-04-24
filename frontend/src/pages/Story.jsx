import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Alert, 
  Button, 
  CircularProgress, 
  Typography,
  Paper,
  Fab,
  Tooltip,
  IconButton
} from '@mui/material';
import { Stop as StopIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { useLanguage } from '../utils/LanguageContext';
import { generateStory, continueStory } from '../utils/storyGeneration';
import { downloadStoryAsPDF, downloadImage as downloadImageUtil } from '../components/image_story/storyUtils';
import ScreenReaderAnnouncer, { useScreenReaderAnnouncement } from '../utils/ScreenReaderAnnouncer';
import { 
  captureEmotion, 
  testEmotionAPI, 
  startEmotionMonitoring, 
  stopEmotionMonitoring, 
  getLatestEmotion 
} from '../utils/emotionDetection';
import axios from 'axios';

// Component imports
import StoryHeader from '../components/image_story/StoryHeader';
import StoryPreferencesSection from '../components/image_story/StoryPreferencesSection';
import StorySection from '../components/image_story/StorySection';

const Story = () => {
  const { t } = useLanguage();
  const { announce } = useScreenReaderAnnouncement();
  const [age, setAge] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [favGenres, setFavGenres] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [useCulturalContext, setUseCulturalContext] = useState(true);
  const [useMythology, setUseMythology] = useState(false);
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [story, setStory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState({});
  const [userInput, setUserInput] = useState('');
  const [storyHistory, setStoryHistory] = useState([]);
  const [isContinuing, setIsContinuing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [emotionError, setEmotionError] = useState(null);
  const emotionIntervalRef = useRef(null);
  const storyRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const recognitionRef = useRef(null);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
      if (isMonitoring) {
        stopEmotionMonitoring().catch(console.error);
      }
    };
  }, [isMonitoring]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

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
  }, [selectedLanguage]);

  const startMonitoring = async () => {
    try {
      await startEmotionMonitoring();
      setIsMonitoring(true);
      setEmotionError(null);
      announce(t('Emotion monitoring started'));

      // Poll for latest emotion every second
      emotionIntervalRef.current = setInterval(async () => {
        try {
          const emotionData = await getLatestEmotion();
          if (emotionData && emotionData.status !== 'no_emotion_data') {
            setCurrentEmotion(emotionData);
          }
        } catch (err) {
          console.error('Error getting latest emotion:', err);
        }
      }, 1000);
    } catch (err) {
      setEmotionError(err.message || t('Failed to start emotion monitoring'));
      announce(t('Error starting emotion monitoring'), 'assertive');
    }
  };

  const stopMonitoring = async () => {
    try {
      await stopEmotionMonitoring();
      setIsMonitoring(false);
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
      announce(t('Emotion monitoring stopped'));
    } catch (err) {
      setEmotionError(err.message || t('Failed to stop emotion monitoring'));
      announce(t('Error stopping emotion monitoring'), 'assertive');
    }
  };

  const handleCaptureEmotion = async () => {
    setIsLoading(true);
    setEmotionError(null);
    try {
      const emotionData = await captureEmotion();
      setCurrentEmotion(emotionData);
      announce(t('Emotion captured successfully!'));
    } catch (err) {
      setEmotionError(err.message || t('Failed to capture emotion. Please try again.'));
      announce(t('Error capturing emotion. Please try again.'), 'assertive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setError(null);
    setUserInput('');
    setStoryHistory([]);
    announce(t('Generating your story, please wait...'));
    
    try {
      const storyData = {
        prompt: userInput || t('Create a story'),
        story_length: 2,
        theme: selectedGenre,
        history: storyHistory,
        language: selectedLanguage,
        emotion: currentEmotion?.dominant_emotion || 'neutral',
        user_preferences: {
          age,
          genre: selectedGenre,
          characterName,
          useCulturalContext,
          useMythology,
          specialNeeds
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/generate-emotion-aware-story`, storyData);
      const generated = response.data;
      
      // Create story sections with images and parts
      const storySections = [{
        title: t('Chapter 1'),
        content: generated.story,
        emotion: generated.emotion,
        emotionContext: generated.emotion_context,
        images: generated.images,
        parts: generated.parts,
        userPreferences: generated.user_preferences
      }];
      
      setStory(storySections);
      setGeneratedImages(generated.images);
      announce(t('Story generated successfully!'));
      
      setStoryHistory([{
        role: 'assistant',
        content: generated.story
      }]);
    } catch (err) {
      setError(err.message || t('Failed to generate story. Please try again.'));
      announce(t('Error generating story. Please try again.'), 'assertive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueStory = async () => {
    if (!userInput.trim() || !story.length) return;
    
    setIsContinuing(true);
    setError(null);
    announce(t('Continuing your story...'));
    
    try {
      const updatedHistory = [
        ...storyHistory,
        { role: 'user', content: userInput }
      ];
      
      const storyData = {
        prompt: userInput,
        story_length: 2,
        theme: selectedGenre,
        history: updatedHistory,
        language: selectedLanguage,
        emotion: currentEmotion?.dominant_emotion || 'neutral',
        user_preferences: {
          age,
          genre: selectedGenre,
          characterName,
          useCulturalContext,
          useMythology,
          specialNeeds
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/generate-emotion-aware-story`, storyData);
      const continued = response.data;
      
      const newSection = {
        title: `Chapter ${story.length + 1}`,
        content: continued.story,
        emotion: continued.emotion,
        emotionContext: continued.emotion_context,
        images: continued.images,
        parts: continued.parts,
        userPreferences: continued.user_preferences
      };
      
      setStory([...story, newSection]);
      setGeneratedImages({...generatedImages, ...continued.images});
      announce(t('Story continued successfully!'));
      
      setStoryHistory([
        ...updatedHistory,
        { role: 'assistant', content: continued.story }
      ]);
      
      setUserInput('');
    } catch (err) {
      setError(err.message || t('Failed to continue the story. Please try again.'));
      announce(t('Error continuing story. Please try again.'), 'assertive');
    } finally {
      setIsContinuing(false);
    }
  };

  // Wrapper for the PDF download function
  const handleDownloadStoryAsPDF = () => {
    downloadStoryAsPDF(storyRef, story);
  };

  // Wrapper for the image download function
  const handleDownloadImage = (part, sectionIndex) => {
    downloadImageUtil(part, sectionIndex, story);
  };

  const handleVoiceInput = async () => {
    try {
      setVoiceError(null);
      setIsListening(true);

      // Try backend voice recognition first
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/voice`, {
        language: selectedLanguage
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
    <Box component="main" style={{ padding: '2%' }}>
      <ScreenReaderAnnouncer />
      {/* Header with gradient background */}
      {/* <StoryHeader /> */}

      <Container maxWidth="lg">
        {/* Preferences Panel */}
        <StoryPreferencesSection 
          age={age}
          setAge={setAge}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          favGenres={favGenres}
          setFavGenres={setFavGenres}
          characterName={characterName}
          setCharacterName={setCharacterName}
          useCulturalContext={useCulturalContext}
          setUseCulturalContext={setUseCulturalContext}
          useMythology={useMythology}
          setUseMythology={setUseMythology}
          specialNeeds={specialNeeds}
          setSpecialNeeds={setSpecialNeeds}
          handleGenerateStory={handleGenerateStory}
          isLoading={isLoading}
        />

        {/* Emotion Monitoring Section */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom>
              {t('Emotion Detection')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('Our AI analyzes your facial expressions to understand your emotions. This helps us create stories that match your mood and make the experience more engaging.')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button 
                variant="contained" 
                color={isMonitoring ? "secondary" : "primary"}
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                disabled={isLoading}
                startIcon={isMonitoring ? <CircularProgress size={20} /> : null}
              >
                {isMonitoring ? t('Stop Monitoring') : t('Start Emotion Monitoring')}
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleCaptureEmotion}
                disabled={isLoading || isMonitoring}
              >
                {t('Capture Single Emotion')}
              </Button>
            </Box>
          </Paper>
          
          {currentEmotion && (
            <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                {t('Current Emotion Analysis')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('The AI has detected the following emotions from your facial expressions. The dominant emotion will influence the tone and theme of your story.')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #90caf9',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h5" color="primary" align="center">
                    {t('Dominant Emotion')}: {currentEmotion.dominant_emotion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {t('This emotion will shape the story\'s mood and themes')}
                  </Typography>
                </Paper>
                {currentEmotion.emotion_scores && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('Emotion Scores')}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('These scores show how strongly each emotion was detected in your expression.')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {Object.entries(currentEmotion.emotion_scores).map(([emotion, score]) => (
                        <Paper 
                          key={emotion} 
                          elevation={1} 
                          sx={{ 
                            p: 1, 
                            backgroundColor: emotion === currentEmotion.dominant_emotion ? '#e3f2fd' : 'white',
                            border: emotion === currentEmotion.dominant_emotion ? '1px solid #90caf9' : 'none'
                          }}
                        >
                          <Typography variant="body2">
                            {emotion}: {score.toFixed(2)}%
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          )}
          
          {emotionError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {emotionError}
            </Alert>
          )}
        </Box>

        {/* Floating Stop Button */}
        {isMonitoring && (
          <Tooltip title={t('Stop Emotion Monitoring')}>
            <Fab
              color="secondary"
              aria-label="stop monitoring"
              onClick={stopMonitoring}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000
              }}
            >
              <StopIcon />
            </Fab>
          </Tooltip>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: '1.5rem' }  
            }}
          >
            {error}
          </Alert>
        )}

        {/* Voice Input Button */}
        <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
          <Tooltip title={isListening ? t('Stop Voice Input') : t('Start Voice Input')}>
            <IconButton
              color={isListening ? 'secondary' : 'primary'}
              onClick={isListening ? stopVoiceInput : handleVoiceInput}
              sx={{
                backgroundColor: 'white',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: isListening ? '#ffebee' : '#e3f2fd'
                }
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Voice Error Alert */}
        {voiceError && (
          <Alert 
            severity="error" 
            sx={{ 
              position: 'fixed',
              bottom: 80,
              left: 20,
              zIndex: 1000,
              maxWidth: '80%'
            }}
            onClose={() => setVoiceError(null)}
          >
            {voiceError}
          </Alert>
        )}

        {/* Generated Story Sections */}
        <Box 
          sx={{ mt: 4 }} 
          ref={storyRef}
          aria-live="polite"
        >
          {story.map((section, sectionIndex) => (
            <Box key={sectionIndex} sx={{ mb: 4 }}>
              {section.emotion && (
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #90caf9',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle1" color="primary">
                    {t('Story Emotion')}: {section.emotion}
                  </Typography>
                  {section.emotionContext && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {t('Story Tone')}: {section.emotionContext.tone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('Theme Elements')}: {section.emotionContext.theme_elements}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('The story has been crafted to match your emotional state, using appropriate themes and tone.')}
                      </Typography>
                    </>
                  )}
                </Paper>
              )}
              <StorySection 
                section={section}
                sectionIndex={sectionIndex}
                totalSections={story.length}
                downloadStoryAsPDF={handleDownloadStoryAsPDF}
                downloadImage={handleDownloadImage}
                userInput={userInput}
                setUserInput={setUserInput}
                handleContinueStory={handleContinueStory}
                isContinuing={isContinuing}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Story;