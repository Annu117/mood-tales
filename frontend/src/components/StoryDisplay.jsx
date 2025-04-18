import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const StoryDisplay = ({ story, characterImage }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {story.title}
      </Typography>
      
      {characterImage && (
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
            src={characterImage} 
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
        <Button variant="outlined">Read Again</Button>
        <Button variant="contained">Create New Story</Button>
      </Box>
    </Paper>
  );
};

export default StoryDisplay;
