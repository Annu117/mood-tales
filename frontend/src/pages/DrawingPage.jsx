import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TranslatedText from '../components/common/TranslatedText';
import DrawingCanvas from '../components/DrawingCanvas';

const DrawingPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <TranslatedText text="Draw Your Character" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <TranslatedText text="Use the drawing tools below to create your character. You can use different colors, brushes, and tools to bring your character to life." />
        </Typography>

        <Box sx={{ mt: 4 }}>
          <DrawingCanvas onComplete={(drawing) => {
            // Handle the completed drawing
            console.log('Drawing completed:', drawing);
          }} />
        </Box>
      </Box>
    </Container>
  );
};

export default DrawingPage;
