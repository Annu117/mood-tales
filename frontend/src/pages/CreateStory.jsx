// CreateStory.jsx
import React, { useState, useEffect } from 'react';
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
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import DrawingCanvas from '../components/DrawingCanvas';
import StoryDisplay from '../components/StoryDisplay';
import { analyzeCharacter, generateStory, generateStoryFromDrawing } from '../services/api';
import { useLanguage } from '../utils/LanguageContext';
import TranslatedText from '../components/common/TranslatedText';
import { StoryInput } from '../components/StoryInput';

const CreateStory = () => {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [characterImage, setCharacterImage] = useState(null);
  const [characterAnalysis, setCharacterAnalysis] = useState(null);
  const [editableAnalysis, setEditableAnalysis] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [storyData, setStoryData] = useState({});

  const steps = [
    <TranslatedText text="Draw Character" />,
    <TranslatedText text="Add Details" />,
    <TranslatedText text="Generate Story" />
  ];

  const emotionOptions = [
    t('happy'),
    t('sad'),
    t('angry'),
    t('surprised'),
    t('scared'),
    t('excited')
  ];

  const handleSaveDrawing = async (imageData) => {
    setCharacterImage(imageData);
    setLoading(true);
    setError(null);
    setIsDrawing(false);

    try {
      const analysis = await analyzeCharacter(imageData);
      setCharacterAnalysis(analysis);
      setEditableAnalysis({
        name: analysis.name,
        description: analysis.description,
        emotion: analysis.emotion,
        characteristics: analysis.characteristics
      });
      setStoryData({ ...storyData, drawing: imageData });
      setActiveStep(1);
    } catch (err) {
      setError(t("Oops! We had trouble analyzing your character. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!editableAnalysis) return;

    setLoading(true);
    try {
      const storyData = {
        drawing: characterImage,
        analysis: characterAnalysis,
        characterName: editableAnalysis.name,
        emotion: editableAnalysis.emotion,
        language: language
      };

      const generatedStory = await generateStoryFromDrawing(storyData);
      setStory(generatedStory);
      setActiveStep(2);
    } catch (err) {
      setError(t("Failed to generate story. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setError(null);
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setCharacterImage(null);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderCharacterAnalysis = () => {
    if (!characterAnalysis || !editableAnalysis) return null;

    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>{t("Here's what I saw in your drawing:")}</Typography>
        <Typography variant="body2" paragraph>
          "{characterAnalysis.description}" ({t("captioned by AI")})<br />
          {t("Categories:")} {characterAnalysis.raw_analysis?.classifications?.map((c) => c.label).join(', ') || t("No categories detected")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img 
              src={characterImage} 
              alt={t("Your character")} 
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} 
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label={t("Name")}
              fullWidth
              margin="normal"
              value={editableAnalysis.name}
              onChange={(e) => setEditableAnalysis({ ...editableAnalysis, name: e.target.value })}
            />

            <TextField
              label={t("Description")}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={editableAnalysis.description}
              onChange={(e) => setEditableAnalysis({ ...editableAnalysis, description: e.target.value })}
            />

            <TextField
              select
              label={t("Emotion")}
              fullWidth
              margin="normal"
              value={editableAnalysis.emotion}
              onChange={(e) => setEditableAnalysis({ ...editableAnalysis, emotion: e.target.value })}
            >
              {emotionOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>

            <Typography variant="subtitle1" gutterBottom>{t("Colors Detected:")}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {characterAnalysis.colors?.map((color, index) => (
                <Chip key={index} label={color} size="small" />
              )) || <Typography variant="body2">{t("No colors detected")}</Typography>}
            </Box>

            <Typography variant="subtitle1" gutterBottom>{t("Features:")}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {characterAnalysis.features?.map((feature, index) => (
                <Chip key={index} label={feature} size="small" />
              )) || <Typography variant="body2">{t("No features detected")}</Typography>}
            </Box>

            <Typography variant="subtitle1" gutterBottom>{t("AI Analysis:")}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {characterAnalysis.explanation?.map((item, index) => (
                <Box key={index}>
                  <Typography variant="subtitle2">{item.aspect}</Typography>
                  <Typography variant="body2">{item.text}</Typography>
                  {item.details && (
                    <Box sx={{ pl: 2 }}>
                      {item.details.map((detail, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{detail.label}</Typography>
                          <Chip label={detail.score} size="small" color="info" />
                          <Typography variant="body2" color="text.secondary">
                            {detail.explanation}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Button variant="contained" onClick={handleGenerateStory} disabled={loading}>
              {t("Generate Story with")} {editableAnalysis.name}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <TranslatedText text="Create New Story" />
        </Typography>
        
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
            <Box sx={{ mt: 2 }}>{activeStep === 0 ? t("Analyzing your character...") : t("Creating a unique story...")}</Box>
          </Box>
        )}

        {!loading && activeStep === 0 && (
          <Box sx={{ textAlign: 'center' }}>
            {!isDrawing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartDrawing}
                sx={{ mb: 3 }}
              >
                <TranslatedText text="Start Drawing" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelDrawing}
                  sx={{ mb: 3 }}
                >
                  <TranslatedText text="Cancel Drawing" />
                </Button>
                <DrawingCanvas onSaveDrawing={handleSaveDrawing} />
              </>
            )}
          </Box>
        )}

        {!loading && activeStep === 1 && renderCharacterAnalysis()}
        {!loading && activeStep === 2 && story && (
          <StoryDisplay 
            story={story} 
            characterImage={characterImage} 
            analysis={characterAnalysis}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            <TranslatedText text="Back" />
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            <TranslatedText text="Next" />
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateStory;