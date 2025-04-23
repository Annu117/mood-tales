// pages/ReadStory.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  Skeleton,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import TranslatedText from '../components/common/TranslatedText';
import VoiceControls from '../components/storytelling/VoiceControls';

const ReadStory = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // In a real app, you would fetch the story from a database or localStorage
  useEffect(() => {
    // Simulate loading story data
    const fetchStory = () => {
      try {
        // For now, just check if we have a story in localStorage as an example
        const savedStories = JSON.parse(localStorage.getItem('stories') || '{}');
        const storyData = savedStories[storyId];
        
        if (storyData) {
          setStory(storyData);
        } else {
          setError("Story not found. It may have been deleted or the link is incorrect.");
        }
      } catch (err) {
        setError("Failed to load story. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    // Simulate network delay
    setTimeout(fetchStory, 1000);
  }, [storyId]);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <TranslatedText text="Read Your Story" />
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            {story?.content}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained">
            <TranslatedText text="Previous Page" />
          </Button>
          <Button variant="contained">
            <TranslatedText text="Next Page" />
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <VoiceControls storyHistory={[story]} />
        </Box>
      </Box>
    </Container>
  );
};

export default ReadStory;
