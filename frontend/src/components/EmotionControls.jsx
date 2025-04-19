// components/EmotionControls.jsx (Optional component for future feature)
import React from 'react';
import { Box, Typography, Paper, Slider, Stack, Chip } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const emotions = [
  { name: 'Happy', color: '#4caf50' },
  { name: 'Sad', color: '#2196f3' },
  { name: 'Excited', color: '#ff9800' },
  { name: 'Calm', color: '#9c27b0' },
  { name: 'Scared', color: '#f44336' },
];

const EmotionControls = ({ selectedEmotions, onEmotionChange, emotionIntensity, onIntensityChange }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Character Emotions
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select Emotions:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {emotions.map((emotion) => (
            <Chip
              key={emotion.name}
              label={emotion.name}
              onClick={() => onEmotionChange(emotion.name)}
              sx={{ 
                m: 0.5,
                bgcolor: selectedEmotions.includes(emotion.name) ? emotion.color : 'default',
                color: selectedEmotions.includes(emotion.name) ? 'white' : 'inherit',
              }}
            />
          ))}
        </Stack>
      </Box>
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Emotion Intensity:
        </Typography>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <SentimentVeryDissatisfiedIcon />
          <Slider
            value={emotionIntensity}
            onChange={onIntensityChange}
            step={1}
            marks
            min={1}
            max={5}
          />
          <SentimentVerySatisfiedIcon />
        </Stack>
      </Box>
    </Paper>
  );
};

export default EmotionControls;
