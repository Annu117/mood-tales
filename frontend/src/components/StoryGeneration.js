// src/components/StoryGeneration.js
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { generateStory } from '../utils/storyGeneration';

// Function to find image by ID in story data
const findImageById = (imageId, storyData) => {
  const scene = storyData.scenes.find(scene => scene.id === imageId);
  if (scene) return scene.image;
  
  const character = storyData.characters.find(char => char.id === imageId);
  if (character) return character.image;
  
  return null;
};

// Function to export story as PDF (simplified)
const exportStoryAsPDF = (storyData) => {
  // In a real implementation, you'd use a library like jsPDF
  // This is just a placeholder
  console.log('Exporting story:', storyData);
  
  // Create a hidden link to download text as a fallback
  const element = document.createElement('a');
  const file = new Blob(
    [JSON.stringify(storyData, null, 2)], 
    {type: 'text/plain'}
  );
  element.href = URL.createObjectURL(file);
  element.download = 'my_story.txt';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const StoryGeneration = ({ onBack, storyData, updateNarrative }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const narrative = await generateStory(storyData);
      updateNarrative(narrative);
    } catch (err) {
      setError(err.message || 'Failed to generate story');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExport = () => {
    exportStoryAsPDF(storyData);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h2" gutterBottom align="center">
        Your Story
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Story Generation
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoStoriesIcon />}
              onClick={handleGenerateStory}
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              {isLoading ? 'Creating Story...' : 'Generate Story'}
            </Button>
            
            {storyData.narrative && storyData.narrative.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleGenerateStory}
                disabled={isLoading}
              >
                Regenerate
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {storyData.narrative && storyData.narrative.length > 0 ? (
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {storyData.narrative.map((section, index) => (
                  <Tab label={section.title} key={index} />
                ))}
              </Tabs>
            </Box>
            
            {storyData.narrative.map((section, index) => (
              <Box 
                key={index}
                role="tabpanel"
                hidden={activeTab !== index}
              >
                {activeTab === index && (
                  <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    <CardContent sx={{ flex: '1 0 60%' }}>
                      <Typography variant="h5" gutterBottom>
                        {section.title}
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {section.content}
                      </Typography>
                    </CardContent>
                    
                    {section.imageId && (
                      <CardMedia
                        component="img"
                        sx={{ 
                          width: { xs: '100%', md: '40%' },
                          objectFit: 'contain',
                          backgroundColor: '#f5f5f5'
                        }}
                        image={findImageById(section.imageId, storyData)}
                        alt={section.title}
                      />
                    )}
                  </Card>
                )}
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
              >
                Save Story
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your story will appear here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Generate Story" to create a story with your characters and scenes
            </Typography>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to Scenes
        </Button>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Story saved successfully!"
      />
    </Box>
  );
};

export default StoryGeneration;