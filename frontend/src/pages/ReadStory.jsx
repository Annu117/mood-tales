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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      {loading ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
        </Paper>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : story ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {story.title}
          </Typography>
          
          {story.characterImage && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                my: 3,
                border: '1px solid #eee',
                borderRadius: 2,
                p: 2,
                bgcolor: '#f9f9f9'
              }}
            >
              <img 
                src={story.characterImage} 
                alt="Character" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
          
          <Box sx={{ my: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
            {story.content.split('\n').map((paragraph, idx) => (
              <Typography paragraph key={idx}>
                {paragraph}
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Read Another Story
            </Button>
            <Button 
              variant="contained" 
              startIcon={<CreateIcon />}
              onClick={() => navigate('/create')}
            >
              Create New Story
            </Button>
          </Box>
        </Paper>
      ) : (
        <Alert severity="info">No story found with this ID.</Alert>
      )}
    </Container>
  );
};

export default ReadStory;
