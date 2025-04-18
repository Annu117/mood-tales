// CreateStory.jsx
import React, { useState } from 'react';
import { 
  Container, 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Typography,
  Chip,
  Divider,
  Button,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import DrawingCanvas from '../components/DrawingCanvas';
import StoryDisplay from '../components/StoryDisplay';
import { analyzeCharacter, generateStory } from '../services/api';

const steps = ['Draw Character', 'Character Analysis', 'Read Your Story'];

const emotionOptions = ['happy', 'sad', 'angry', 'surprised', 'scared', 'excited'];

const CreateStory = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [characterImage, setCharacterImage] = useState(null);
  const [characterAnalysis, setCharacterAnalysis] = useState(null);
  const [editableAnalysis, setEditableAnalysis] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveDrawing = async (imageData) => {
    setCharacterImage(imageData);
    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeCharacter(imageData);
      setCharacterAnalysis(analysis);
      setEditableAnalysis({
        name: analysis.name,
        description: analysis.description,
        emotion: analysis.emotion,
        characteristics: analysis.characteristics
      });
      setActiveStep(1);
    } catch (err) {
      setError("Oops! We had trouble analyzing your character. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!editableAnalysis) return;

    setLoading(true);
    try {
      const generatedStory = await generateStory({ ...characterAnalysis, ...editableAnalysis });
      setStory(generatedStory);
      setActiveStep(2);
    } catch (err) {
      setError("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCharacterAnalysis = () => {
    if (!characterAnalysis || !editableAnalysis) return null;

    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>Here's what I saw in your drawing:</Typography>
        <Typography variant="body2" paragraph>
          "{characterAnalysis.raw_caption}" (captioned by AI)<br />
          Categories: {characterAnalysis.raw_classification.map((c) => c.label).join(', ')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img 
              src={characterImage} 
              alt="Your character" 
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} 
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={editableAnalysis.name}
              onChange={(e) => setEditableAnalysis({ ...editableAnalysis, name: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={editableAnalysis.description}
              onChange={(e) => setEditableAnalysis({ ...editableAnalysis, description: e.target.value })}
            />

            <TextField
              select
              label="Emotion"
              fullWidth
              margin="normal"
              value={editableAnalysis.emotion}
              onChange={(e) => setEditableAnalysis({ ...editableAnalysis, emotion: e.target.value })}
            >
              {emotionOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>

            <Typography variant="subtitle1" gutterBottom>Colors Detected:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {characterAnalysis.colors.map((color, index) => (
                <Chip key={index} label={color} size="small" />
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom>Features:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {characterAnalysis.features.map((feature, index) => (
                <Chip key={index} label={feature} size="small" />
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom>Personality Traits:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {editableAnalysis.characteristics.map((trait, index) => (
                <Chip key={index} label={trait} size="small" color="primary" />
              ))}
            </Box>

            <Button variant="contained" onClick={handleGenerateStory} disabled={loading}>
              Generate Story with {editableAnalysis.name}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <CircularProgress size={60} />
          <Box sx={{ mt: 2 }}>{activeStep === 0 ? 'Analyzing your character...' : 'Creating a unique story...'}</Box>
        </Box>
      )}

      {!loading && activeStep === 0 && <DrawingCanvas onSaveDrawing={handleSaveDrawing} />}
      {!loading && activeStep === 1 && renderCharacterAnalysis()}
      {!loading && activeStep === 2 && story && <StoryDisplay story={story} characterImage={characterImage} />}
    </Container>
  );
};

export default CreateStory;