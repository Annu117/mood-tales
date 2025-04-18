import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DrawingTool from '../components/DrawingTool';

const DrawingPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Draw Your Character
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Let your creativity shine! Draw your character, and we’ll use it to create a story with emotion recognition.
      </Typography>

      <Box>
        <DrawingTool />
      </Box>
    </Container>
  );
};

export default DrawingPage;
