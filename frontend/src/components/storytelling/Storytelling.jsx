import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Box, Typography, TextField, Button, 
  Paper, CircularProgress, Slider, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent
} from '@mui/material';

const Storytelling = () => {
  const [storyHistory, setStoryHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storyLength, setStoryLength] = useState(2); // 1-short, 2-medium, 3-long
  const [theme, setTheme] = useState('adventure');
  const [isStarted, setIsStarted] = useState(false);
  const storyEndRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Scroll to bottom when story updates
  useEffect(() => {
    if (storyEndRef.current) {
      storyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [storyHistory]);

  const startNewStory = async () => {
    setIsLoading(true);
    setIsStarted(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/start-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          storyLength,
          initialPrompt: userInput || "Tell me a story"
        }),
      });
      
      const data = await response.json();
      
      setStoryHistory([{
        type: 'user',
        content: userInput || "Tell me a story"
      }, {
        type: 'ai',
        content: data.storySegment
      }]);
      
    } catch (error) {
      console.error('Error starting story:', error);
      alert('Oops! Something went wrong. Let\'s try again!');
    }
    
    setUserInput('');
    setIsLoading(false);
  };

  const continueStory = async () => {
    if (!userInput.trim()) return;
    
    // Add user input to history
    setStoryHistory([...storyHistory, {
      type: 'user',
      content: userInput
    }]);
    
    setIsLoading(true);
    
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
          theme
        }),
      });
      
      const data = await response.json();
      
      setStoryHistory(prev => [...prev, {
        type: 'ai',
        content: data.storySegment
      }]);
      
    } catch (error) {
      console.error('Error continuing story:', error);
      alert('Oops! Something went wrong. Let\'s try again!');
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

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" sx={{ mt: 4, mb: 2, fontFamily: 'cursive', color: '#4a4a8f' }}>
        Interactive Storytelling Adventure
      </Typography>

      {!isStarted && (
        <Card sx={{ mb: 4, backgroundColor: '#f5f5ff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Story Settings</Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={theme}
                label="Theme"
                onChange={(e) => setTheme(e.target.value)}
              >
                <MenuItem value="adventure">Adventure</MenuItem>
                <MenuItem value="fantasy">Fantasy</MenuItem>
                <MenuItem value="space">Space</MenuItem>
                <MenuItem value="animals">Animals</MenuItem>
                <MenuItem value="underwater">Underwater</MenuItem>
              </Select>
            </FormControl>
            
            <Typography gutterBottom>Story Length</Typography>
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
            />
            
            <TextField
              fullWidth
              label="What would you like a story about?"
              multiline
              rows={2}
              variant="outlined"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Once upon a time in a magical forest..."
              sx={{ mb: 2 }}
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={startNewStory}
              disabled={isLoading}
              sx={{ borderRadius: 8 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Start My Story!'}
            </Button>
          </CardContent>
        </Card>
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
              backgroundColor: '#fffff5',
              borderRadius: 2
            }}
          >
            {storyHistory.map((entry, index) => (
              <Box 
                key={index}
                sx={{ 
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: entry.type === 'user' ? '#e3f2fd' : '#f1f8e9',
                  maxWidth: '85%',
                  ml: entry.type === 'user' ? 'auto' : 0,
                  mr: entry.type === 'user' ? 0 : 'auto',
                }}
              >
                <Typography>
                  {entry.content}
                </Typography>
              </Box>
            ))}
            <div ref={storyEndRef} />
          </Paper>

          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              fullWidth
              label="What happens next?"
              multiline
              rows={2}
              variant="outlined"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              color="primary"
              onClick={continueStory}
              disabled={isLoading || !userInput.trim()}
              sx={{ borderRadius: 8, minWidth: '120px' }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Continue'}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => {
                setIsStarted(false);
                setStoryHistory([]);
                setUserInput('');
              }}
              sx={{ borderRadius: 8 }}
            >
              Start New Story
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Storytelling;