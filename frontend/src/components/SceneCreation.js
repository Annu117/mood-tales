// src/components/SceneCreation.js
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import LabelIcon from '@mui/icons-material/Label';
import DrawingCanvas from './DrawingCanvas';
import { analyzeImage } from '../utils/imageAnalysis';

const SceneCreation = ({ onNext, onBack, addScene, scenes }) => {
  const [sceneLabel, setSceneLabel] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleAddKeyword = () => {
    if (currentKeyword.trim()) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddKeyword();
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  const handleSaveScene = async (imageData) => {
    if (!sceneLabel.trim()) {
      setShowAlert(true);
      return;
    }
    
    // Analyze the drawn scene
    const features = await analyzeImage(imageData);
    
    // Create scene object
    const scene = {
      id: Date.now(),
      label: sceneLabel,
      keywords: keywords,
      image: imageData,
      features: features
    };
    
    // Add scene to the story data
    addScene(scene);
    
    // Reset form
    setSceneLabel('');
    setKeywords([]);
    setShowAlert(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h2" gutterBottom align="center">
        Create Your Story Scenes
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <Typography variant="body1" paragraph>
          Draw the scenes for your story. Think about places where your characters will have adventures. 
          Each scene needs a label (like "forest" or "castle") and you can add keywords to help 
          describe your scene.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {showAlert && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setShowAlert(false)}>
            Please give your scene a label before saving!
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Scene Label"
            variant="outlined"
            value={sceneLabel}
            onChange={(e) => setSceneLabel(e.target.value)}
            placeholder="e.g., forest, castle, underwater"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Add Keywords"
              variant="outlined"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., magical, dark, sunny"
              sx={{ mr: 1 }}
            />
            <IconButton 
              color="primary" 
              onClick={handleAddKeyword}
              disabled={!currentKeyword.trim()}
            >
              <AddIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {keywords.map((keyword, index) => (
              <Chip
                key={index}
                icon={<LabelIcon />}
                label={keyword}
                onDelete={() => handleDeleteKeyword(keyword)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
        
        <DrawingCanvas 
          width={600} 
          height={350} 
          onSave={handleSaveScene} 
        />
      </Paper>
      
      {scenes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Scenes
          </Typography>
          <Grid container spacing={2}>
            {scenes.map((scene) => (
              <Grid item xs={12} sm={6} key={scene.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="180"
                    image={scene.image}
                    alt={scene.label}
                    sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                  />
                  <CardContent>
                    <Typography variant="h6">{scene.label}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {scene.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to Characters
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={onNext}
          disabled={scenes.length === 0}
        >
          Next: Create Story
        </Button>
      </Box>
    </Box>
  );
};

export default SceneCreation;